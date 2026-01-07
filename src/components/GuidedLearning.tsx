
import { useState, useEffect } from 'react';
import { SimulationState } from '../types/simulation';

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
  onShowFeedback, // Keeping for compatibility but not using for questions
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
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span>📖</span> Guided Learning
        </h2>
        <button onClick={onReset} className="text-xs text-gray-500 underline hover:text-red-500">Reset All</button>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">

        {/* Step 1 */}
        {currentStep === 1 && (
          <div>
            <StepHeader title="STEP 1: FLAT SURFACE" />
            <p className="text-sm text-gray-700 mb-2">
              Start with a flat surface (Angle 0°).
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-3">
              <li>Set <strong>Angle</strong> to <strong>0°</strong></li>
              <li>Check <strong>"Mass (Mg) & R_N"</strong></li>
            </ul>

            {simulation.angle !== 0 && (
              <div className="mb-2 text-xs bg-yellow-100 text-yellow-800 p-2 rounded">
                ⚠️ Set angle to 0° to continue.
              </div>
            )}

            <div className="mt-3 p-3 bg-white rounded border border-gray-200">
              <p className="text-sm font-semibold text-gray-800 mb-2">Q: Direction of Normal Force (R_N) on flat surface?</p>

              {!answeredQuestions.has('step1-q1') ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setFeedback({ ...feedback, 'step1-q1': { type: 'success', text: "Correct! R_N is vertical (perpendicular to surface)." } }) || onMarkAnswered('step1-q1')}
                    className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
                  >
                    Vertically Up
                  </button>
                  <button
                    onClick={() => setFeedback({ ...feedback, 'step1-q1': { type: 'error', text: "Incorrect. Normal means perpendicular." } })}
                    className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
                  >
                    Horizontal
                  </button>
                </div>
              ) : (
                <div className="text-sm text-green-700 font-medium">✓ Correct! R_N is perpendicular.</div>
              )}
              <FeedbackMsg qId="step1-q1" />
            </div>

            {answeredQuestions.has('step1-q1') && (
              <button onClick={() => onNextStep(2)} className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold text-sm">
                Next →
              </button>
            )}
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div>
            <StepHeader title="STEP 2: FRICTION BASICS" />
            <p className="text-sm text-gray-700 mb-2">
              Let's add tension and try to move the block right.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-3">
              <li>Add <strong>"Tension (T)"</strong></li>
              <li>Select <strong>"Motion Up-Slope"</strong> (Right)</li>
            </ul>

            <div className="mt-3 p-3 bg-white rounded border border-gray-200">
              <p className="text-sm font-semibold text-gray-800 mb-2">Q: Block moves right. Which way does Friction point?</p>

              {!answeredQuestions.has('step2') ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => checkAnswer('step2', 'left', 'left', "Correct! Friction opposes motion.", "Incorrect. Friction opposes motion.")}
                    className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
                  >
                    Left (Opposite)
                  </button>
                  <button
                    onClick={() => checkAnswer('step2', 'right', 'left', "", "Incorrect. Friction opposes motion.")}
                    className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
                  >
                    Right (Same)
                  </button>
                </div>
              ) : (
                <div className="text-sm text-green-700 font-medium">✓ Correct! Friction opposes motion.</div>
              )}
              <FeedbackMsg qId="step2" />
            </div>

            {answeredQuestions.has('step2') && (
              <button
                onClick={() => {
                  onUpdateSimulation({ showTension: true, motionDirection: 'up' });
                  onNextStep(3);
                }}
                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold text-sm"
              >
                Next: Inclines →
              </button>
            )}
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <div>
            <StepHeader title="STEP 3: INCLINED PLANE" />
            <p className="text-sm text-gray-700 mb-2">
              We've reset the view for you. Now, let's tilt the surface.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-3">
              <li>Set <strong>Angle</strong> to <strong>30°</strong></li>
              <li>Check <strong>"Mass (Mg) & R_N"</strong></li>
            </ul>

            <div className="mt-3 p-3 bg-white rounded border border-gray-200">
              <p className="text-sm font-semibold text-gray-800 mb-2">Q1: Direction of Weight (Mg)?</p>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => checkAnswer('step3-q1', 'down', 'down', "Correct! Gravity is always clear down.", "No. Weight is always vertical.")}
                  disabled={answeredQuestions.has('step3-q1')}
                  className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${answeredQuestions.has('step3-q1') ? 'bg-gray-50 text-gray-400' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  Vertically Down
                </button>
                <button
                  onClick={() => checkAnswer('step3-q1', 'perp', 'down', "", "No. Weight is always vertical.")}
                  disabled={answeredQuestions.has('step3-q1')}
                  className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${answeredQuestions.has('step3-q1') ? 'bg-gray-50 text-gray-400' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  Perpendicular
                </button>
              </div>
              <FeedbackMsg qId="step3-q1" />

              {answeredQuestions.has('step3-q1') && (
                <>
                  <p className="text-sm font-semibold text-gray-800 mt-4 mb-2">Q2: Direction of Normal Force (R_N)?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => checkAnswer('step3-q2', 'perp', 'perp', "Correct!", "Incorrect.")}
                      disabled={answeredQuestions.has('step3-q2')}
                      className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${answeredQuestions.has('step3-q2') ? 'bg-gray-50 text-gray-400' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      Perpendicular to Surface
                    </button>
                    <button
                      onClick={() => checkAnswer('step3-q2', 'up', 'perp', "", "Incorrect. Normal means perpendicular.")}
                      disabled={answeredQuestions.has('step3-q2')}
                      className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${answeredQuestions.has('step3-q2') ? 'bg-gray-50 text-gray-400' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      Vertically Up
                    </button>
                  </div>
                  <FeedbackMsg qId="step3-q2" />
                </>
              )}
            </div>

            {answeredQuestions.has('step3-q2') && (
              <button onClick={() => onNextStep(4)} className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold text-sm">
                Next →
              </button>
            )}
          </div>
        )}

        {/* Step 4 */}
        {currentStep === 4 && (
          <div>
            <StepHeader title="STEP 4: COMPONENTS" />
            <p className="text-sm text-gray-700 mb-2">
              Since weight (Mg) isn't perpendicular to the surface anymore, we split it.
            </p>
            <div className="bg-blue-50 p-2 rounded text-xs text-blue-900 mb-3 border border-blue-100">
              <strong>Key Concept:</strong> R_N balances the perpendicular component of weight.
            </div>

            <div className="mt-3 p-3 bg-white rounded border border-gray-200">
              <p className="text-sm font-semibold text-gray-800 mb-2">Q: Which component does Normal Force (R_N) balance?</p>

              {!answeredQuestions.has('step4-q2') ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => checkAnswer('step4-q2', 'cos', 'cos', "Correct! R_N = Mg cos(θ).", "Incorrect. Sin is parallel.")}
                    className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
                  >
                    Mg cos(θ) (Perp)
                  </button>
                  <button
                    onClick={() => checkAnswer('step4-q2', 'sin', 'cos', "", "Incorrect. Sin is parallel.")}
                    className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
                  >
                    Mg sin(θ) (Parallel)
                  </button>
                </div>
              ) : (
                <div className="text-sm text-green-700 font-medium">✓ Correct! R_N balances Mg cos(θ).</div>
              )}
              <FeedbackMsg qId="step4-q2" />
            </div>

            {answeredQuestions.has('step4-q2') && (
              <button onClick={() => onNextStep(5)} className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold text-sm">
                Next →
              </button>
            )}
          </div>
        )}

        {/* Step 5 */}
        {currentStep === 5 && (
          <div>
            <StepHeader title="STEP 5: EQUILIBRIUM" />
            <p className="text-sm text-gray-700 mb-2">
              <strong>Mg sin(θ)</strong> pulls the block DOWN the slope. Friction must stop it.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-3">
              <li>Select <strong>"Motion Down-Slope"</strong></li>
            </ul>

            <div className="mt-3 p-3 bg-white rounded border border-gray-200">
              <p className="text-sm font-semibold text-gray-800 mb-2">Q: To stop sliding DOWN, where does Friction point?</p>

              {!answeredQuestions.has('step5') ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      checkAnswer('step5', 'up', 'up', "Correct! Friction points UP to stop DOWN motion.", "Incorrect.");
                      onUpdateSimulation({ motionDirection: 'down' });
                    }}
                    className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
                  >
                    Up the Incline
                  </button>
                  <button
                    onClick={() => checkAnswer('step5', 'down', 'up', "", "Incorrect. The block is sliding down, so friction opposes (up).")}
                    className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
                  >
                    Down the Incline
                  </button>
                </div>
              ) : (
                <div className="text-sm text-green-700 font-medium">✓ Correct! Friction points UP.</div>
              )}
              <FeedbackMsg qId="step5" />
            </div>

            {answeredQuestions.has('step5') && (
              <button onClick={() => onNextStep(6)} className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold text-sm">
                Finish →
              </button>
            )}
          </div>
        )}

        {/* Step 6 */}
        {currentStep === 6 && (
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Module Complete!</h3>
            <p className="text-sm text-gray-600 mb-4">You've mastered the basics of Free Body Diagrams.</p>

            <button
              onClick={onReset}
              className="w-full bg-gray-800 hover:bg-black text-white py-3 rounded-lg font-bold shadow-lg transition-transform transform hover:scale-105"
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
