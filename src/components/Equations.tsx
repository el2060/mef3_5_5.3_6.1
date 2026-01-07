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

          <div className="bg-white p-5 rounded-xl border-l-8 border-blue-500 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-2 font-mono flex items-center gap-3">
              ΣF<sub className="text-sm">y'</sub> = 0 <span className="text-base font-normal text-gray-500 italic">(Perpendicular)</span>
            </h3>
            <div className="space-y-4 ml-1">
              {/* Step 1: Substitution */}
              <p className="text-xl font-mono text-gray-900 mb-1">
                R_N - M cos{simulation.angle}° · 9.81 = 0
              </p>
              {/* Step 2: Result */}
              <p className="text-xl font-mono text-green-700 font-bold bg-green-50 inline-block px-3 py-1.5 rounded-lg border border-green-200">
                {equations.rnCalc}
              </p>
            </div>
          </div>

          {/* X-Axis Equations */}
          <div className="bg-white p-5 rounded-xl border-l-8 border-blue-500 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-2 font-mono flex items-center gap-3">
              ΣF<sub className="text-sm">x'</sub> = 0 <span className="text-base font-normal text-gray-500 italic">(Parallel)</span>
            </h3>
            <div className="space-y-4">
              {/* Step 1: Sum Forces */}
              <p className="text-xl font-mono text-gray-800 mb-1">
                ΣF<sub className="text-xs">x'</sub> = 0
              </p>
              {/* Step 2: Substitution Line */}
              <p className="text-xl font-mono text-gray-900 mb-1">
                {(() => {
                  // Logic for F_net_x equation:
                  // Forces: Push (P), Friction (F_f), Weight Parallel (M sin)
                  // Signs: 
                  //   Push is typically Up Slope (+)
                  //   Friction is Opposing Motion. 
                  //   Weight Parallel is Down Slope (-).

                  // Let's assume standard axes: +x is UP slope.
                  // P: +P (or -P if pulling down, but ours is Push Up usually)
                  // Mg sin: -Mg sin(theta) (Down slope)
                  // F_f: Opposes motion.

                  // User Example: F2 - F1 - Friction + M sin = 0 ?
                  // User Image: F2 (Down), F1 (Up), Friction (Up). 
                  // Axis: x is down slope usually for these probs? The image arrow for x points DOWN-RIGHT.
                  // Wait, let's look at user image "x arrow". It points DOWN slope.
                  // OK, if +x is DOWN slope:
                  // Mg sin theta: + (Down slope)
                  // F_2: + (Down slope)
                  // F_1: - (Up slope)
                  // F_friction: - (Up slope, if motion is varying).

                  // Let's stick to the simulation's coordinate system shown in `Visualization.tsx`:
                  // My previous code: x' axis drawn with arrow pointing DOWN-RIGHT (positive x is down slope).
                  // So:
                  // + Mg sin(theta)
                  // - Friction (if moving down) / + Friction (if moving up)
                  // - Push (if Pushing UP) / + Push (If pushing DOWN)

                  // Let's build the string dynamically
                  const parts = [];

                  // External Forces
                  // F2? We don't have F2 explicit. We have P.
                  // Let's assume P is "F1" (Up slope).

                  // Let's format it generally:
                  // Down Slope forces - Up Slope forces = 0

                  const mgSin = `M sin${simulation.angle}° · 9.81`;
                  // mgSin is usually positive in this axis definition
                  parts.push(mgSin);

                  const { scenario, push, friction, motionDirection } = simulation;

                  // Push (Now mapped to Force F2)
                  if (push > 0 || scenario === 'external_force') {
                    // Assume push is Up Slope generally for "Push" concept?
                    // If P is pushing UP the slope: - F_2
                    parts.push(`- F_2`);
                  }

                  // Pulley Tension (Now Force F1)
                  if (scenario === 'pulley') {
                    // Tension pulls UP slope: - F_1
                    parts.push(`- F_1`);
                  } else if (simulation.tension > 0) {
                    // If manual tension is active (Basic scenario)
                    parts.push(`- F_1`);
                  }

                  // Friction
                  if (friction > 0) {
                    // Opposes motion.
                    // If motion down (positive x velocity), Friction is Up (negative force).
                    // If motion up (negative x velocity), Friction is Down (positive force).
                    if (motionDirection === 'down') {
                      parts.push(`- F_f`);
                    } else if (motionDirection === 'up') {
                      parts.push(`+ F_f`);
                    }
                  } else if (simulation.mu > 0 && motionDirection === 'none') {
                    // Static case? just show +/- F_f?
                    parts.push(`± F_f`);
                  }

                  return `${parts.join(' ')} = 0`;
                })()}
              </p>
              {/* Step 3: Result (optional, or just leave as equation?) User asked for format */}
              {/* User image: F2 - F_1 - F_friction = 0. That's it. */}
            </div>
          </div>

          {/* Pulley Specific Equations (Ch 6.1) */}
          {simulation.scenario === 'pulley' && (
            <div className="bg-indigo-50 p-5 rounded-xl border-l-8 border-indigo-500 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-2 font-mono flex items-center gap-3">
                Mass A (Hanging)
              </h3>
              <div className="pl-4 border-l-2 border-gray-100 ml-1">
                <p className="text-xl font-mono text-gray-800 mb-1">
                  ΣF<sub className="text-xs">y</sub> = T - m_a·g = 0
                </p>
                <p className="text-lg font-mono text-indigo-800 font-bold">
                  T = {simulation.pulleyMass} × 9.81 = {(simulation.pulleyMass * 9.81).toFixed(2)} N
                </p>
              </div>
            </div>
          )}

          {simulation.angle > 0 && (
            <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-100">
              <h3 className="text-base font-bold text-blue-800 mb-2 uppercase tracking-wide">Weight Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="text-sm font-mono text-blue-900 bg-white p-2 rounded border border-blue-100 shadow-sm">
                  <span className="font-bold">Parallel:</span> Mg·sin({simulation.angle}°) = <span className="font-bold">{equations.weightParallel} N</span>
                </p>
                <p className="text-sm font-mono text-blue-900 bg-white p-2 rounded border border-blue-100 shadow-sm">
                  <span className="font-bold">Perp:</span> Mg·cos({simulation.angle}°) = <span className="font-bold">{equations.weightPerpendicular} N</span>
                </p>
              </div>
            </div>
          )}
        </div >
      )}
    </div >
  );
};

export default Equations;
