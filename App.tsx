import React, { useState, useRef, useEffect } from 'react';
import TerminalOutput from './components/TerminalOutput';
import { useGameEngine } from './hooks/useGameEngine';

const App: React.FC = () => {
  const { logs, inputLocked, processCommand } = useGameEngine();
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input
  useEffect(() => {
    const focusInput = () => inputRef.current?.focus();
    focusInput();
    window.addEventListener('click', focusInput);
    return () => window.removeEventListener('click', focusInput);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!inputValue.trim()) return;
      const cmd = inputValue;
      setHistory(prev => [...prev, cmd]);
      setHistoryIndex(-1);
      setInputValue('');
      processCommand(cmd);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInputValue(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
            setHistoryIndex(-1);
            setInputValue('');
        } else {
            setHistoryIndex(newIndex);
            setInputValue(history[newIndex]);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#33ff33] font-mono relative">
      {/* CRT Effects */}
      <div className="scanline"></div>
      <div className="flicker"></div>

      <div className="absolute inset-0 flex flex-col p-4 z-20 max-w-4xl mx-auto border-x border-[#333] bg-black bg-opacity-90 h-full">
        {/* Header Status Bar (Optional, for game feel) */}
        <div className="border-b border-[#33ff33] pb-2 mb-2 flex justify-between opacity-80 text-sm uppercase">
          <span>Kali-Linux-Web-Emulator</span>
          <span>root@kali:~</span>
        </div>

        {/* Terminal Output */}
        <TerminalOutput logs={logs} />

        {/* Input Area */}
        <div className="flex items-center mt-2">
          <span className="font-bold mr-2 text-blue-400">root@kali:~#</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-[#33ff33] font-mono"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={inputLocked}
            autoComplete="off"
            spellCheck="false"
          />
        </div>
        
        {inputLocked && (
            <div className="text-xs text-gray-500 mt-1 animate-pulse">Processing...</div>
        )}
      </div>
    </div>
  );
};

export default App;