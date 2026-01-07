import { SimulationState } from '../../types/simulation';

interface AngleControlProps {
    simulation: SimulationState;
    onUpdateSimulation: (updates: Partial<SimulationState>) => void;
    className?: string; // Allow custom styling/highlighting
}

export const AngleControl = ({ simulation, onUpdateSimulation, className = '' }: AngleControlProps) => {
    return (
        <div className={`bg-white border text-gray-800 border-gray-200 rounded-xl p-5 shadow-sm transition-opacity duration-300 ${className}`}>
            <h3 className="text-lg font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                <span>📐</span> Angle
            </h3>
            <div>
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
    );
};
