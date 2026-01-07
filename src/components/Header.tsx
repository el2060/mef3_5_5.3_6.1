interface HeaderProps {
  viewMode: 'guided' | 'freeform';
  onToggleViewMode: (mode: 'guided' | 'freeform') => void;
}

const Header = ({ viewMode, onToggleViewMode }: HeaderProps) => {
  return (
    <div className="p-4 md:p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black mb-2 text-white tracking-tight">
            MEF Learning Simulation
          </h1>
          <p className="text-lg text-blue-100 font-medium">
            Chapters 5, 5.3 & 6.1: Free Body Diagrams, Friction & Equilibrium
          </p>
        </div>
      </div>

      <div className="flex bg-blue-800/30 p-1 rounded-xl w-full md:w-auto self-start backdrop-blur-sm">
        <button
          onClick={() => onToggleViewMode('guided')}
          className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm md:text-base font-bold transition-all ${viewMode === 'guided' ? 'bg-white text-blue-700 shadow-md' : 'text-blue-200 hover:text-white hover:bg-white/10'}`}
        >
          📖 Guided Mode
        </button>
        <button
          onClick={() => onToggleViewMode('freeform')}
          className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm md:text-base font-bold transition-all ${viewMode === 'freeform' ? 'bg-white text-blue-700 shadow-md' : 'text-blue-200 hover:text-white hover:bg-white/10'}`}
        >
          🛠️ Freeform Mode
        </button>
      </div>
    </div>
  );
};

export default Header;
