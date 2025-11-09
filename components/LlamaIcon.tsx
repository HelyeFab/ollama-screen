'use client';

export function LlamaIcon() {
  return (
    <div className="relative inline-block">
      <svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-llama-float"
      >
        {/* Decorative sparkles around llama */}
        <g>
          <circle cx="20" cy="25" r="2.5" fill="currentColor" className="text-theme-accent/50 animate-sparkle" style={{ animationDelay: '0s', animationDuration: '2s' }} />
          <circle cx="120" cy="30" r="2" fill="currentColor" className="text-theme-accent/50 animate-sparkle" style={{ animationDelay: '0.5s', animationDuration: '2s' }} />
          <circle cx="15" cy="60" r="2" fill="currentColor" className="text-theme-accent/50 animate-sparkle" style={{ animationDelay: '1s', animationDuration: '2s' }} />
          <circle cx="125" cy="70" r="2.5" fill="currentColor" className="text-theme-accent/50 animate-sparkle" style={{ animationDelay: '1.5s', animationDuration: '2s' }} />
          <circle cx="30" cy="100" r="2" fill="currentColor" className="text-theme-accent/50 animate-sparkle" style={{ animationDelay: '2s', animationDuration: '2s' }} />
          <circle cx="110" cy="105" r="2.5" fill="currentColor" className="text-theme-accent/50 animate-sparkle" style={{ animationDelay: '2.5s', animationDuration: '2s' }} />
        </g>

        {/* Llama body - fluffy */}
        <ellipse cx="70" cy="95" rx="40" ry="28" fill="currentColor" className="text-theme-accent/25" />
        <ellipse cx="70" cy="92" rx="38" ry="26" fill="currentColor" className="text-theme-accent/30" />
        
        {/* Llama neck - long and elegant */}
        <ellipse cx="70" cy="60" rx="22" ry="35" fill="currentColor" className="text-theme-accent/35" />
        
        {/* Llama head */}
        <ellipse cx="70" cy="32" rx="20" ry="22" fill="currentColor" className="text-theme-accent" />
        
        {/* Llama ears - banana shaped */}
        <ellipse cx="52" cy="28" rx="5" ry="14" fill="currentColor" className="text-theme-accent" transform="rotate(-20 52 28)" />
        <ellipse cx="88" cy="28" rx="5" ry="14" fill="currentColor" className="text-theme-accent" transform="rotate(20 88 28)" />
        
        {/* Inner ear detail */}
        <ellipse cx="52" cy="30" rx="3" ry="10" fill="currentColor" className="text-theme-accent/60" transform="rotate(-20 52 30)" />
        <ellipse cx="88" cy="30" rx="3" ry="10" fill="currentColor" className="text-theme-accent/60" transform="rotate(20 88 30)" />
        
        {/* Llama eyes - friendly */}
        <circle cx="63" cy="30" r="3" fill="currentColor" className="text-theme-text-primary" />
        <circle cx="77" cy="30" r="3" fill="currentColor" className="text-theme-text-primary" />
        <circle cx="63" cy="30" r="1.5" fill="currentColor" className="text-white" />
        <circle cx="77" cy="30" r="1.5" fill="currentColor" className="text-white" />
        
        {/* Llama snout */}
        <ellipse cx="70" cy="38" rx="9" ry="7" fill="currentColor" className="text-theme-accent/85" />
        <ellipse cx="70" cy="40" rx="6" ry="4" fill="currentColor" className="text-theme-accent/70" />
        
        {/* Llama neck fluff detail */}
        <ellipse cx="65" cy="70" rx="8" ry="12" fill="currentColor" className="text-theme-accent/20" />
        <ellipse cx="75" cy="72" rx="8" ry="12" fill="currentColor" className="text-theme-accent/20" />
        
        {/* Body fluff details */}
        <ellipse cx="55" cy="90" rx="10" ry="15" fill="currentColor" className="text-theme-accent/15" />
        <ellipse cx="85" cy="92" rx="10" ry="15" fill="currentColor" className="text-theme-accent/15" />
      </svg>
    </div>
  );
}

