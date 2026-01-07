
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
        <button onClick={onReset} className="text-sm font-medium text-gray-500 underline hover:text-red-500 transition-colors">Reset All</button>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">

        {/* Step 1 */}
        {currentStep === 1 && (
          <div>
            <StepHeader title="STEP 1: FLAT SURFACE" />
            <p className="text-base text-gray-700 mb-4 font-medium">
              Start with a flat surface (Angle 0°).
            </p>
            {/* Contextual Control: Angle & Mass */}
            <div className="my-6 space-y-4">
              <AngleControl
                simulation={simulation}
                onUpdateSimulation={onUpdateSimulation}
                className={simulation.angle !== 0 ? 'ring-2 ring-yellow-400 bg-yellow-50' : 'bg-green-50 border-green-200'}
              />
              <ForceControl
                simulation={simulation}
                onUpdateSimulation={onUpdateSimulation}
                showMassOnly={true}
              />
            </div>

            {simulation.angle !== 0 && (
              <div className="mb-2 text-xs bg-yellow-100 text-yellow-800 p-2 rounded">
                ⚠️ Set angle to 0° to continue.
              </div>
            )}

            <div className="mt-4 p-5 bg-white rounded-xl border-2 border-gray-100 shadow-sm">
              <p className="text-lg font-bold text-gray-800 mb-4">Q: Direction of Normal Force (R_N) on flat surface?</p>

              {!answeredQuestions.has('step1-q1') ? (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => { setFeedback({ ...feedback, 'step1-q1': { type: 'success', text: "Correct! R_N is vertical (perpendicular to surface)." } }); onMarkAnswered('step1-q1'); }}
                    className="flex-1 py-3 px-4 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-lg text-base font-semibold transition-all text-left"
                  >
                    Short Answer: Vertically Up
                  </button>
                  <button
                    onClick={() => setFeedback({ ...feedback, 'step1-q1': { type: 'error', text: "Incorrect. Normal means perpendicular." } })}
                    className="flex-1 py-3 px-4 bg-gray-50 hover:bg-red-50 border-2 border-gray-200 hover:border-red-300 rounded-lg text-base font-semibold transition-all text-left"
                  >
                    Short Answer: Horizontal
                  </button>
                </div>
              ) : (
                <div className="text-base text-green-700 font-bold bg-green-50 p-3 rounded-lg border border-green-200">✓ Correct! R_N is perpendicular.</div>
              )}
              <FeedbackMsg qId="step1-q1" />
            </div>

            {answeredQuestions.has('step1-q1') && (
              <button onClick={() => onNextStep(2)} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all">
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
              Start Free Play Mode
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default GuidedLearning;
