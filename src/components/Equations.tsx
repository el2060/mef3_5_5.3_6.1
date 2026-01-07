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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">🧮</span>
          Equations
        </h2>
        <button
          onClick={onToggle}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg px-4 py-2 text-base shadow transition-all duration-200"
        >
          {simulation.showEquations ? 'Hide' : 'Show'}
        </button>
      </div>

      {simulation.showEquations && (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200 space-y-4">

          {/* Y-Axis Equations */}
          <div className="bg-white p-3 rounded-md border-l-4 border-blue-500 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-2 font-mono">
              ΣF<sub className="text-xs">y'</sub> = 0 <span className="text-sm font-normal text-gray-600 ml-2">(Perpendicular)</span>
            </h3>
            <p className="text-base font-mono text-gray-800 ml-4 mb-1">
              {equations.sumFy} = 0
            </p>
            <p className="text-base font-mono text-green-700 ml-4 bg-green-50 inline-block px-2 py-1 rounded">
              {equations.rnCalc}
            </p>
          </div>

          {/* X-Axis Equations */}
          <div className="bg-white p-3 rounded-md border-l-4 border-blue-500 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-2 font-mono">
              ΣF<sub className="text-xs">x'</sub> = 0 <span className="text-sm font-normal text-gray-600 ml-2">(Parallel)</span>
            </h3>
            <p className="text-base font-mono text-gray-800 ml-4 mb-1">
              {equations.sumFx} = 0
            </p>
            {equations.frictionCalc && (
              <p className="text-base font-mono text-yellow-700 ml-4 bg-yellow-50 inline-block px-2 py-1 rounded mt-1">
                {equations.frictionCalc}
              </p>
            )}
            {/* Added Explanatory Text per Feedback */}
            {simulation.motionDirection !== 'none' && (
              <p className="text-sm text-red-600 mt-2 font-medium italic">
                F_f opposes impending motion (acts {simulation.motionDirection === 'down' ? 'up-slope' : 'down-slope'})
                {simulation.angle > 0 && ` At θ=${simulation.angle}°`}
              </p>
            )}
          </div>

          {simulation.angle > 0 && (
            <div className="bg-blue-100 p-3 rounded-md border border-blue-200">
              <h3 className="text-sm font-bold text-blue-800 mb-2">Weight Components:</h3>
              <p className="text-xs font-mono text-blue-900">
                Parallel (x'): Mg·sin({simulation.angle}°) = {equations.weightParallel} N
              </p>
              <p className="text-xs font-mono text-blue-900">
                Perpendicular (y'): Mg·cos({simulation.angle}°) = {equations.weightPerpendicular} N
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Equations;
