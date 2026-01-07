import { SimulationState } from '../types/simulation';

export const calculateForces = (state: SimulationState) => {
  const { angle, mass, mu, tension, push, motionDirection } = state;
  const g = 9.8;
  const angleRad = (angle * Math.PI) / 180;

  const weight = mass * g;

  // When there's a horizontal push force on an incline, it affects the normal force
  // Push has horizontal and perpendicular components relative to the incline
  const pushPerpendicularComponent = push * Math.sin(angleRad);
  const pushParallelComponent = push * Math.cos(angleRad);

  // Normal force balances weight's perpendicular component + push's perpendicular component
  const normalForce = weight * Math.cos(angleRad) + pushPerpendicularComponent;

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

  if (showPush && push > 0 && angle > 0) {
    yEquationParts.push(`+ P sin(${angleStr}°)`);
  }

  // Normal Force (Opposing, so Negative)
  yEquationParts.push(`- R_N`);

  const sumFy = yEquationParts.join(' ');
  const rnCalc = `R_N = ${fmt(normalForce)} N`;


  // X-axis (parallel)
  // Feedback: "+ F1 - F_f = 0".
  // Driving forces Positive, Resisting forces Negative.

  let xEquationParts: string[] = [];
  let frictionCalcStr = '';

  // Tension (Driving Up -> Positive)
  if (showTension) xEquationParts.push(`+ T`);

  // Push (Driving Up -> Positive)
  if (showPush && push > 0) {
    if (angle === 0) xEquationParts.push(`+ P`);
    else xEquationParts.push(`+ P cos(${angleStr}°)`);
  }

  // Weight component (Driving Down -> Negative for up-motion? Or just "Down Slope Force")
  // If we treat "Up Slope" as Positive x:
  // T is +, P is +. Mg_sin is -.
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


