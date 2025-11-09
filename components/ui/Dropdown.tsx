'use client';

import { useEffect, useRef, useState } from 'react';

export interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  variant?: 'default' | 'danger';
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  onSelect: (value: string) => void;
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({
  trigger,
  items,
  onSelect,
  align = 'left',
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      const enabledItems = items.filter((item) => !item.disabled);

      switch (e.key) {
        case 'Escape':
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => {
            const nextIndex = prev + 1;
            return nextIndex >= enabledItems.length ? 0 : nextIndex;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => {
            const nextIndex = prev - 1;
            return nextIndex < 0 ? enabledItems.length - 1 : nextIndex;
          });
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < enabledItems.length) {
            handleSelect(enabledItems[focusedIndex].value);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex, items]);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className={`absolute ${alignmentClasses[align]} mt-2 w-56 rounded-xl shadow-xl bg-theme-bg-secondary border border-theme-border focus:outline-none z-50 animate-in fade-in-0 zoom-in-95 duration-200`}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1">
            {items.map((item, index) => {
              const variantClasses =
                item.variant === 'danger'
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-theme-text-primary hover:bg-theme-bg-tertiary';

              const isFocused = index === focusedIndex;

              return (
                <button
                  key={item.value}
                  onClick={() => !item.disabled && handleSelect(item.value)}
                  disabled={item.disabled}
                  className={`w-full text-left px-4 py-3 text-base flex items-center gap-3 transition-all duration-150 active:scale-[0.98] touch-manipulation ${
                    item.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : variantClasses
                  } ${isFocused ? 'bg-theme-bg-tertiary' : ''}`}
                  role="menuitem"
                >
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
