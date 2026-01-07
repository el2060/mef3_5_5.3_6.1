import { SimulationState } from '../types/simulation';

interface ControlsProps {
  simulation: SimulationState;
  onUpdateSimulation: (updates: Partial<SimulationState>) => void;
  onReset: () => void;
  currentStep: number;
}

const Controls = ({ simulation, onUpdateSimulation, onReset, currentStep }: ControlsProps) => {
  const getSpotlightClass = (step: number) => {
    return currentStep === step ? 'spotlight' : '';
  };

  return (
    <div className="p-4 md:p-5 bg-white">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <span className="text-3xl">🎛️</span>
        Controls
      </h2>

      <div className="space-y-3">
        {/* Angle Section */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <h3 className="text-base font-semibold text-gray-600 mb-3 uppercase tracking-wide">Angle</h3>
          <div className={`${getSpotlightClass(3)}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl font-bold text-blue-600">{simulation.angle}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              value={simulation.angle}
              onChange={(e) => onUpdateSimulation({ angle: Number(e.target.value) })}
              className="w-full h-2 accent-blue-600"
            />
          </div>
        </div>

        {/* Forces Section */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <h3 className="text-base font-semibold text-gray-600 mb-3 uppercase tracking-wide">Forces</h3>

          {/* Mass Control */}
          <div className={`mb-4 pb-4 border-b border-gray-100 ${getSpotlightClass(1)}`}>
            <label className="flex items-center text-base font-medium mb-2 cursor-pointer hover:text-green-700 transition-colors">
              <input
                type="checkbox"
                checked={simulation.showMass}
                onChange={(e) => onUpdateSimulation({ showMass: e.target.checked })}
                className="mr-3 w-5 h-5 accent-green-600"
              />
              <span className="text-green-600 font-semibold">Mass (Mg) & R_N</span>
            </label>
            <div className="text-sm text-gray-600 mb-2">Mass (kg): <span className="font-semibold text-gray-800">{simulation.mass}</span></div>
            <input
              type="range"
              min="5"
              max="50"
              value={simulation.mass}
              onChange={(e) => onUpdateSimulation({ mass: Number(e.target.value) })}
              disabled={!simulation.showMass}
              className="w-full h-2 accent-green-600"
            />
          </div>

          {/* Tension Control */}
          <div className={`mb-4 pb-4 border-b border-gray-100 ${getSpotlightClass(2)}`}>
            <label className="flex items-center text-base font-medium mb-2 cursor-pointer hover:text-red-700 transition-colors">
              <input
                type="checkbox"
                checked={simulation.showTension}
                onChange={(e) => onUpdateSimulation({ showTension: e.target.checked })}
                className="mr-3 w-5 h-5 accent-red-600"
              />
              <span className="text-red-600 font-semibold">Tension (T)</span>
            </label>
            <div className="text-sm text-gray-600 mb-2">Tension (N): <span className="font-semibold text-gray-800">{simulation.tension}</span></div>
            <input
              type="range"
              min="0"
              max="200"
              value={simulation.tension}
              onChange={(e) => onUpdateSimulation({ tension: Number(e.target.value) })}
              disabled={!simulation.showTension}
              className="w-full h-2 accent-red-600"
            />
          </div>

          {/* Push Control */}
          <div className={`${getSpotlightClass(2)}`}>
            <label className="flex items-center text-base font-medium mb-2 cursor-pointer hover:text-cyan-700 transition-colors">
              <input
                type="checkbox"
                checked={simulation.showPush}
                onChange={(e) => onUpdateSimulation({ showPush: e.target.checked })}
                className="mr-3 w-5 h-5 accent-cyan-600"
              />
              <span className="text-cyan-600 font-semibold">Push (P)</span>
            </label>
            <div className="text-sm text-gray-600 mb-2">Push (N): <span className="font-semibold text-gray-800">{simulation.push}</span></div>
            <input
              type="range"
              min="0"
              max="200"
              value={simulation.push}
              onChange={(e) => onUpdateSimulation({ push: Number(e.target.value) })}
              disabled={!simulation.showPush}
              className="w-full h-2 accent-cyan-600"
            />
          </div>
        </div>

        {/* Friction Section */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <h3 className="text-base font-semibold text-gray-600 mb-2 uppercase tracking-wide">Friction (F_f)</h3>
          <p className="text-sm text-gray-500 mb-3 italic">Appears when impending motion is set</p>

          <div className={`${getSpotlightClass(2)}`}>
            <div className="space-y-2 mb-3">
              <label className="flex items-center cursor-pointer text-sm hover:bg-gray-50 p-2 rounded transition-colors">
                <input
                  type="radio"
                  name="friction"
                  checked={simulation.motionDirection === 'none'}
                  onChange={() => onUpdateSimulation({ motionDirection: 'none' })}
                  className="mr-3 w-4 h-4"
                />
                <span className="font-medium">No Friction</span>
              </label>
              <label className="flex items-center cursor-pointer text-sm hover:bg-gray-50 p-2 rounded transition-colors">
                <input
                  type="radio"
                  name="friction"
                  checked={simulation.motionDirection === 'up'}
                  onChange={() => onUpdateSimulation({ motionDirection: 'up' })}
                  className="mr-3 w-4 h-4"
                />
                <span className="font-medium">Impending Motion Up-Slope</span>
              </label>
              <label className="flex items-center cursor-pointer text-sm hover:bg-gray-50 p-2 rounded transition-colors">
                <input
                  type="radio"
                  name="friction"
                  checked={simulation.motionDirection === 'down'}
                  onChange={() => onUpdateSimulation({ motionDirection: 'down' })}
                  className="mr-3 w-4 h-4"
                />
                <span className="font-medium">Impending Motion Down-Slope</span>
              </label>
            </div>

            <div className="text-sm text-gray-600 mb-2">μ (Coefficient): <span className="font-semibold text-gray-800">{simulation.mu.toFixed(2)}</span></div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={simulation.mu}
              onChange={(e) => onUpdateSimulation({ mu: Number(e.target.value) })}
              disabled={simulation.motionDirection === 'none'}
              className="w-full h-2 accent-yellow-600"
            />
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg px-4 py-3 uppercase text-base shadow-sm transition-all duration-200"
        >
          🔄 Reset Everything
        </button>
        <p className="text-xs text-center text-gray-500 mt-1">
          Resets all controls and guided learning steps
        </p>
      </div>
    </div>
  );
};

export default Controls;
