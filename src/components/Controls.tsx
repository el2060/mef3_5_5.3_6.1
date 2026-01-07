import { SimulationState } from '../types/simulation';

interface ControlsProps {
  simulation: SimulationState;
  onUpdateSimulation: (updates: Partial<SimulationState>) => void;
  onReset: () => void;
  currentStep: number;
}

const Controls = ({ simulation, onUpdateSimulation, onReset, currentStep }: ControlsProps) => {
  const isGuided = currentStep > 0 && currentStep < 6; // Rough check for active guided mode

  const getSpotlightClass = (step: number) => {
    if (!isGuided) return '';
    return currentStep === step ? 'ring-4 ring-blue-400 ring-opacity-50 rounded-lg p-2 -m-2 bg-blue-50 transition-all duration-300' : 'opacity-40 transition-opacity duration-300';
  };

  return (
    <div className="h-full bg-gray-50 border-l border-gray-200 overflow-y-auto w-full max-w-full">
      <div className="p-4 md:p-6 pb-32 space-y-6">

        {/* Scenario Selector - Always visible for now */}
        <div className="bg-white border-2 border-indigo-200 rounded-xl p-2 shadow-sm mb-4">
          <div className="flex rounded-lg bg-indigo-50 p-1">
            <button
              onClick={() => onUpdateSimulation({ scenario: 'basic' })}
              className={`flex-1 py-2 text-sm md:text-base font-bold rounded-lg transition-all ${simulation.scenario === 'basic' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-400 hover:text-indigo-600'}`}
            >
              Ch 5: Basic
            </button>
            <button
              onClick={() => onUpdateSimulation({ scenario: 'external_force' })}
              className={`flex-1 py-2 text-sm md:text-base font-bold rounded-lg transition-all ${simulation.scenario === 'external_force' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-400 hover:text-indigo-600'}`}
            >
              Ch 5.3: Force
            </button>
            <button
              onClick={() => onUpdateSimulation({ scenario: 'pulley' })}
              className={`flex-1 py-2 text-sm md:text-base font-bold rounded-lg transition-all ${simulation.scenario === 'pulley' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-400 hover:text-indigo-600'}`}
            >
              Ch 6.1: Pulley
            </button>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <span className="text-3xl">🎛️</span>
          Controls
        </h2>

        <div className="space-y-3">
          {/* Angle Section */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
              <span>📐</span> Angle
            </h3>
            <div className={`${getSpotlightClass(3)}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl font-extrabold text-blue-600">{simulation.angle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                value={simulation.angle}
                onChange={(e) => onUpdateSimulation({ angle: Number(e.target.value) })}
                className="w-full h-4 accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Forces Section */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
              <span>💪</span> Forces
            </h3>

            {/* Mass Control */}
            <div className={`mb-6 pb-4 border-b border-gray-100 ${getSpotlightClass(1)}`}>
              <label className="flex items-center text-lg font-bold mb-3 cursor-pointer hover:text-green-700 transition-colors">
                <input
                  type="checkbox"
                  checked={simulation.showMass}
                  onChange={(e) => onUpdateSimulation({ showMass: e.target.checked })}
                  className="mr-3 w-5 h-5 accent-green-600"
                />
                <span className="text-green-600 font-bold">Mass (Mg) & Normal Reaction Force (R<sub>N</sub>)</span>
              </label>
              <div className="text-base text-gray-600 mb-2 font-medium">Mass (kg) <small className="text-gray-400">(Block)</small>: <span className="font-bold text-gray-900 text-lg">{simulation.mass}</span></div>
              <input
                type="range"
                min="5"
                max="50"
                value={simulation.mass}
                onChange={(e) => onUpdateSimulation({ mass: Number(e.target.value) })}
                disabled={!simulation.showMass}
                className="w-full h-4 accent-green-600 cursor-pointer"
              />
            </div>

            {/* Ch 5.3 External Force Controls */}
            {simulation.scenario === 'external_force' && (
              <div className="mb-6 pb-4 border-b border-gray-100 animate-fadeIn">
                <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">External Force (P)</h4>

                <div className="mb-4">
                  <div className="text-base text-gray-600 mb-2 font-medium">Magnitude (N): <span className="font-bold text-purple-700 text-lg">{simulation.externalForceMagnitude}</span></div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={simulation.externalForceMagnitude}
                    onChange={(e) => onUpdateSimulation({ externalForceMagnitude: Number(e.target.value) })}
                    className="w-full h-4 accent-purple-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="text-base text-gray-600 mb-2 font-medium">Angle (Deg): <span className="font-bold text-purple-700 text-lg">{simulation.externalForceAngle}°</span></div>
                  <input
                    type="range"
                    min="-60"
                    max="60"
                    value={simulation.externalForceAngle}
                    onChange={(e) => onUpdateSimulation({ externalForceAngle: Number(e.target.value) })}
                    className="w-full h-4 accent-purple-600 cursor-pointer"
                  />
                  <p className="text-xs text-gray-400 mt-1">Relative to horizontal</p>
                </div>
              </div>
            )}

            {/* Ch 6.1 Pulley Controls */}
            {simulation.scenario === 'pulley' && (
              <div className="mb-6 pb-4 border-b border-gray-100 animate-fadeIn">
                <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Pulley System</h4>

                <div className="mb-2">
                  <div className="text-base text-gray-600 mb-2 font-medium">Hanging Mass A (kg): <span className="font-bold text-indigo-700 text-lg">{simulation.pulleyMass}</span></div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={simulation.pulleyMass}
                    onChange={(e) => onUpdateSimulation({ pulleyMass: Number(e.target.value) })}
                    className="w-full h-4 accent-indigo-600 cursor-pointer"
                  />
                </div>
                <p className="text-sm text-indigo-600 font-medium">
                  Tension T = m_a × g = {(simulation.pulleyMass * 9.81).toFixed(1)} N
                </p>
              </div>
            )}

            {/* Tension Control */}
            <div className={`mb-4 pb-4 border-b border-gray-100 ${getSpotlightClass(2)}`}>
              <label className="flex items-center text-base font-medium mb-2 cursor-pointer hover:text-red-700 transition-colors">
                <input
                  type="checkbox"
                  checked={simulation.showTension}
                  onChange={(e) => onUpdateSimulation({ showTension: e.target.checked })}
                  className="mr-3 w-5 h-5 accent-red-600"
                />
                <span className="text-red-600 font-semibold">Force (F<sub>1</sub>)</span>
              </label>
              <div className="text-sm text-gray-600 mb-2">Force (N): <span className="font-semibold text-gray-800">{simulation.tension}</span></div>
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
                <span className="text-cyan-600 font-semibold">Force (F<sub>2</sub>)</span>
              </label>
              <div className="text-sm text-gray-600 mb-2">Force (N): <span className="font-semibold text-gray-800">{simulation.push}</span></div>
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
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-bold text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-2">
              <span>🛑</span> Friction Force (F<sub>f</sub>)
            </h3>
            <p className="text-sm text-gray-500 mb-4 italic">Set impending motion direction:</p>

            <div className={`${getSpotlightClass(2)}`}>
              <div className="space-y-3 mb-5">
                <label className="flex items-center cursor-pointer text-base hover:bg-gray-50 p-2 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                  <input
                    type="radio"
                    name="friction"
                    checked={simulation.motionDirection === 'none'}
                    onChange={() => onUpdateSimulation({ motionDirection: 'none' })}
                    className="mr-3 w-5 h-5 accent-gray-600"
                  />
                  <span className="font-bold text-gray-700">No Friction</span>
                </label>
                <label className="flex items-center cursor-pointer text-base hover:bg-gray-50 p-2 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                  <input
                    type="radio"
                    name="friction"
                    checked={simulation.motionDirection === 'up'}
                    onChange={() => onUpdateSimulation({ motionDirection: 'up' })}
                    className="mr-3 w-5 h-5 accent-red-500"
                  />
                  <span className="font-bold text-gray-700">Impending Motion Up-Slope</span>
                </label>
                <label className="flex items-center cursor-pointer text-base hover:bg-gray-50 p-2 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                  <input
                    type="radio"
                    name="friction"
                    checked={simulation.motionDirection === 'down'}
                    onChange={() => onUpdateSimulation({ motionDirection: 'down' })}
                    className="mr-3 w-5 h-5 accent-red-500"
                  />
                  <span className="font-bold text-gray-700">Impending Motion Down-Slope</span>
                </label>
              </div>

              <div className="text-base text-gray-600 mb-2 font-medium">μ (Coefficient): <span className="font-bold text-gray-900 text-lg">{simulation.mu.toFixed(2)}</span></div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={simulation.mu}
                onChange={(e) => onUpdateSimulation({ mu: Number(e.target.value) })}
                disabled={simulation.motionDirection === 'none'}
                className="w-full h-4 accent-yellow-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-extrabold rounded-xl px-4 py-4 uppercase text-lg shadow-md hover:shadow-lg transition-all duration-200 mt-2"
          >
            🔄 Reset Everything
          </button>
          <p className="text-sm text-center text-gray-500 mt-2 font-medium">
            Resets all controls and guided learning steps
          </p>
        </div>
      </div>
    </div>
  );
};

export default Controls;
