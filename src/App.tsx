import { useState } from 'react';
import { SimulationState, GuidedLearningState, initialSimulationState, initialGuidedLearningState } from './types/simulation';
import Header from './components/Header';
import Instructions from './components/Instructions';
import GuidedLearning from './components/GuidedLearning';
import Controls from './components/Controls';
import Visualization from './components/Visualization';
import Equations from './components/Equations';
import Modal from './components/Modal';

function App() {
  const [simulation, setSimulation] = useState<SimulationState>(initialSimulationState);
  const [guidedLearning, setGuidedLearning] = useState<GuidedLearningState>(initialGuidedLearningState);
  const [modalContent, setModalContent] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<'guided' | 'freeform'>('guided');
  const [hasStarted, setHasStarted] = useState(false);


  const updateSimulation = (updates: Partial<SimulationState>) => {
    setSimulation(prev => ({ ...prev, ...updates }));
  };

  const resetSimulation = () => {
    setSimulation(initialSimulationState);
  };

  const nextStep = (step: number) => {
    setGuidedLearning(prev => ({ ...prev, currentStep: step }));

    // Auto-setup for steps
    if (step === 2) {
      resetSimulation();
      updateSimulation({ angle: 0, showMass: true });
    } else if (step === 3) {
      resetSimulation();
    } else if (step === 4) {
      updateSimulation({ showEquations: true });
    }
  };


  const resetGuidedLearning = () => {
    setGuidedLearning(initialGuidedLearningState);
  };

  // Switch to freeform if user finishes guided steps or explicitly toggles
  const handleViewModeChange = (mode: 'guided' | 'freeform') => {
    setViewMode(mode);
    if (mode === 'guided') {
      // Optional: Reset guided learning if switching back? Or just resume?
      // For now, resume.
    }
  };



  const resetAll = () => {
    resetSimulation();
    // Do NOT reset guided learning progress (step), so user stays on current step.
    // Only reset if completely restarting (which can be done via refreshing or a separate 'Restart Tutorial' if needed).
    // setGuidedLearning(initialGuidedLearningState); 
  };

  const showFeedback = (text: string) => {
    setModalContent(text);
    setShowModal(true);
  };



  const markQuestionAnswered = (questionId: string) => {
    setGuidedLearning(prev => ({
      ...prev,
      answeredQuestions: new Set([...prev.answeredQuestions, questionId]),
    }));
  };

  return (
    <div className="min-h-screen bg-neutral-bg p-2 md:p-4">
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        content={modalContent}
      />

      <div className="max-w-[1800px] mx-auto bg-white rounded-2xl shadow-card overflow-hidden border border-gray-200/50">
        <Header

          viewMode={viewMode}
          onToggleViewMode={handleViewModeChange}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

          {/* LEFT: Guided Learning - Expanded in Guided Mode */}
          <div className={`${viewMode === 'guided' ? 'lg:col-span-5' : 'lg:col-span-4'} border-b lg:border-b-0 lg:border-r border-gray-200 transition-all duration-300`}>
            <div className="lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto">
              <GuidedLearning
                currentStep={guidedLearning.currentStep}
                answeredQuestions={guidedLearning.answeredQuestions}
                onNextStep={nextStep}
                onReset={resetGuidedLearning}
                onShowFeedback={showFeedback}

                onMarkAnswered={markQuestionAnswered}
                simulation={simulation}
                onUpdateSimulation={updateSimulation}
              />
              <Instructions />
            </div>
          </div>

          {/* CENTER: Visualization - Takes remaining space */}
          <div className={`${viewMode === 'guided' ? 'lg:col-span-7' : 'lg:col-span-5'} border-b lg:border-b-0 lg:border-r border-gray-200 transition-all duration-300`}>
            <Visualization simulation={simulation} />
            <Equations
              simulation={simulation}
              onToggle={() => updateSimulation({ showEquations: !simulation.showEquations })}
            />
          </div>

          {/* RIGHT: Controls - Hidden in Guided Mode */}
          <div className={`lg:col-span-3 ${viewMode === 'guided' ? 'hidden' : 'block'} transition-all duration-300`}>
            <div className="lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto">
              <Controls
                simulation={simulation}
                onUpdateSimulation={updateSimulation}
                onReset={resetAll}
                currentStep={guidedLearning.currentStep}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
