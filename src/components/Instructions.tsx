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

          <div className="flex gap-4">
            <div className="flex-1 bg-blue-50/80 rounded-lg p-4 border-2 border-blue-100">
              <p className="font-bold text-blue-800 text-base mb-1">1️⃣ Guided Mode</p>
              <p className="text-sm text-blue-900/80 font-medium">Follow steps to learn.</p>
            </div>
            <div className="flex-1 bg-green-50/80 rounded-lg p-4 border-2 border-green-100">
              <p className="font-bold text-green-800 text-base mb-1">2️⃣ Free Play</p>
              <p className="text-sm text-green-900/80 font-medium">Experiment with controls.</p>
            </div>
          </div>

          <div className="bg-white/80 rounded-lg p-3 border border-gray-200 shadow-sm">
            <h4 className="text-sm font-bold text-gray-700 mb-2">🎨 Force Colors</h4>
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span>Weight (Mg)</span>
              </span>
              <span className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                <span>Normal (R_N)</span>
              </span>
              <span className="flex items-center gap-1.5 bg-red-50 px-2 py-1 rounded">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span>Tension (T)</span>
              </span>
              <span className="flex items-center gap-1.5 bg-yellow-50 px-2 py-1 rounded">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                <span>Friction (F_f)</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Instructions;
