import { SimulationState } from '../../types/simulation';

interface ForceControlProps {
    simulation: SimulationState;
    onUpdateSimulation: (updates: Partial<SimulationState>) => void;
    showMassOnly?: boolean;
    showTensionOnly?: boolean;
    className?: string;
}

export const ForceControl = ({
    simulation,
    onUpdateSimulation,
    showMassOnly = false,
    showTensionOnly = false,
    className = ''
}: ForceControlProps) => {

    // Helper to determine visibility based on simple props or scenario
    // If specific "showXOnly" is true, show only that. Else show generic rules.

    const showMass = true; // Always available unless refined
    const showTension = !showMassOnly;
    const showPush = !showMassOnly && !showTensionOnly;

    return (
        <div className={`bg-white border border-gray-200 rounded-xl p-5 shadow-sm ${className}`}>
            <h3 className="text-lg font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                <span>💪</span> {showMassOnly ? 'Mass' : 'Forces'}
            </h3>

            {/* Mass Control */}
            {showMass && (
                <div className={`mb-6 pb-4 ${showTension || showPush ? 'border-b border-gray-100' : ''}`}>
                    <label className="flex items-center text-lg font-bold mb-3 cursor-pointer hover:text-green-700 transition-colors">
                        <input
                            type="checkbox"
                            checked={simulation.showMass}
                            onChange={(e) => onUpdateSimulation({ showMass: e.target.checked })}
                            className="mr-3 w-5 h-5 accent-green-600"
                        />
                        <span className="text-green-600 font-bold">Mass (Mg) & R<sub>N</sub></span>
                    </label>
                    <div className="text-base text-gray-600 mb-2 font-medium">Mass (kg): <span className="font-bold text-gray-900 text-lg">{simulation.mass}</span></div>
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
            )}

            {/* Tension Control */}
            {showTension && (
                <div className={`mb-4 ${showPush ? 'pb-4 border-b border-gray-100' : ''} transition-opacity duration-300 ${simulation.scenario === 'basic' || simulation.scenario === 'pulley' ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                    <label className="flex items-center text-base font-medium mb-2 cursor-pointer hover:text-red-700 transition-colors">
                        <input
                            type="checkbox"
                            checked={simulation.showTension}
                            onChange={(e) => onUpdateSimulation({ showTension: e.target.checked })}
                            disabled={simulation.scenario === 'external_force'}
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
                        disabled={!simulation.showTension || simulation.scenario === 'external_force'}
                        className="w-full h-2 accent-red-600"
                    />
                </div>
            )}

            {/* Push Control */}
            {showPush && (
                <div className={`transition-opacity duration-300 ${simulation.scenario === 'basic' || simulation.scenario === 'external_force' ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                    <label className="flex items-center text-base font-medium mb-2 cursor-pointer hover:text-cyan-700 transition-colors">
                        <input
                            type="checkbox"
                            checked={simulation.showPush}
                            onChange={(e) => onUpdateSimulation({ showPush: e.target.checked })}
                            disabled={simulation.scenario === 'pulley'}
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
                        disabled={!simulation.showPush || simulation.scenario === 'pulley'}
                        className="w-full h-2 accent-cyan-600"
                    />
                </div>
            )}
        </div>
    );
};
