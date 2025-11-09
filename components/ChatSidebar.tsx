'use client';

import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiMessageSquare, FiMenu, FiX } from 'react-icons/fi';
import { ChatSession, chatDB } from '@/lib/db';
import { ConfirmDialog } from './ui';
import { ThemeSwitcher } from './ThemeSwitcher';

interface ChatSidebarProps {
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function ChatSidebar({
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  isOpen,
  setIsOpen,
}: ChatSidebarProps) {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    chatId: string;
    chatTitle: string;
  }>({
    isOpen: false,
    chatId: '',
    chatTitle: '',
  });

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const allChats = await chatDB.getAllChats();
      setChats(allChats);
    } catch (error) {
      console.error('Failed to load chats:', error);
    }
  };

  const handleDeleteClick = (chatId: string, chatTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirm({
      isOpen: true,
      chatId,
      chatTitle,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await chatDB.deleteChat(deleteConfirm.chatId);
      onDeleteChat(deleteConfirm.chatId);
      await loadChats();
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Refresh chats when currentChatId changes (new chat created)
  useEffect(() => {
    if (currentChatId) {
      loadChats();
    }
  }, [currentChatId]);

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 z-40 w-full sm:w-80 lg:w-64 bg-theme-bg-secondary border-r border-theme-border flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-theme-border space-y-3">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-theme-accent hover:bg-theme-accent-hover active:scale-[0.98] text-white rounded-xl transition-all duration-200 text-base font-semibold shadow-sm touch-manipulation"
          >
            <FiPlus size={22} />
            <span>New Chat</span>
          </button>

          {/* Theme Switcher - Mobile Only */}
          <div className="lg:hidden flex items-center justify-between p-3.5 bg-theme-bg-tertiary/50 rounded-xl border border-theme-border/50">
            <span className="text-base font-semibold text-theme-text-primary">Theme</span>
            <ThemeSwitcher />
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto p-3 overscroll-contain">
          {chats.length === 0 ? (
            <div className="text-center text-theme-text-secondary p-8 text-base">
              <FiMessageSquare size={48} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No chats yet</p>
              <p className="text-sm mt-1">Start a new conversation!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {chats.map((chat, index) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    onSelectChat(chat.id);
                    setIsOpen(false);
                  }}
                  className={`group flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all duration-200 active:scale-[0.98] touch-manipulation ${
                    currentChatId === chat.id
                      ? 'bg-theme-accent/15 text-theme-accent shadow-sm border border-theme-accent/20'
                      : 'hover:bg-theme-bg-tertiary text-theme-text-primary border border-transparent'
                  } ${isOpen ? 'animate-fade-in-slide' : ''}`}
                  style={{
                    animationDelay: `${index * 20}ms`,
                  }}
                >
                  <FiMessageSquare className="flex-shrink-0" size={20} />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold truncate">{chat.title}</p>
                    <p className="text-sm text-theme-text-tertiary mt-0.5">
                      {formatDate(chat.updatedAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteClick(chat.id, chat.title, e)}
                    className="opacity-0 group-hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-2 hover:bg-red-500/10 active:scale-95 rounded-lg transition-all duration-200 touch-manipulation"
                    aria-label={`Delete ${chat.title}`}
                  >
                    <FiTrash2 size={18} className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Backdrop for mobile - Enhanced with blur */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden animate-in fade-in-0 duration-300"
          aria-hidden="true"
        />
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ ...deleteConfirm, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title="Delete Chat"
        message={`Are you sure you want to delete "${deleteConfirm.chatTitle}"? This action cannot be undone.`}
        variant="danger"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
