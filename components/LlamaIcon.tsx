'use client';

export function LlamaIcon() {
  return (
    <div className="relative inline-block">
      {/* Decorative sparkles around llama */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-4 left-4 w-2 h-2 rounded-full bg-theme-accent/50 animate-sparkle" style={{ animationDelay: '0s', animationDuration: '2s' }} />
        <span className="absolute top-6 right-8 w-1.5 h-1.5 rounded-full bg-theme-accent/50 animate-sparkle" style={{ animationDelay: '0.5s', animationDuration: '2s' }} />
        <span className="absolute top-12 left-2 w-1.5 h-1.5 rounded-full bg-theme-accent/50 animate-sparkle" style={{ animationDelay: '1s', animationDuration: '2s' }} />
        <span className="absolute top-16 right-4 w-2 h-2 rounded-full bg-theme-accent/50 animate-sparkle" style={{ animationDelay: '1.5s', animationDuration: '2s' }} />
        <span className="absolute bottom-8 left-6 w-1.5 h-1.5 rounded-full bg-theme-accent/50 animate-sparkle" style={{ animationDelay: '2s', animationDuration: '2s' }} />
        <span className="absolute bottom-6 right-6 w-2 h-2 rounded-full bg-theme-accent/50 animate-sparkle" style={{ animationDelay: '2.5s', animationDuration: '2s' }} />
      </div>
      
      {/* Llama icon from public folder */}
      <div className="relative w-32 h-32 md:w-40 md:h-40 animate-llama-float">
        <img
          src="/icons/lama.svg"
          alt="Ollama Llama"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}

