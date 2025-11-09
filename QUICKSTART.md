# Quick Start Guide

## 1. Install Dependencies

```bash
cd ~/storage/downloads/ollama-screen
npm install
```

## 2. Make Sure Ollama Server is Running

Check if it's running:
```bash
ollama-chat list
```

If not running, your `.zshrc` should auto-start it when you open a new Termux session.

## 3. Start the Web App

**Option A: Use the start script**
```bash
cd ~/storage/downloads/ollama-screen
./start.sh
```

**Option B: Use npm directly**
```bash
cd ~/storage/downloads/ollama-screen
npm run dev
```

## 4. Open in Browser

Open your phone's browser and go to:
```
http://localhost:3000
```

## 5. Start Chatting!

1. Select a model from the dropdown (default: llama3.2)
2. Type your message
3. Press Enter or click Send

## Managing Models

Click "Manage Models" to:
- Download new models (enter model name like `mistral`, `codellama`, etc.)
- Delete models you don't need
- See installed models and their sizes

## Tips

- Keep the terminal open while using the app
- Press Ctrl+C in the terminal to stop the server
- The app auto-detects dark/light mode from your system

---

**That's it! Enjoy your local AI chat interface!** 🎉
