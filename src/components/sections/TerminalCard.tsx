'use client';

import { useState } from 'react';

export default function TerminalCard() {
  const [copied, setCopied] = useState(false);
  const command = 'neofetch --profile islamux';

  const copyCommand = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl bg-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-2xl font-mono text-sm text-gray-200">
      {/* Terminal Header */}
      <div className="bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-2 text-xs text-gray-400">islamux@terminal:~</span>
        </div>
        <button
          onClick={copyCommand}
          className="text-xs text-gray-400 hover:text-white bg-gray-800 px-2.5 py-1 rounded transition"
        >
          {copied ? 'Copied!' : 'Copy cmd'}
        </button>
      </div>

      {/* Terminal Body */}
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-2 text-emerald-400">
          <span>❯</span>
          <span className="text-gray-100">{command}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* ASCII / Logo representation */}
          <div className="flex flex-col items-center justify-center bg-gray-900/60 p-4 rounded-lg border border-gray-800 text-emerald-400">
            <span className="text-4xl mb-2">🐧</span>
            <span className="text-xs text-gray-400 font-semibold tracking-wider">ARCH / LINUX</span>
            <span className="text-[10px] text-emerald-500/80 mt-1">Terminal Native</span>
          </div>

          {/* System Specs */}
          <div className="md:col-span-2 space-y-2 text-xs md:text-sm">
            <div className="border-b border-gray-800/80 pb-1.5 flex justify-between">
              <span className="text-emerald-400 font-bold">OS:</span>
              <span className="text-gray-300">Linux GNU/Linux (Power User)</span>
            </div>
            <div className="border-b border-gray-800/80 pb-1.5 flex justify-between">
              <span className="text-emerald-400 font-bold">Mobile:</span>
              <span className="text-gray-300">Android (Kotlin), Flutter</span>
            </div>
            <div className="border-b border-gray-800/80 pb-1.5 flex justify-between">
              <span className="text-emerald-400 font-bold">Web & Backend:</span>
              <span className="text-gray-300">Next.js, React, Python</span>
            </div>
            <div className="border-b border-gray-800/80 pb-1.5 flex justify-between">
              <span className="text-emerald-400 font-bold">Editor:</span>
              <span className="text-gray-300">Neovim / CLI Toolchain</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-emerald-400 font-bold">Shell:</span>
              <span className="text-gray-300">Bash / Zsh (Customized)</span>
            </div>
          </div>
        </div>

        <div className="pt-2 text-xs text-gray-500 flex items-center justify-between">
          <span>status: all systems operational</span>
          <span className="inline-flex items-center text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5"></span>
            online
          </span>
        </div>
      </div>
    </div>
  );
}
