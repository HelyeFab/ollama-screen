"use client";

import { useState } from "react";

export default function StreamTest() {
  const [log, setLog] = useState<string[]>([]);
  const [output, setOutput] = useState("");

  const testStream = async () => {
    setLog([]);
    setOutput("");
    const startTime = Date.now();

    try {
      // Call Ollama directly for zero-latency streaming
      const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.2",
          messages: [{ role: "user", content: "Count from 1 to 5" }],
          stream: true,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let content = "";
      const logs: string[] = [];

      if (reader) {
        while (true) {
          const readStart = Date.now();
          const { done, value } = await reader.read();
          const readTime = Date.now() - readStart;

          if (done) {
            logs.push(`Done! Total time: ${Date.now() - startTime}ms`);
            break;
          }

          const chunkSize = value?.length || 0;
          logs.push(`[${Date.now() - startTime}ms] Read chunk: ${chunkSize} bytes (took ${readTime}ms to read)`);

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.trim()) {
              try {
                const json = JSON.parse(line);
                if (json.message?.content) {
                  content += json.message.content;
                  logs.push(`[${Date.now() - startTime}ms] Token: "${json.message.content}"`);
                  setOutput(content);
                }
              } catch (e) {
                logs.push(`[${Date.now() - startTime}ms] Parse error: ${line.substring(0, 50)}`);
              }
            }
          }
        }
      }

      setLog(logs);
    } catch (error) {
      setLog([`Error: ${error}`]);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Streaming Test</h1>

      <button
        onClick={testStream}
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 mb-4"
      >
        Test Stream
      </button>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Output:</h2>
        <div className="p-4 bg-gray-800 rounded min-h-[100px]">
          {output}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Debug Log:</h2>
        <div className="p-4 bg-gray-800 rounded font-mono text-sm max-h-[500px] overflow-auto">
          {log.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
