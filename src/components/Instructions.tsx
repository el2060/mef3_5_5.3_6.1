import { useState } from 'react';

const Instructions = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-4 md:p-5 border-t border-gray-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left hover:bg-white/50 p-3 rounded-lg transition-colors"
      >
        <h3 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
          💡 Quick Guide
        </h3>
        <span className="text-2xl text-blue-600 font-bold">
          {isExpanded ? '−' : '+'}
        </span>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3">

          <div className="flex-1 bg-white p-4 rounded-lg border border-gray-100 shadow-sm text-sm">
            <ol className="list-decimal pl-4 space-y-2 text-gray-700 font-medium">
              <li><span className="font-bold text-gray-900">Start</span> the simulation.</li>
              <li>Set <span className="font-bold text-gray-900">Mass</span> → diagram updates instantly.</li>
              <li>Check <span className="font-bold text-gray-900">Forces</span> → Friction → Equilibrium.</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default Instructions;
