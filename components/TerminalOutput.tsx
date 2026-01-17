import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface TerminalOutputProps {
  logs: LogEntry[];
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-1">
      {logs.map((log) => (
        <div 
          key={log.id} 
          className={`${
            log.type === 'command' ? 'text-white font-bold' : 
            log.type === 'error' ? 'text-red-500' : 
            log.type === 'success' ? 'text-green-400 font-bold' : 
            log.type === 'info' ? 'text-blue-300' :
            'text-[#33ff33]'
          } whitespace-pre-wrap break-all`}
        >
          {log.type === 'command' ? '> ' : ''}{log.text}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default TerminalOutput;