import { SimulationState } from '../types/simulation';

export const calculateForces = (state: SimulationState) => {
  const { angle, mass, mu, tension: manualTension, push: manualPush, motionDirection, scenario, externalForceMagnitude, externalForceAngle, pulleyMass } = state;
  const g = 9.8;
  const angleRad = (angle * Math.PI) / 180;

  let tension = manualTension;
  let push = manualPush;
  let pushAngleRad = 0;

  // Scenario Overrides
  if (scenario === 'external_force') {
    push = externalForceMagnitude;
    pushAngleRad = (externalForceAngle * Math.PI) / 180;
  } else if (scenario === 'pulley') {
    tension = pulleyMass * g;
  }

  const weight = mass * g;

  // Push Components (New Logic)
  // Assume externalForceAngle is relative to the incline (parallel).
  // +Angle = pushing DOWN into the slope (adding to Normal Force)?
  // Let's standardise: Angle is relative to Parallel X-axis.
  // if Angle=0, P acts Purely Parallel (up/right).
  // if Angle=-30, P acts 30 deg INTO the slope?
  // Let's assume standard vector decomposition:
  // P_x = P * cos(theta)
  // P_y = P * sin(theta) (Positive P_y implies UP away from surface? Or should we flip signs?)
  // Let's stick to: "Angle relative to horizontal" might be best, but "Relative to Incline" is easier for the engine.
  // Logic: P is applied at `externalForceAngle` relative to the incline x-axis.
  // So P_parallel = P * cos(alpha)
  // P_perp = P * sin(alpha)

  // Correction: Typically "Angle below horizontal" implies pushing INTO the slope.
  // If we simply use cos/sin of the input angle:
  // Input: 30 deg. P_x = P cos30, P_y = P sin30.
  // If we want P_y to press INTO the block (increasing R_N), and standard Y is "Perpendicular Out", then P_y should be negative?
  // Let's check `normalForce` calc below: `weightPerpendicular + pushPerpendicularComponent`.
  // If `pushPerpendicularComponent` is positive, it ADDS to the weight load, increasing R_N.
  // So P_sin(alpha) should be positive if alpha is "into" slope.
  // Let's treat `externalForce` angle as "Angle depression from parallel".
  // i.e. 30 deg means 30 deg INTO the slope.

  const pushPerpendicularComponent = push * Math.sin(pushAngleRad);
  const pushParallelComponent = push * Math.cos(pushAngleRad);

  // Normal Force = Mg cos(theta) + P sin(alpha) 
  // (Assuming P sin(alpha) pushes INTO the slope)
  const normalForce = Math.max(0, weight * Math.cos(angleRad) + pushPerpendicularComponent);

  const weightParallel = weight * Math.sin(angleRad);
  const weightPerpendicular = weight * Math.cos(angleRad);

  let friction = 0;
  if (motionDirection !== 'none') {
    friction = mu * normalForce;
  }

  return {
    weight,
    normalForce,
    weightParallel,
    weightPerpendicular,
    friction,
    tension,
    push,
    pushParallelComponent,
    pushPerpendicularComponent,
    g,
    angleRad,
    pushAngleRad, // Export for visualization
  };
};



// Helper to format numbers nicely (removing unnecessary decimals)
const fmt = (n: number) => parseFloat(n.toFixed(2)).toString();

export const getEquations = (state: SimulationState, forces: ReturnType<typeof calculateForces>) => {
  const { angle, mu, motionDirection, showTension, showPush, push } = state;
  const { normalForce, weightPerpendicular, weightParallel, friction } = forces;

  const angleStr = angle.toFixed(0);

  // Y-axis (perpendicular)
  // Desired format: Mg·cosθ - R_N - P·sinθ = 0 (or similar, verifying lecturer wants Mg first)
  // Lecturer suggestion: "Mg - R_N = 0". So we start with positive Weight component.

  let yEquationParts: string[] = [];

  // Weight component (Positive per feedback preference)
  if (angle === 0) {
    yEquationParts.push(`Mg`);
  } else {
    yEquationParts.push(`Mg cos(${angleStr}°)`);
  }

  // Push component (Negative relative to Mg? No, usually Push pushes INTO surface, same direction as Mg_perp)
  // If we take "Into Surface" as Positive:
  // Mg_perp points INTO surface (+). P_y points INTO surface (+). R_N points OUT (-).
  // Eq: Mg_perp + P_y - R_N = 0.
  // Let's check logic: R_N = Mg_perp + P_y. So Mg_perp + P_y - R_N = 0 is correct algebraically.

  // Scenario-Specific Equations

  if (state.scenario === 'external_force') {
    // Y-Axis: Mg cosθ + P sinα - R_N = 0
    // P sinα is the component pushing into the slope (if alpha is positive "depression")
    if (push > 0) {
      yEquationParts.splice(1, 0, `+ P sin(${state.externalForceAngle}°)`);
    }
  }

  const sumFy = yEquationParts.join(' ');
  const rnCalc = `R_N = ${fmt(normalForce)} N`;


  // X-axis (parallel)
  let xEquationParts: string[] = [];
  let frictionCalcStr = '';

  // Driving forces

  // Tension
  if (showTension || state.scenario === 'pulley') {
    xEquationParts.push(`+ T`);
  }

  // Push (External Force)
  if ((showPush || state.scenario === 'external_force') && push > 0) {
    // P cos(alpha)
    if (state.scenario === 'external_force') {
      xEquationParts.push(`+ P cos(${state.externalForceAngle}°)`);
    } else {
      // Legacy "Push" logic (horizontal)
      if (angle === 0) xEquationParts.push(`+ P`);
      else xEquationParts.push(`+ P cos(${angleStr}°)`);
    }
  }

  // Weight component (Down slope)
  if (angle > 0) {
    xEquationParts.push(`- Mg sin(${angleStr}°)`);
  }

  // Friction (opposes motion)
  if (motionDirection === 'up') {
    // Motion UP. Friction DOWN (-).
    xEquationParts.push(`- F_f`);
    frictionCalcStr = `F_f = μ R_N = ${mu.toFixed(2)} × ${fmt(normalForce)} = ${fmt(friction)} N`;
  } else if (motionDirection === 'down') {
    // Motion DOWN. Friction UP (+).
    xEquationParts.push(`+ F_f`);
    frictionCalcStr = `F_f = μ R_N = ${mu.toFixed(2)} × ${fmt(normalForce)} = ${fmt(friction)} N`;
  }

  // If no parts, just say 0
  if (xEquationParts.length === 0) xEquationParts.push('0');

  const sumFx = xEquationParts.join(' ');

  return {
    sumFy, // "Mg... - R_N = 0"
    rnCalc,
    sumFx,
    frictionCalc: frictionCalcStr,
    weightParallel: fmt(weightParallel),
    weightPerpendicular: fmt(weightPerpendicular),
  };
};


