export interface SimulationState {
  angle: number;
  mass: number;
  mu: number;
  tension: number;
  push: number;
  showMass: boolean;
  showTension: boolean;
  showPush: boolean;
  motionDirection: 'none' | 'up' | 'down';
  showEquations: boolean;
  // New Scenario Fields
  scenario: 'basic' | 'external_force' | 'pulley';
  externalForceMagnitude: number; // For Ch 5.3
  externalForceAngle: number;     // For Ch 5.3 (degrees relative to horizontal)
  pulleyMass: number;             // For Ch 6.1 (Mass A)
}

export interface GuidedLearningState {
  currentStep: number;
  answeredQuestions: Set<string>;
}

export const initialSimulationState: SimulationState = {
  angle: 0,
  mass: 10,
  mu: 0.3,
  tension: 0,
  push: 0,
  showMass: false,
  showTension: false,
  showPush: false,
  motionDirection: 'none',
  showEquations: false,
  scenario: 'basic',
  externalForceMagnitude: 20,
  externalForceAngle: 30,
  pulleyMass: 5,
};

export const initialGuidedLearningState: GuidedLearningState = {
  currentStep: 1,
  answeredQuestions: new Set(),
};
