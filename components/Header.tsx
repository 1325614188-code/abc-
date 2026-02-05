
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-stone-200 py-3 md:py-5 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-red-800 flex items-center justify-center rounded-sm flex-shrink-0">
            <span className="text-white font-bold text-lg md:text-xl serif-font">舌</span>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-stone-800 serif-font leading-none">中医舌诊 AI</h1>
            <p className="text-[10px] md:text-xs text-stone-500 uppercase tracking-tighter md:tracking-widest mt-0.5">TCM Analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <span className="hidden sm:inline text-xs text-stone-400 italic">“望而知之谓之神”</span>
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           <span className="text-[10px] font-medium text-stone-500 uppercase">AI 在线</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
