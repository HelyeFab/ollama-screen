#!/data/data/com.termux/files/usr/bin/bash

echo "🚀 Starting Ollama Screen..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies (this may take a few minutes)..."
    npm install
    echo ""
fi

# Check if Ollama server is running
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "⚠️  Warning: Ollama server doesn't seem to be running!"
    echo "   Start it in another terminal with: ollama-start"
    echo ""
fi

echo "🌐 Starting development server..."
echo "   Open http://localhost:3000 in your browser"
echo ""
echo "   Press Ctrl+C to stop"
echo ""

npm run dev
