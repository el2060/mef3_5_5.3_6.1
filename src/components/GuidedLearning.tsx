
import { useState, useEffect } from 'react';
import { SimulationState } from '../types/simulation';
import { AngleControl } from './controls/AngleControl';
import { ForceControl } from './controls/ForceControl';
import { FrictionControl } from './controls/FrictionControl';

interface GuidedLearningProps {
  currentStep: number;
  answeredQuestions: Set<string>;
  onNextStep: (step: number) => void;

  onReset: () => void;
  onShowFeedback: (text: string) => void;
  onMarkAnswered: (questionId: string) => void;
  simulation: SimulationState;
  onUpdateSimulation: (updates: Partial<SimulationState>) => void;
  hasStarted: boolean;
  onStart: () => void;
}

const GuidedLearning = ({
  currentStep,
  answeredQuestions,
  onNextStep,
  onReset,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onShowFeedback: _onShowFeedback, // Keeping for compatibility but not using for questions
  onMarkAnswered,
  simulation,
  onUpdateSimulation,
  hasStarted,
  onStart,
}: GuidedLearningProps) => {

  const [feedback, setFeedback] = useState<{ [key: string]: { type: 'success' | 'error', text: string } }>({});

  // Clear feedback when step changes
  useEffect(() => {
    setFeedback({});
  }, [currentStep]);

  const checkAnswer = (questionId: string, answer: string, correctAnswer: string, correctFeedback: string, incorrectFeedback: string) => {
    if (answer === correctAnswer) {
      setFeedback(prev => ({ ...prev, [questionId]: { type: 'success', text: correctFeedback } }));
      onMarkAnswered(questionId);
    } else {
      setFeedback(prev => ({ ...prev, [questionId]: { type: 'error', text: incorrectFeedback } }));
    }
  };

  const FeedbackMsg = ({ qId }: { qId: string }) => {
    const msg = feedback[qId];
    if (!msg) return null;
    return (
      <div className={`mt-2 p-2 text-sm rounded ${msg.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
        <strong>{msg.type === 'success' ? '✓ ' : '✗ '}</strong>
        {msg.text}
      </div>
    );
  };

  const StepHeader = ({ title }: { title: string }) => (
    <div className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-bold inline-block mb-2">
      {title}
    </div>
  );

  return (
    <div className="p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span>📖</span> Guided Learning
        </h2>
        {currentStep > 0 && currentStep <= 6 && (
          <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
            {[1, 2, 3, 4, 5, 6].map(step => (
              <div
                key={step}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step === currentStep ? 'bg-blue-600 scale-110' : step < currentStep ? 'bg-blue-400' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 transition-all duration-500">

        {!hasStarted && (
          <div className="text-center py-10">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Welcome to Forces & Motion</h3>
            <p className="text-gray-600 mb-8">Follow the guided steps to master Free Body Diagrams.</p>
            <button
              onClick={onStart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
            >
              Start Simulation
            </button>
            <p className="text-sm text-gray-500 mt-3">We load Step 1 automatically</p>
          </div>
        )}

        {/* Step 1 */}
        {hasStarted && currentStep === 1 && (
          <div>
            {/* Step 1: Simplified Flow */}
            <p className="text-lg font-bold text-gray-800 mb-4">
              1. Set the block's mass
            </p>

            {/* Mass Control - Always Visible */}
            <div className="mb-6">
              <ForceControl
                simulation={simulation}
                onUpdateSimulation={onUpdateSimulation}
                showMassOnly={true}
              />
              <p className="text-sm text-gray-500 mt-2 italic">Hint: Diagram updates instantly</p>
            </div>

            {/* Check Understanding - Revealed after Mass (Simulated by just showing it for now, or we can track interaction) */}
            {/* For now, let's keep it simple: Show Check Understanding next */}

            <div className={`transition-all duration-500 ${true ? 'opacity-100' : 'opacity-0'}`}>
              <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm mb-4">
                <p className="text-base font-bold text-gray-800 mb-3">Check understanding:</p>
                <p className="text-sm text-gray-600 mb-3">Which way does Normal Force (R_N) point?</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setFeedback({ ...feedback, 'step1-q1': { type: 'success', text: "Correct! R_N is perpendicular." } }); onMarkAnswered('step1-q1'); }}
                    className={`flex-1 py-2 px-2 rounded-lg text-sm font-bold border-2 ${answeredQuestions.has('step1-q1') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 hover:bg-blue-50 border-gray-200 hover:border-blue-300'}`}
                  >
                    ↑ Up (Perp)
                  </button>
                  <button
                    onClick={() => setFeedback({ ...feedback, 'step1-q1': { type: 'error', text: "Incorrect. Normal means perpendicular." } })}
                    className="flex-1 py-2 px-2 bg-gray-50 hover:bg-red-50 border-2 border-gray-200 hover:border-red-300 rounded-lg text-sm font-bold text-gray-600"
                  >
                    → Right
                  </button>
                </div>
                <FeedbackMsg qId="step1-q1" />
              </div>

              {/* More Controls (Collapsed) */}
              <div className="mt-4 border-t border-gray-100 pt-4 flex justify-between items-start">
                <details className="group flex-1">
                  <summary className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-500 hover:text-blue-600 w-fit">
                    <span>⚙️ More controls</span>
                    <span className="group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="mt-3 pl-2 border-l-2 border-gray-100">
                    <AngleControl
                      simulation={simulation}
                      onUpdateSimulation={onUpdateSimulation}
                    />
                  </div>
                </details>
                <button
                  onClick={onReset}
                  className="text-xs text-gray-400 font-bold hover:text-red-500 uppercase tracking-widest py-1 border-b border-transparent hover:border-red-200 transition-all"
                >
                  Reset
                </button>
              </div>

            </div>

            {answeredQuestions.has('step1-q1') && (
              <button
                onClick={() => onNextStep(2)}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-lg shadow-md transition-all animate-bounce-subtle"
              >
                Next Step →
              </button>
            )}
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div>
            <StepHeader title="STEP 2: FRICTION" />
            <p className="text-base text-gray-700 mb-4 font-medium">
              Add tension and move the block right.
            </p>
            <div className="my-6 space-y-4">
              <ForceControl
                simulation={simulation}
                onUpdateSimulation={onUpdateSimulation}
                showTensionOnly={true}
              />
              <FrictionControl
                simulation={simulation}
                onUpdateSimulation={onUpdateSimulation}
                showDirectionOnly={true}
              />
            </div>

            <div className="mt-4 p-5 bg-white rounded-xl border-2 border-gray-100 shadow-sm">
              <p className="text-lg font-bold text-gray-800 mb-4">Q: Block moves right. Which way does Friction point?</p>

              {!answeredQuestions.has('step2') ? (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => checkAnswer('step2', 'left', 'left', "Correct! Friction opposes motion.", "Incorrect. Friction opposes motion.")}
                    className="flex-1 py-3 px-4 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-lg text-base font-semibold transition-all text-left"
                  >
                    Left (Opposite to motion)
                  </button>
                  <button
                    onClick={() => checkAnswer('step2', 'right', 'left', "", "Incorrect. Friction opposes motion.")}
                    className="flex-1 py-3 px-4 bg-gray-50 hover:bg-red-50 border-2 border-gray-200 hover:border-red-300 rounded-lg text-base font-semibold transition-all text-left"
                  >
                    Right (Same as motion)
                  </button>
                </div>
              ) : (
                <div className="text-base text-green-700 font-bold bg-green-50 p-3 rounded-lg border border-green-200">✓ Correct! Friction opposes motion.</div>
              )}
              <FeedbackMsg qId="step2" />
            </div>

            {answeredQuestions.has('step2') && (
              <button
                onClick={() => {
                  onUpdateSimulation({ showTension: true, motionDirection: 'up' });
                  onNextStep(3);
                }}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all"
              >
                Next: Inclines →
              </button>
            )}
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <div>
            <StepHeader title="STEP 3: INCLINE" />
            <p className="text-base text-gray-700 mb-4 font-medium">
              Let's tilt the surface.
            </p>
            <div className="my-6">
              <AngleControl
                simulation={simulation}
                onUpdateSimulation={onUpdateSimulation}
              />
            </div>

            <div className="mt-4 p-5 bg-white rounded-xl border-2 border-gray-100 shadow-sm">
              <p className="text-lg font-bold text-gray-800 mb-4">Q1: Direction of Weight (Mg)?</p>
              <div className="flex flex-col gap-3 mb-4">
                <button
                  onClick={() => checkAnswer('step3-q1', 'down', 'down', "Correct! Gravity is always clear down.", "No. Weight is always vertical.")}
                  disabled={answeredQuestions.has('step3-q1')}
                  className={`flex-1 py-3 px-4 rounded-lg text-base font-semibold transition-all text-left border-2 ${answeredQuestions.has('step3-q1') ? 'bg-gray-50 text-gray-400 border-gray-100' : 'bg-gray-50 hover:bg-blue-50 border-gray-200 hover:border-blue-300'}`}
                >
                  Vertically Down
                </button>
                <button
                  onClick={() => checkAnswer('step3-q1', 'perp', 'down', "", "No. Weight is always vertical.")}
                  disabled={answeredQuestions.has('step3-q1')}
                  className={`flex-1 py-3 px-4 rounded-lg text-base font-semibold transition-all text-left border-2 ${answeredQuestions.has('step3-q1') ? 'bg-gray-50 text-gray-400 border-gray-100' : 'bg-gray-50 hover:bg-blue-50 border-gray-200 hover:border-blue-300'}`}
                >
                  Perpendicular
                </button>
              </div>
              <FeedbackMsg qId="step3-q1" />

              {answeredQuestions.has('step3-q1') && (
                <>
                  <p className="text-lg font-bold text-gray-800 mt-6 mb-4">Q2: Direction of Normal Force (R_N)?</p>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => checkAnswer('step3-q2', 'perp', 'perp', "Correct!", "Incorrect.")}
                      disabled={answeredQuestions.has('step3-q2')}
                      className={`flex-1 py-3 px-4 rounded-lg text-base font-semibold transition-all text-left border-2 ${answeredQuestions.has('step3-q2') ? 'bg-gray-50 text-gray-400 border-gray-100' : 'bg-gray-50 hover:bg-blue-50 border-gray-200 hover:border-blue-300'}`}
                    >
                      Perpendicular to Surface
                    </button>
                    <button
                      onClick={() => checkAnswer('step3-q2', 'up', 'perp', "", "Incorrect. Normal means perpendicular.")}
                      disabled={answeredQuestions.has('step3-q2')}
                      className={`flex-1 py-3 px-4 rounded-lg text-base font-semibold transition-all text-left border-2 ${answeredQuestions.has('step3-q2') ? 'bg-gray-50 text-gray-400 border-gray-100' : 'bg-gray-50 hover:bg-blue-50 border-gray-200 hover:border-blue-300'}`}
                    >
                      Vertically Up
                    </button>
                  </div>
                  <FeedbackMsg qId="step3-q2" />
                </>
              )}
            </div>

            {answeredQuestions.has('step3-q2') && (
              <button onClick={() => onNextStep(4)} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all">
                Next →
              </button>
            )}
          </div>
        )}

        {/* Step 4 */}
        {currentStep === 4 && (
          <div>
            <StepHeader title="STEP 4: COMPONENTS" />
            <p className="text-base text-gray-700 mb-4 font-medium">
              Weight (Mg) is split into two components.
            </p>
            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-900 mb-4 border border-blue-100">
              <strong className="block mb-1">Key Concept:</strong> R_N balances the perpendicular component of weight.
            </div>

            <div className="mt-4 p-5 bg-white rounded-xl border-2 border-gray-100 shadow-sm">
              <p className="text-lg font-bold text-gray-800 mb-4">Q: Which component balances Normal Force (R_N)?</p>

              {!answeredQuestions.has('step4-q2') ? (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => checkAnswer('step4-q2', 'cos', 'cos', "Correct! R_N = Mg cos(θ).", "Incorrect. Sin is parallel.")}
                    className="flex-1 py-3 px-4 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-lg text-base font-semibold transition-all text-left"
                  >
                    Mg cos(θ) (Perp)
                  </button>
                  <button
                    onClick={() => checkAnswer('step4-q2', 'sin', 'cos', "", "Incorrect. Sin is parallel.")}
                    className="flex-1 py-3 px-4 bg-gray-50 hover:bg-red-50 border-2 border-gray-200 hover:border-red-300 rounded-lg text-base font-semibold transition-all text-left"
                  >
                    Mg sin(θ) (Parallel)
                  </button>
                </div>
              ) : (
                <div className="text-base text-green-700 font-bold bg-green-50 p-3 rounded-lg border border-green-200">✓ Correct! R_N balances Mg cos(θ).</div>
              )}
              <FeedbackMsg qId="step4-q2" />
            </div>

            {answeredQuestions.has('step4-q2') && (
              <button onClick={() => onNextStep(5)} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all">
                Next →
              </button>
            )}
          </div>
        )}

        {/* Step 5 */}
        {currentStep === 5 && (
          <div>
            <StepHeader title="STEP 5: EQUILIBRIUM" />
            <p className="text-base text-gray-700 mb-4 font-medium">
              Friction stops the block from sliding down.
            </p>
            <div className="my-6">
              <FrictionControl
                simulation={simulation}
                onUpdateSimulation={onUpdateSimulation}
                showDirectionOnly={true}
              />
            </div>

            <div className="mt-4 p-5 bg-white rounded-xl border-2 border-gray-100 shadow-sm">
              <p className="text-lg font-bold text-gray-800 mb-4">Q: To stop sliding DOWN, where does Friction point?</p>

              {!answeredQuestions.has('step5') ? (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      checkAnswer('step5', 'up', 'up', "Correct! Friction points UP to stop DOWN motion.", "Incorrect.");
                      onUpdateSimulation({ motionDirection: 'down' });
                    }}
                    className="flex-1 py-3 px-4 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-lg text-base font-semibold transition-all text-left"
                  >
                    Up the Incline
                  </button>
                  <button
                    onClick={() => checkAnswer('step5', 'down', 'up', "", "Incorrect. The block is sliding down, so friction opposes (up).")}
                    className="flex-1 py-3 px-4 bg-gray-50 hover:bg-red-50 border-2 border-gray-200 hover:border-red-300 rounded-lg text-base font-semibold transition-all text-left"
                  >
                    Down the Incline
                  </button>
                </div>
              ) : (
                <div className="text-base text-green-700 font-bold bg-green-50 p-3 rounded-lg border border-green-200">✓ Correct! Friction points UP.</div>
              )}
              <FeedbackMsg qId="step5" />
            </div>

            {answeredQuestions.has('step5') && (
              <button onClick={() => onNextStep(6)} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all">
                Finish →
              </button>
            )}
          </div>
        )}

        {/* Step 6 */}
        {currentStep === 6 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Module Complete!</h3>
            <p className="text-lg text-gray-600 mb-6">You've mastered the basics of Free Body Diagrams.</p>

            <button
              onClick={onReset}
              className="w-full bg-gray-800 hover:bg-black text-white py-4 rounded-xl font-bold shadow-lg transition-transform transform hover:scale-105 uppercase tracking-wide text-lg"
            >
              Restart Learning Module
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default GuidedLearning;
