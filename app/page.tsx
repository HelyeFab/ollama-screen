"use client";

import { useState, useEffect, useRef } from "react";
import { FiSend, FiDownload, FiSettings, FiChevronDown } from "react-icons/fi";
import { Dialog, ConfirmDialog, Dropdown, DropdownItem } from "@/components/ui";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { LlamaIcon } from "@/components/LlamaIcon";
import {
  chatDB,
  ChatSession,
  ChatMessage as DBChatMessage,
  generateChatTitle,
  generateChatId,
} from "@/lib/db";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Model = {
  name: string;
  size: number;
  modified_at: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("llama3.2");
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModelManager, setShowModelManager] = useState(false);
  const [newModelName, setNewModelName] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant?: 'success' | 'error' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'info',
  });

  // Fetch available models on mount
  useEffect(() => {
    fetchModels();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchModels = async () => {
    try {
      const res = await fetch("http://localhost:11434/api/tags");
      const data = await res.json();
      setModels(data.models || []);
      if (data.models && data.models.length > 0 && !selectedModel) {
        setSelectedModel(data.models[0].name);
      }
    } catch (error) {
      console.error("Failed to fetch models:", error);
    }
  };

  // Save current chat to IndexedDB
  const saveCurrentChat = async (updatedMessages: Message[]) => {
    if (updatedMessages.length === 0) return;

    try {
      const chatId = currentChatId || generateChatId();
      const title = generateChatTitle(
        updatedMessages.map((m) => ({
          ...m,
          timestamp: Date.now(),
        }))
      );

      const chatSession: ChatSession = {
        id: chatId,
        title,
        model: selectedModel,
        messages: updatedMessages.map((m) => ({
          ...m,
          timestamp: Date.now(),
        })),
        createdAt: currentChatId ? (await chatDB.getChat(chatId))?.createdAt || Date.now() : Date.now(),
        updatedAt: Date.now(),
      };

      await chatDB.saveChat(chatSession);

      if (!currentChatId) {
        setCurrentChatId(chatId);
      }
    } catch (error) {
      console.error('Failed to save chat:', error);
    }
  };

  // Load a chat from IndexedDB
  const loadChat = async (chatId: string) => {
    try {
      const chat = await chatDB.getChat(chatId);
      if (chat) {
        setMessages(chat.messages);
        setSelectedModel(chat.model);
        setCurrentChatId(chat.id);
      }
    } catch (error) {
      console.error('Failed to load chat:', error);
    }
  };

  // Create a new chat
  const createNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setInput('');
  };

  // Handle chat deletion
  const handleDeleteChat = (chatId: string) => {
    if (chatId === currentChatId) {
      createNewChat();
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          messages: updatedMessages,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Validate response structure
      if (!data || !data.message || !data.message.content) {
        console.error("Invalid response structure:", data);
        throw new Error("Invalid response from Ollama server");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message.content,
      };
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      // Save chat after receiving response
      await saveCurrentChat(finalMessages);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: error instanceof Error
          ? `Error: ${error.message}. Make sure Ollama is running and the model "${selectedModel}" is available.`
          : "Error: Could not connect to Ollama server. Make sure it's running.",
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      await saveCurrentChat(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const pullModel = async () => {
    if (!newModelName.trim() || isDownloading) return;
    setIsDownloading(true);

    try {
      const response = await fetch("http://localhost:11434/api/pull", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newModelName }),
      });

      if (response.ok) {
        setAlertDialog({
          isOpen: true,
          title: 'Success',
          message: `Model ${newModelName} is being downloaded!`,
          variant: 'success',
        });
        setNewModelName("");
        // Refresh model list after a delay
        setTimeout(fetchModels, 2000);
      } else {
        setAlertDialog({
          isOpen: true,
          title: 'Error',
          message: 'Failed to download model',
          variant: 'error',
        });
      }
    } catch (error) {
      console.error("Error pulling model:", error);
      setAlertDialog({
        isOpen: true,
        title: 'Connection Error',
        message: 'Could not connect to Ollama server',
        variant: 'error',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const deleteModel = async (modelName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Model',
      message: `Are you sure you want to delete model "${modelName}"? This action cannot be undone.`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          const response = await fetch("http://localhost:11434/api/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: modelName }),
          });

          if (response.ok) {
            setAlertDialog({
              isOpen: true,
              title: 'Success',
              message: `Model ${modelName} deleted successfully!`,
              variant: 'success',
            });
            fetchModels();
          } else {
            setAlertDialog({
              isOpen: true,
              title: 'Error',
              message: 'Failed to delete model',
              variant: 'error',
            });
          }
        } catch (error) {
          console.error("Error deleting model:", error);
          setAlertDialog({
            isOpen: true,
            title: 'Connection Error',
            message: 'Could not connect to Ollama server',
            variant: 'error',
          });
        }
      },
    });
  };

  const formatSize = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)} GB`;
  };

  return (
    <div className="flex h-screen bg-theme-bg-primary">
      {/* Sidebar */}
      <ChatSidebar
        currentChatId={currentChatId}
        onSelectChat={loadChat}
        onNewChat={createNewChat}
        onDeleteChat={handleDeleteChat}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-theme-bg-secondary/95 backdrop-blur-sm shadow-sm border-b border-theme-border">
          {/* Desktop Header - Single Row */}
          <div className="hidden lg:flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <img
                src="/icons/lama.svg"
                alt="Ollama Logo"
                className="w-7 h-7 flex-shrink-0"
              />
              <h1 className="text-2xl font-title font-bold text-theme-text-primary">
                Ollama Screen
              </h1>
            </div>
            <div className="flex gap-2 items-center">
              <ThemeSwitcher />
              <Dropdown
                trigger={
                  <button className="px-4 py-2 border border-theme-border rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-tertiary transition-colors flex items-center gap-2">
                    <span>{selectedModel || 'Select Model'}</span>
                    <FiChevronDown size={16} />
                  </button>
                }
                items={models.map((model) => ({
                  label: `${model.name} (${formatSize(model.size)})`,
                  value: model.name,
                }))}
                onSelect={(value) => setSelectedModel(value)}
                align="right"
              />
              <button
                onClick={() => setShowModelManager(!showModelManager)}
                className="p-2 rounded-lg hover:bg-theme-bg-tertiary transition-colors text-theme-text-primary"
                aria-label="Manage Models"
              >
                <FiSettings size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Header - Modern Single Row Design */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              {/* Left: Hamburger Menu */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex-shrink-0 p-2.5 rounded-xl hover:bg-theme-bg-tertiary active:scale-95 transition-all duration-200 text-theme-text-primary touch-manipulation"
                aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                aria-expanded={sidebarOpen}
              >
                <img
                  src="/icons/menu.svg"
                  alt={sidebarOpen ? 'Close menu' : 'Open menu'}
                  className={`w-6 h-6 transition-transform duration-300 ${sidebarOpen ? 'rotate-90' : ''}`}
                />
              </button>

              {/* Center: App Name with Logo - Bold Typography */}
              <div className="flex-1 flex items-center justify-center gap-2 px-2">
                <img
                  src="/icons/lama.svg"
                  alt="Ollama Logo"
                  className="w-5 h-5 flex-shrink-0"
                />
                <h1 className="text-lg font-title font-bold text-theme-text-primary truncate">
                  Ollama Screen
                </h1>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <ThemeSwitcher />
                <button
                  onClick={() => setShowModelManager(!showModelManager)}
                  className="p-2.5 rounded-xl hover:bg-theme-bg-tertiary active:scale-95 transition-all duration-200 text-theme-text-primary touch-manipulation"
                  aria-label="Manage Models"
                  aria-expanded={showModelManager}
                >
                  <FiSettings size={22} />
                </button>
              </div>
            </div>

            {/* Model Selector - Full Width Below */}
            <div className="px-4 pb-3">
              <Dropdown
                trigger={
                  <button className="w-full px-4 py-3 border border-theme-border rounded-xl bg-theme-bg-tertiary/50 text-theme-text-primary hover:bg-theme-bg-tertiary active:scale-[0.98] transition-all duration-200 flex items-center justify-between gap-2 text-base font-medium touch-manipulation">
                    <span className="truncate">{selectedModel || 'Select Model'}</span>
                    <FiChevronDown size={18} className="flex-shrink-0 transition-transform duration-200" />
                  </button>
                }
                items={models.map((model) => ({
                  label: `${model.name} (${formatSize(model.size)})`,
                  value: model.name,
                }))}
                onSelect={(value) => setSelectedModel(value)}
                align="right"
              />
            </div>
          </div>
        </header>

      {/* Model Manager */}
      {showModelManager && (
        <div className="bg-theme-bg-secondary border-b border-theme-border p-4">
          <h3 className="font-bold mb-4 text-lg text-theme-text-primary">Model Manager</h3>

          {/* Download new model */}
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                placeholder="Enter model name (e.g., mistral, codellama)"
                className="flex-1 px-4 py-2.5 border border-theme-border rounded-lg bg-theme-bg-secondary text-theme-text-primary text-base"
                disabled={isDownloading}
              />
              <button
                onClick={pullModel}
                disabled={isDownloading}
                className="px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2 text-base font-medium"
              >
                <FiDownload size={20} />
                {isDownloading ? "Downloading..." : "Download"}
              </button>
            </div>
          </div>

          {/* Installed models */}
          <div>
            <h4 className="font-semibold mb-3 text-base text-theme-text-secondary">Installed Models:</h4>
            <div className="space-y-2">
              {models.map((model) => (
                <div
                  key={model.name}
                  className="flex items-center justify-between p-3 bg-theme-bg-tertiary rounded"
                >
                  <div>
                    <span className="font-medium text-theme-text-primary text-base">{model.name}</span>
                    <span className="text-base text-theme-text-secondary ml-2">
                      ({formatSize(model.size)})
                    </span>
                  </div>
                  <button
                    onClick={() => deleteModel(model.name)}
                    className="px-4 py-2 bg-red-500 text-white text-base rounded hover:bg-red-600 font-medium"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-fade-in">
            <div className="mb-6 animate-bounce-subtle">
              <LlamaIcon />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-theme-text-primary mb-3">
              Start a conversation with Ollama
            </h2>
            <p className="text-base md:text-lg text-theme-text-secondary max-w-md">
              Type a message below to begin chatting with your AI assistant
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-theme-text-tertiary">
              <span className="w-2 h-2 rounded-full bg-theme-accent animate-pulse"></span>
              <span>Ready to chat</span>
            </div>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 mt-1">
                <img
                  src="/icons/lama.svg"
                  alt="Ollama"
                  className="w-6 h-6 md:w-7 md:h-7"
                />
              </div>
            )}
            <div
              className={`max-w-[85%] md:max-w-[80%] rounded-lg p-4 text-base md:text-lg leading-relaxed ${
                message.role === "user"
                  ? "bg-theme-accent text-white"
                  : "bg-theme-bg-secondary text-theme-text-primary shadow border border-theme-border"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            </div>
            {message.role === "user" && (
              <div className="flex-shrink-0 mt-1">
                <img
                  src="/icons/coffee.svg"
                  alt="User"
                  className="w-6 h-6 md:w-7 md:h-7"
                />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-2 justify-start">
            <div className="flex-shrink-0 mt-1">
              <img
                src="/icons/lama.svg"
                alt="Ollama"
                className="w-6 h-6 md:w-7 md:h-7 animate-pulse"
              />
            </div>
            <div className="bg-theme-bg-secondary border border-theme-border rounded-lg p-4 shadow">
              <p className="text-theme-text-secondary text-base md:text-lg">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-theme-bg-secondary border-t border-theme-border p-4 md:p-5 safe-area-bottom">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 md:px-5 py-3.5 border border-theme-border rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-accent bg-theme-bg-secondary text-theme-text-primary placeholder:text-theme-text-tertiary text-base md:text-lg"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-5 md:px-7 py-3.5 bg-theme-accent text-white rounded-lg hover:bg-theme-accent-hover disabled:opacity-50 font-medium flex items-center gap-2 min-w-[90px] md:min-w-[110px] justify-center text-base md:text-lg"
          >
            <FiSend size={20} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          variant={confirmDialog.variant}
          confirmText="Delete"
          cancelText="Cancel"
        />

        {/* Alert Dialog */}
        <Dialog
          isOpen={alertDialog.isOpen}
          onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
          title={alertDialog.title}
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-theme-text-secondary">{alertDialog.message}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setAlertDialog({ ...alertDialog, isOpen: false })}
                className="px-4 py-2 text-sm font-medium text-white bg-theme-accent rounded-lg hover:bg-theme-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-accent transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
}
