import React from 'react'

const GlobalStyles = () => (
  <style jsx global>{`
    .nav-tab {
      @apply relative h-full flex items-center gap-2 font-black text-[11px] uppercase tracking-widest transition-all text-slate-400 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary shadow-none !important;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #e2e8f0;
      border-radius: 10px;
    }
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
)

export default GlobalStyles
