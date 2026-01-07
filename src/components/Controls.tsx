import { SimulationState } from '../types/simulation';
import { AngleControl } from './controls/AngleControl';
import { ForceControl } from './controls/ForceControl';
import { FrictionControl } from './controls/FrictionControl';

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
          {/* Angle Section - Always Relevant */}
          <AngleControl
            simulation={simulation}
            onUpdateSimulation={onUpdateSimulation}
            className={`transition-opacity duration-300 ${getSpotlightClass(3)}`}
          />

          {/* Forces Section */}
          <ForceControl
            simulation={simulation}
            onUpdateSimulation={onUpdateSimulation}
            className={`transition-opacity duration-300 ${getSpotlightClass(1)}`}
          />

          {/* Specific controls for Scenarios (keep as is for now or refactor later if needed) */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">

            {/* Ch 5.3 External Force Controls - Custom logic, keep here for now? Or extract? */}
            {/* Actually, let's keep the specialized scenario controls here for now as they are quite specific */}

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

          </div>

          {/* Friction Section */}
          <FrictionControl
            simulation={simulation}
            onUpdateSimulation={onUpdateSimulation}
            className={getSpotlightClass(2)}
          />

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
