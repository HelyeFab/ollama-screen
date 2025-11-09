# Ollama Screen - Web UI for Ollama

A beautiful, modern web interface for chatting with Ollama AI models, built with Next.js 15 and React 19.

## Features

- 💬 **Chat Interface** - Clean, ChatGPT-like UI for conversations
- 🎯 **Model Selection** - Switch between different Ollama models on the fly
- 📥 **Model Management** - Download and install new models directly from the UI
- 🗑️ **Delete Models** - Remove models you no longer need
- 🌓 **Dark Mode** - Automatic dark/light theme based on system preference
- 📱 **Responsive** - Works great on desktop and mobile

## Prerequisites

1. **Ollama server running** - Make sure your Ollama server is running:
   ```bash
   ollama-chat list
   ```
   Or start it with:
   ```bash
   # In one terminal
   ollama-start
   ```

2. **Node.js and npm** - Already installed on your system

## Installation

### Step 1: Install Dependencies

Navigate to the project directory and install dependencies:

```bash
cd ~/storage/downloads/ollama-screen
npm install
```

**Note:** If you get network errors, wait for the Ollama model download to finish first, then try again.

### Step 2: Run the Development Server

```bash
npm run dev
```

The app will start on `http://localhost:3000`

### Step 3: Open in Browser

Open your phone's browser and navigate to:
```
http://localhost:3000
```

## Usage

### Chatting

1. Select a model from the dropdown in the header
2. Type your message in the input box
3. Press Enter or click Send
4. Wait for the AI response

### Managing Models

1. Click **"Manage Models"** button in the header
2. To download a new model:
   - Enter the model name (e.g., `mistral`, `codellama`, `phi`)
   - Click **Download**
   - Wait for the download to complete (may take several minutes)
3. To delete a model:
   - Find the model in the list
   - Click the **Delete** button next to it
   - Confirm the deletion

### Popular Models to Try

- `llama3.2:3b` - Default, good for most tasks (2 GB)
- `llama3.2:1b` - Faster, smaller model (1.3 GB)
- `mistral` - High quality responses (4.1 GB)
- `codellama` - Great for coding tasks (3.8 GB)
- `gemma:2b` - Google's lightweight model (1.4 GB)
- `phi` - Microsoft's efficient model (1.6 GB)

## Building for Production

To create an optimized production build:

```bash
npm run build
npm start
```

The production server will run on `http://localhost:3000`

## Troubleshooting

### "Could not connect to Ollama server"

Make sure the Ollama server is running:
```bash
# Check if server is running
ollama-chat list

# Start server if needed
ollama-start
```

### Network Errors During npm install

If you're downloading a large Ollama model, wait for it to finish first:
```bash
# Check download progress
tmux attach -t ollama
# Press Ctrl+B then D to detach
```

### Port Already in Use

If port 3000 is already in use, you can run on a different port:
```bash
PORT=3001 npm run dev
```

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with improved performance
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Ollama API** - Direct integration with local Ollama server

## API Endpoints Used

The app connects to these Ollama API endpoints:

- `GET /api/tags` - List installed models
- `POST /api/chat` - Send chat messages
- `POST /api/pull` - Download new models
- `DELETE /api/delete` - Remove models

## Project Structure

```
ollama-screen/
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main chat interface
├── components/          # Reusable components (future)
├── lib/                 # Utility functions (future)
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── tailwind.config.ts   # Tailwind config
└── next.config.ts       # Next.js config
```

## Future Enhancements

- [ ] Streaming responses for real-time chat
- [ ] Conversation history persistence
- [ ] Multiple chat sessions/tabs
- [ ] Code syntax highlighting
- [ ] Markdown rendering
- [ ] Export conversations
- [ ] Custom system prompts
- [ ] Model parameters tuning (temperature, top_p, etc.)

## License

MIT

## Credits

Built for Ollama on Termux - Your local AI assistant!

---

**Enjoy chatting with your local AI models!** 🤖
