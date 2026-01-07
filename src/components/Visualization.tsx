import React from 'react';
import { SimulationState } from '../types/simulation';
import { calculateForces } from '../utils/physics';

interface VisualizationProps {
  simulation: SimulationState;
  hasStarted?: boolean;
}

const Visualization = ({ simulation, hasStarted = true }: VisualizationProps) => {
  const forces = calculateForces(simulation);
  const { angle, showMass, showTension, showPush, motionDirection, push } = simulation;
  const { weight, normalForce, friction, tension } = forces;

  // Zoom State
  const [zoom, setZoom] = React.useState(1.0);

  // SVG dimensions
  const width = 900;
  const height = 650;
  const padding = 70;

  if (!hasStarted) {
    return (
      <div className="p-4 md:p-6 bg-white border-b border-gray-200 h-full flex flex-col justify-center items-center min-h-[500px]">
        <div className="text-6xl mb-4">👋</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No diagram loaded yet</h2>
        <p className="text-lg text-gray-500 mb-6 font-medium">Tap "Start Simulation" to begin</p>
      </div>
    );
  }

  // Centering logic continues...
  const centerX = width / 2;
  const centerY = height * 0.6;

  // ViewBox for Zoom
  const viewBoxWidth = width / zoom;
  const viewBoxHeight = height / zoom;
  const viewBoxX = (width - viewBoxWidth) / 2;
  const viewBoxY = (height - viewBoxHeight) / 2;

  // Incline parameters
  const inclineLength = 280;
  const angleRad = (angle * Math.PI) / 180;
  const inclineEndX = centerX + inclineLength * Math.cos(angleRad);
  const inclineEndY = centerY - inclineLength * Math.sin(angleRad);

  // Block position
  const blockX = centerX + (inclineLength / 2) * Math.cos(angleRad);
  const blockY = centerY - (inclineLength / 2) * Math.sin(angleRad);
  const blockSize = 45;

  // Dynamic force scaling
  const maxForce = Math.max(weight, normalForce, friction, tension, push, 1);
  const availableSpace = Math.min(width - 2 * padding, height - 2 * padding);
  const forceScale = Math.min(1.5, availableSpace / maxForce / 1.5);

  // Helper: Get origin for force vectors on the block
  const getForceOrigin = (position: 'center' | 'top' | 'bottom' | 'left' | 'right') => {
    // Basic center
    let x = blockX;
    let y = blockY;

    // Adjust based on rotation
    // We are rotating around blockX, blockY by 'angle' degrees
    // But generating points relative to unrotated block then rotating is easier?
    // Actually, simple offset along rotated axes is best.

    // Perpendicular vector (up-left relative to incline): (-sin, -cos)
    // Parallel vector (down-right relative to incline): (cos, -sin) -- wait, y is down in SVG

    // Local Axes:
    // x' (Parallel Down-Slope): dx = cos(angle), dy = -sin(angle)  <-- Wait, incline goes up-right.
    // Incline End (Right): x increases, y decreases.
    // So "Parallel Up-Slope" vector is (cos, -sin). "Parallel Down-Slope" is (-cos, sin).

    // y' (Perpendicular Up): (-sin, -cos)

    // Wait, let's verify visual:
    // Normal Force points Perpendicular UP. 
    // Top face of block is in direction of y'.

    const half = blockSize / 2;
    // Vectors for block orientation
    const upSlopeX = Math.cos(angleRad);
    const upSlopeY = -Math.sin(angleRad);
    const perpUpX = -Math.sin(angleRad); // Normal direction (Standard Normal to surface?)
    // Vector (-sin, -cos) is "Up-Left" if angle=0 (0, -1). Yes.
    const perpUpY = -Math.cos(angleRad);

    switch (position) {
      case 'center': return { x, y };
      case 'top': return { x: x + perpUpX * half, y: y + perpUpY * half };
      case 'bottom': return { x: x - perpUpX * half, y: y - perpUpY * half };
      // "Right" side of block relative to incline (facing up slope)
      case 'right': return { x: x + upSlopeX * half, y: y + upSlopeY * half };
      // "Left" side
      case 'left': return { x: x - upSlopeX * half, y: y - upSlopeY * half };
    }
    return { x, y };
  };

  // Helper: Draw Arrow
  const drawArrow = (x1: number, y1: number, x2: number, y2: number, color: string, label: string | React.ReactNode, labelOffset: { x: number, y: number } = { x: 0, y: 0 }, fontSize: number = 14) => {
    // Determine marker ID based on color
    let markerId = "arrowhead"; // Default black
    if (color === '#d00000') markerId = "redArrowhead";
    if (color === '#FF6E6C') markerId = "pinkArrowhead"; // Tension/Mass
    if (color === '#9C27B0') markerId = "purpleArrowhead"; // Push
    if (color === '#FFDE00') markerId = "yellowArrowhead"; // Friction

    return (
      <g className="force-arrow">
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color}
          strokeWidth="2.5"
          markerEnd={`url(#${markerId})`}
        />
        {/* Helper line to label if needed? No, just place label */}
        <text
          x={x2 + labelOffset.x}
          y={y2 + labelOffset.y}
          fill={color}
          fontSize={fontSize}
          fontWeight="bold"
          textAnchor="middle"
        >
          {label}
        </text>
      </g>
    );
  };

  return (
    <div className="p-4 md:p-6 bg-white border-b border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Free Body Diagram
        </h2>

        {/* Zoom Control */}
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
          <span className="text-sm font-bold text-gray-500">Zoom</span>
          <button
            onClick={() => setZoom(Math.max(0.6, zoom - 0.1))}
            className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-50 font-bold"
          >
            -
          </button>
          <span className="w-12 text-center text-sm font-mono">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(2.0, zoom + 0.1))}
            className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-50 font-bold"
          >
            +
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg border-2 border-gray-300 p-4 flex items-center justify-center overflow-auto relative">
        <svg
          width={width}
          height={height}
          viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
          className="max-w-full h-auto"
          style={{ minHeight: '450px' }}
        >
          {/* Local / Incline Axis Legend (Top Left) */}
          <g transform={`translate(${viewBoxX + 70}, ${viewBoxY + 70})`}>
            {/* Expanded box for better visibility */}
            <rect x="-50" y="-55" width="100" height="110" rx="10" fill="rgba(255,255,255,0.95)" stroke="#ccc" strokeWidth="1" />

            {/* Title moved up */}
            <text x="0" y="-35" textAnchor="middle" fontSize="11" fill="#666" fontWeight="bold" style={{ letterSpacing: '1px' }}>LOCAL</text>

            {/* Axis moved down slightly */}
            <g transform={`translate(0, 10) rotate(${-angle})`}>
              <line x1="0" y1="25" x2="0" y2="-25" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <text x="0" y="-32" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#333">y'</text>
              <line x1="-25" y1="0" x2="25" y2="0" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <text x="35" y="4" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#333">x'</text>
            </g>
          </g>

          {/* Global Axis Legend */}
          <g transform={`translate(${viewBoxX + viewBoxWidth - 70}, ${viewBoxY + 70})`}>
            <rect x="-50" y="-55" width="100" height="110" rx="10" fill="rgba(255,255,255,0.95)" stroke="#ccc" strokeWidth="1" />

            <text x="0" y="-35" textAnchor="middle" fontSize="11" fill="#666" fontWeight="bold" style={{ letterSpacing: '1px' }}>GLOBAL</text>

            <g transform={`translate(0, 10)`}>
              <line x1="0" y1="25" x2="0" y2="-25" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <text x="0" y="-32" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#333">Y</text>
              <line x1="-25" y1="0" x2="25" y2="0" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <text x="35" y="4" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#333">X</text>
            </g>
          </g>

          {/* Definitions for markers */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
            </marker>
            <marker id="redArrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#d00000" />
            </marker>
            <marker id="pinkArrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#FF6E6C" />
            </marker>
            <marker id="purpleArrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#9C27B0" />
            </marker>
            <marker id="yellowArrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#FFDE00" />
            </marker>
          </defs>

          {/* Ground */}
          <line
            x1={centerX - 280}
            y1={centerY}
            x2={inclineEndX + 60}
            y2={centerY}
            stroke="#666"
            strokeWidth="3"
          />

          {/* Incline */}
          <line
            x1={centerX}
            y1={centerY}
            x2={inclineEndX}
            y2={inclineEndY}
            stroke="#383838"
            strokeWidth="5"
          />

          {/* Angle arc */}
          {angle > 0 && (
            <>
              <path
                d={`M ${centerX + 60} ${centerY} A 60 60 0 0 0 ${centerX + 60 * Math.cos(angleRad)} ${centerY - 60 * Math.sin(angleRad)}`}
                fill="none"
                stroke="#007AFF"
                strokeWidth="3"
              />
              <text
                x={centerX + 80}
                y={centerY + 20}
                fill="#007AFF"
                fontSize="18"
                fontWeight="bold"
              >
                θ
              </text>
            </>
          )}

          {/* Block */}
          <rect
            x={blockX - blockSize / 2}
            y={blockY - blockSize / 2}
            width={blockSize}
            height={blockSize}
            fill="#FFD700"
            stroke="#383838"
            strokeWidth="3"
            transform={`rotate(${angle} ${blockX} ${blockY})`}
          />

          {/* Forces */}
          {showMass && (
            <>
              {/* Only show main vertical Mg if angle is 0 */}
              {angle === 0 && drawArrow(
                blockX,
                blockY,
                blockX,
                blockY + weight * forceScale,
                '#d00000',
                'Mg',
                { x: 20, y: 0 },
                18
              )}

              {/* Normal Force - Perpendicular to surface */}
              {(() => {
                const normalOrigin = getForceOrigin('center'); // Center is usually best for FBD
                // Vector: (-sin, -cos) * Mag
                const endX = normalOrigin.x - normalForce * forceScale * Math.sin(angleRad);
                const endY = normalOrigin.y - normalForce * forceScale * Math.cos(angleRad);

                return drawArrow(
                  normalOrigin.x,
                  normalOrigin.y,
                  endX,
                  endY,
                  '#d00000',
                  <tspan>R<tspan dy="5" fontSize="12">N</tspan></tspan>,
                  { x: -20, y: -20 },
                  18
                );
              })()}

              {/* Angle > 0: Show Components */}
              {angle > 0 && (
                <>
                  {/* Parallel Component (Mg sin) - Down Slope */}
                  {(() => {
                    const compMag = weight * Math.sin(angleRad);
                    // Down Slope vector: (-cos, sin)
                    const vecX = -Math.cos(angleRad);
                    const vecY = Math.sin(angleRad);

                    const startX = blockX;
                    const startY = blockY;
                    const endX = startX + vecX * compMag * forceScale;
                    const endY = startY + vecY * compMag * forceScale;

                    return drawArrow(
                      startX,
                      startY,
                      endX,
                      endY,
                      '#d00000',
                      'Mg sinθ',
                      { x: -10, y: 25 },
                      14
                    );
                  })()}

                  {/* Perpendicular Component (Mg cos) - Into Slope */}
                  {(() => {
                    const compMag = weight * Math.cos(angleRad);
                    // Into Slope vector: (sin, cos)
                    const vecX = Math.sin(angleRad);
                    const vecY = Math.cos(angleRad);

                    const startX = blockX;
                    const startY = blockY;
                    const endX = startX + vecX * compMag * forceScale;
                    const endY = startY + vecY * compMag * forceScale;

                    return drawArrow(
                      startX,
                      startY,
                      endX,
                      endY,
                      '#d00000',
                      'Mg cosθ',
                      { x: 30, y: 15 },
                      14
                    );
                  })()}
                </>
              )}
            </>
          )}

          {/* Tension */}
          {showTension && tension > 0 && (() => {
            const tensionOrigin = getForceOrigin('right');
            // Up Slope: (cos, -sin)
            const endX = tensionOrigin.x + tension * forceScale * Math.cos(angleRad);
            const endY = tensionOrigin.y - tension * forceScale * Math.sin(angleRad);

            return drawArrow(
              tensionOrigin.x,
              tensionOrigin.y,
              endX,
              endY,
              '#FF6E6C',
              <tspan>F<tspan dy="5" fontSize="10">1</tspan></tspan>,
              { x: 0, y: -20 },
              16
            );
          })()}

          {/* Pulley System (Ch 6.1) */}
          {simulation.scenario === 'pulley' && (() => {
            const pulleyRadius = 20;
            const pulleyX = inclineEndX;
            const pulleyY = inclineEndY - pulleyRadius / 2;
            const blockRightX = blockX + (blockSize / 2) * Math.cos(angleRad);
            const blockRightY = blockY - (blockSize / 2) * Math.sin(angleRad);
            const stringDropLength = 80;
            const hangingMassX = pulleyX + pulleyRadius;
            const hangingMassY = pulleyY + stringDropLength;
            const hangingMassSize = 30;

            return (
              <g>
                <line x1={blockRightX} y1={blockRightY} x2={pulleyX} y2={pulleyY} stroke="#333" strokeWidth="2" />
                <circle cx={pulleyX} cy={pulleyY} r={pulleyRadius} fill="#888" stroke="#333" strokeWidth="2" />
                <line x1={pulleyX + pulleyRadius} y1={pulleyY} x2={hangingMassX} y2={hangingMassY} stroke="#333" strokeWidth="2" />
                <rect
                  x={hangingMassX - hangingMassSize / 2}
                  y={hangingMassY}
                  width={hangingMassSize}
                  height={hangingMassSize}
                  fill="#FF6E6C"
                  stroke="#333"
                  strokeWidth="2"
                />
                <text x={hangingMassX + 25} y={hangingMassY + 15} fontSize="14" fill="#666" fontWeight="bold">m<tspan dy="5" fontSize="10">a</tspan></text>
              </g>
            );
          })()}

          {/* Push (Ch 5.3) */}
          {(showPush || simulation.scenario === 'external_force') && push > 0 && (() => {
            // @ts-ignore
            const pAngle = (forces as any).pushAngleRad || 0;
            const totalAngle = angleRad + pAngle;
            const startX = blockX;
            const startY = blockY;
            const vecLen = push * forceScale;
            const endX = startX + vecLen * Math.cos(totalAngle);
            const endY = startY - vecLen * Math.sin(totalAngle);

            return drawArrow(
              startX,
              startY,
              endX,
              endY,
              '#9C27B0',
              <tspan>F<tspan dy="5" fontSize="10">2</tspan></tspan>,
              { x: 0, y: -20 },
              16
            );
          })()}

          {/* Friction */}
          {motionDirection !== 'none' && friction > 0 && (() => {
            const isUpMotion = motionDirection === 'up';
            // Friction opposes motion. Up Motion -> Friction Down Slope (-cos, sin)
            // Down Motion -> Friction Up Slope (cos, -sin)

            // Offset to avoid overlap
            const offset = 22;
            // If Up Motion (Friction Down), put on bottom/left side?
            // Actually, usually drawn at contact surface.



            // Let's stick to center-ish but offset perpendicular
            // Center + Offset * (-Normal) = Center + Offset * (sin, cos)
            const frictionOriginX = blockX + offset * Math.sin(angleRad);
            const frictionOriginY = blockY + offset * Math.cos(angleRad);

            const dirSign = isUpMotion ? -1 : 1; // -1 for Down Slope, 1 for Up Slope
            const vecX = dirSign * Math.cos(angleRad);
            const vecY = dirSign * -Math.sin(angleRad);

            const startX = frictionOriginX;
            const startY = frictionOriginY;
            const endX = startX + vecX * friction * forceScale;
            const endY = startY + vecY * friction * forceScale;

            return drawArrow(
              startX,
              startY,
              endX,
              endY,
              '#FFDE00',
              <tspan>F<tspan dy="5" fontSize="12">f</tspan></tspan>,
              { x: 0, y: 25 }, // Below axis
              16
            );
          })()}

        </svg>
      </div>
    </div>
  );
};

export default Visualization;
