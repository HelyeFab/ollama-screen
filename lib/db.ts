// IndexedDB utilities for storing chat history

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  model: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

const DB_NAME = 'OllamaChatDB';
const DB_VERSION = 1;
const STORE_NAME = 'chats';

class ChatDatabase {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          objectStore.createIndex('createdAt', 'createdAt', { unique: false });
          objectStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };
    });
  }

  async getAllChats(): Promise<ChatSession[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);
      const index = objectStore.index('updatedAt');
      const request = index.openCursor(null, 'prev'); // Sort by most recent first

      const chats: ChatSession[] = [];

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          chats.push(cursor.value);
          cursor.continue();
        } else {
          resolve(chats);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async getChat(id: string): Promise<ChatSession | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async saveChat(chat: ChatSession): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.put(chat);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteChat(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearAllChats(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Singleton instance
export const chatDB = new ChatDatabase();

// Helper function to generate chat title from first message
export function generateChatTitle(messages: ChatMessage[]): string {
  if (messages.length === 0) return 'New Chat';

  const firstUserMessage = messages.find(m => m.role === 'user');
  if (!firstUserMessage) return 'New Chat';

  const title = firstUserMessage.content.slice(0, 50);
  return title.length < firstUserMessage.content.length ? `${title}...` : title;
}

// Helper function to generate unique ID
export function generateChatId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
