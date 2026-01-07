interface HeaderProps {
  onShowInfo: () => void;
}

const Header = ({ onShowInfo }: HeaderProps) => {
  return (
    <div className="p-4 md:p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex flex-col gap-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black mb-2 text-white tracking-tight">
            MEF Learning Simulation
          </h1>
          <p className="text-lg text-blue-100 font-medium">
            Chapters 5, 5.3 & 6.1: Free Body Diagrams, Friction & Equilibrium
          </p>
        </div>
        <button
          onClick={onShowInfo}
          className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg text-base font-bold transition-all flex items-center gap-2 backdrop-blur-sm shadow-sm"
        >
          ℹ️ App Info
        </button>
      </div>
      <div className="mt-1 flex flex-wrap gap-2 text-xs md:text-sm">
        <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">📚 Step-by-Step Tutorial</span>
        <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">🎮 Interactive Exploration</span>
        <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">📐 Real-Time Equations</span>
        <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">🧮 Dynamic Force Scaling</span>
      </div>
    </div>
  );
};

export default Header;
