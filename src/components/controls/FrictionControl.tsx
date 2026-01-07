import { SimulationState } from '../../types/simulation';

interface FrictionControlProps {
    simulation: SimulationState;
    onUpdateSimulation: (updates: Partial<SimulationState>) => void;
    showDirectionOnly?: boolean;
    className?: string;
}

export const FrictionControl = ({
    simulation,
    onUpdateSimulation,
    showDirectionOnly = false,
    className = ''
}: FrictionControlProps) => {
    return (
        <div className={`bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm ${className}`}>
            <h3 className="text-lg font-bold text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-2">
                <span>🛑</span> Friction Force (F<sub>f</sub>)
            </h3>
            <p className="text-sm text-gray-500 mb-4 italic">Set impending motion direction:</p>

            <div>
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

                {!showDirectionOnly && (
                    <>
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
                    </>
                )}
            </div>
        </div>
    );
};
