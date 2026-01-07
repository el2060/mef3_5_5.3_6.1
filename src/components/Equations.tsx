import { SimulationState } from '../types/simulation';
import { calculateForces, getEquations } from '../utils/physics';

interface EquationsProps {
  simulation: SimulationState;
  onToggle: () => void;
}

const Equations = ({ simulation, onToggle }: EquationsProps) => {
  const forces = calculateForces(simulation);
  const equations = getEquations(simulation, forces);

  return (
    <div className="p-4 md:p-5 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-xl">🧮</span>
          Equations
        </h2>
        <button
          onClick={onToggle}
          className="text-blue-600 hover:text-blue-800 text-sm font-semibold hover:underline"
        >
          {simulation.showEquations ? 'Hide Equations' : 'Show Equations'}
        </button>
      </div>

      {simulation.showEquations && (
        <div className="space-y-6 pt-2">

          {/* Y-Axis */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Perpendicular (Y')</h3>
            <div className="pl-3 border-l-2 border-gray-200">
              <p className="font-mono text-gray-800 text-lg">
                R_N - M cos{simulation.angle}° · g = 0
              </p>
              <p className="font-mono text-green-700 font-bold mt-1">
                {equations.rnCalc}
              </p>
            </div>
          </div>

          {/* X-Axis */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Parallel (X')</h3>
            <div className="pl-3 border-l-2 border-gray-200">
              <p className="font-mono text-gray-800 text-lg">
                ΣF_x' = 0
              </p>
              <p className="font-mono text-gray-900 mt-1 text-base">
                {(() => {
                  const parts = [];
                  const mgSin = `M sin${simulation.angle}° · g`;
                  parts.push(mgSin);

                  const { scenario, push, motionDirection } = simulation;
                  const { friction } = forces;

                  if (push > 0 || scenario === 'external_force') {
                    parts.push(`- F_2`);
                  }
                  if (scenario === 'pulley' || simulation.tension > 0) {
                    parts.push(`- F_1`);
                  }
                  if (friction > 0) {
                    if (motionDirection === 'down') parts.push(`- F_f`);
                    else if (motionDirection === 'up') parts.push(`+ F_f`);
                  } else if (simulation.mu > 0 && motionDirection === 'none') {
                    parts.push(`± F_f`);
                  }

                  return `${parts.join(' ')} = 0`;
                })()}
              </p>
            </div>
          </div>

          {/* Pulley */}
          {simulation.scenario === 'pulley' && (
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Hanging Mass</h3>
              <div className="pl-3 border-l-2 border-indigo-200">
                <p className="font-mono text-gray-800">
                  T - m_a · g = 0
                </p>
                <p className="font-mono text-indigo-700 font-bold mt-1">
                  T = {(simulation.pulleyMass * 9.81).toFixed(2)} N
                </p>
              </div>
            </div>
          )}

          {/* Components */}
          {simulation.angle > 0 && (
            <div className="bg-gray-50 p-3 rounded text-sm text-gray-600 font-mono space-y-1">
              <p>Weight_yy = {equations.weightPerpendicular} N</p>
              <p>Weight_xx = {equations.weightParallel} N</p>
            </div>
          )}

        </div >
      )}
    </div >
  );
};

export default Equations;
