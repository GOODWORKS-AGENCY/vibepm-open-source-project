import { motion } from "framer-motion";

// Abstract geometric emblems inspired by ForwardPath's style
// Each emblem represents a VibePM concept with unique geometric shapes

const emblemAnimation = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" as const },
};

/** Neural constellation — represents brain dump / ideation */
export function EmblemNeural({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      {...emblemAnimation}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Central node */}
      <circle cx="100" cy="100" r="12" fill="currentColor" opacity="0.15" />
      <circle cx="100" cy="100" r="6" fill="currentColor" opacity="0.4" />
      
      {/* Orbiting nodes */}
      <circle cx="60" cy="55" r="8" fill="currentColor" opacity="0.12" />
      <circle cx="60" cy="55" r="4" fill="currentColor" opacity="0.3" />
      
      <circle cx="150" cy="60" r="10" fill="currentColor" opacity="0.1" />
      <circle cx="150" cy="60" r="5" fill="currentColor" opacity="0.25" />
      
      <circle cx="45" cy="130" r="7" fill="currentColor" opacity="0.12" />
      <circle cx="45" cy="130" r="3.5" fill="currentColor" opacity="0.3" />
      
      <circle cx="155" cy="140" r="9" fill="currentColor" opacity="0.1" />
      <circle cx="155" cy="140" r="4.5" fill="currentColor" opacity="0.28" />
      
      <circle cx="100" cy="170" r="6" fill="currentColor" opacity="0.12" />
      <circle cx="100" cy="170" r="3" fill="currentColor" opacity="0.3" />
      
      {/* Connection lines */}
      <line x1="100" y1="100" x2="60" y2="55" stroke="currentColor" strokeWidth="1" opacity="0.08" />
      <line x1="100" y1="100" x2="150" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.08" />
      <line x1="100" y1="100" x2="45" y2="130" stroke="currentColor" strokeWidth="1" opacity="0.08" />
      <line x1="100" y1="100" x2="155" y2="140" stroke="currentColor" strokeWidth="1" opacity="0.08" />
      <line x1="100" y1="100" x2="100" y2="170" stroke="currentColor" strokeWidth="1" opacity="0.08" />
      <line x1="60" y1="55" x2="150" y2="60" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
      <line x1="45" y1="130" x2="100" y2="170" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
      <line x1="155" y1="140" x2="100" y2="170" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
      
      {/* Outer ring */}
      <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="0.5" opacity="0.06" strokeDasharray="4 6" />
      <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="0.5" opacity="0.04" strokeDasharray="2 4" />
    </motion.svg>
  );
}

/** Honeycomb lattice — represents knowledge architecture */
export function EmblemLattice({ className = "" }: { className?: string }) {
  const hexPath = (cx: number, cy: number, r: number) => {
    const points = Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    });
    return `M${points.join("L")}Z`;
  };

  return (
    <motion.svg
      {...emblemAnimation}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Center hex */}
      <path d={hexPath(100, 100, 22)} fill="currentColor" opacity="0.12" />
      <path d={hexPath(100, 100, 14)} fill="currentColor" opacity="0.06" />
      
      {/* Ring 1 */}
      <path d={hexPath(100, 60, 18)} fill="currentColor" opacity="0.08" />
      <path d={hexPath(135, 80, 18)} fill="currentColor" opacity="0.08" />
      <path d={hexPath(135, 120, 18)} fill="currentColor" opacity="0.10" />
      <path d={hexPath(100, 140, 18)} fill="currentColor" opacity="0.08" />
      <path d={hexPath(65, 120, 18)} fill="currentColor" opacity="0.10" />
      <path d={hexPath(65, 80, 18)} fill="currentColor" opacity="0.08" />
      
      {/* Ring 2 — scattered */}
      <path d={hexPath(100, 28, 12)} fill="currentColor" opacity="0.05" />
      <path d={hexPath(160, 52, 12)} fill="currentColor" opacity="0.04" />
      <path d={hexPath(168, 100, 12)} fill="currentColor" opacity="0.05" />
      <path d={hexPath(160, 148, 12)} fill="currentColor" opacity="0.04" />
      <path d={hexPath(100, 172, 12)} fill="currentColor" opacity="0.05" />
      <path d={hexPath(40, 148, 12)} fill="currentColor" opacity="0.04" />
      <path d={hexPath(32, 100, 12)} fill="currentColor" opacity="0.05" />
      <path d={hexPath(40, 52, 12)} fill="currentColor" opacity="0.04" />
    </motion.svg>
  );
}

/** Pipeline flow — represents task seeding / pipeline */
export function EmblemPipeline({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      {...emblemAnimation}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Flow nodes */}
      <rect x="30" y="35" width="30" height="30" rx="8" fill="currentColor" opacity="0.12" />
      <rect x="85" y="35" width="30" height="30" rx="8" fill="currentColor" opacity="0.15" />
      <rect x="140" y="35" width="30" height="30" rx="8" fill="currentColor" opacity="0.10" />
      
      <rect x="30" y="85" width="30" height="30" rx="8" fill="currentColor" opacity="0.08" />
      <rect x="85" y="85" width="30" height="30" rx="8" fill="currentColor" opacity="0.20" />
      <rect x="140" y="85" width="30" height="30" rx="8" fill="currentColor" opacity="0.12" />
      
      <rect x="30" y="135" width="30" height="30" rx="8" fill="currentColor" opacity="0.10" />
      <rect x="85" y="135" width="30" height="30" rx="8" fill="currentColor" opacity="0.12" />
      <rect x="140" y="135" width="30" height="30" rx="8" fill="currentColor" opacity="0.18" />
      
      {/* Flow arrows */}
      <path d="M60 50 L85 50" stroke="currentColor" strokeWidth="1.5" opacity="0.1" markerEnd="url(#arrowhead)" />
      <path d="M115 50 L140 50" stroke="currentColor" strokeWidth="1.5" opacity="0.1" />
      <path d="M100 65 L100 85" stroke="currentColor" strokeWidth="1.5" opacity="0.1" />
      <path d="M115 100 L140 100" stroke="currentColor" strokeWidth="1.5" opacity="0.1" />
      <path d="M100 115 L100 135" stroke="currentColor" strokeWidth="1.5" opacity="0.1" />
      <path d="M45 65 L45 85" stroke="currentColor" strokeWidth="1" opacity="0.06" />
      <path d="M155 65 L155 85" stroke="currentColor" strokeWidth="1" opacity="0.06" />
      <path d="M155 115 L155 135" stroke="currentColor" strokeWidth="1" opacity="0.06" />
      
      {/* Accent dots on active nodes */}
      <circle cx="100" cy="100" r="4" fill="currentColor" opacity="0.3" />
      <circle cx="155" cy="150" r="3" fill="currentColor" opacity="0.25" />
      <circle cx="100" cy="50" r="3" fill="currentColor" opacity="0.2" />
    </motion.svg>
  );
}

/** Infinity loop — represents the autonomous agent cycle */
export function EmblemLoop({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      {...emblemAnimation}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Infinity / figure-8 path */}
      <path
        d="M100 100 C100 70, 140 50, 155 70 C170 90, 155 120, 140 120 C125 120, 100 100, 100 100 C100 100, 75 80, 60 80 C45 80, 30 90, 30 110 C30 130, 60 130, 75 120 C90 110, 100 100, 100 100Z"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.12"
        fill="none"
      />
      <path
        d="M100 100 C100 75, 135 55, 150 75 C165 95, 150 115, 135 115 C120 115, 100 100, 100 100 C100 100, 80 85, 65 85 C50 85, 38 95, 38 108 C38 125, 55 125, 70 115 C85 105, 100 100, 100 100Z"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.08"
        fill="currentColor"
        fillOpacity="0.03"
      />
      
      {/* Cycle nodes */}
      <circle cx="155" cy="72" r="6" fill="currentColor" opacity="0.15" />
      <circle cx="155" cy="72" r="3" fill="currentColor" opacity="0.3" />
      
      <circle cx="35" cy="108" r="6" fill="currentColor" opacity="0.15" />
      <circle cx="35" cy="108" r="3" fill="currentColor" opacity="0.3" />
      
      <circle cx="100" cy="100" r="8" fill="currentColor" opacity="0.1" />
      <circle cx="100" cy="100" r="4" fill="currentColor" opacity="0.25" />
      
      {/* Direction indicators */}
      <circle cx="130" cy="65" r="2" fill="currentColor" opacity="0.2" />
      <circle cx="68" cy="122" r="2" fill="currentColor" opacity="0.2" />
      
      {/* Outer glow ring */}
      <ellipse cx="100" cy="100" rx="80" ry="50" stroke="currentColor" strokeWidth="0.5" opacity="0.04" strokeDasharray="3 5" />
    </motion.svg>
  );
}

/** Radial burst — represents the spark / getting started */
export function EmblemSpark({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      {...emblemAnimation}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Center */}
      <circle cx="100" cy="100" r="16" fill="currentColor" opacity="0.12" />
      <circle cx="100" cy="100" r="8" fill="currentColor" opacity="0.25" />
      <circle cx="100" cy="100" r="3" fill="currentColor" opacity="0.4" />
      
      {/* Rays */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (Math.PI / 4) * i;
        const x1 = 100 + 24 * Math.cos(angle);
        const y1 = 100 + 24 * Math.sin(angle);
        const x2 = 100 + (50 + (i % 2) * 20) * Math.cos(angle);
        const y2 = 100 + (50 + (i % 2) * 20) * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth={i % 2 === 0 ? 2 : 1}
            opacity={i % 2 === 0 ? 0.12 : 0.06}
            strokeLinecap="round"
          />
        );
      })}
      
      {/* End dots */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (Math.PI / 4) * i;
        const r = 50 + (i % 2) * 20;
        const cx = 100 + r * Math.cos(angle);
        const cy = 100 + r * Math.sin(angle);
        return (
          <circle
            key={`dot-${i}`}
            cx={cx}
            cy={cy}
            r={i % 2 === 0 ? 4 : 2.5}
            fill="currentColor"
            opacity={0.1 + (i % 2) * 0.05}
          />
        );
      })}
      
      {/* Subtle ring */}
      <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="0.5" opacity="0.04" />
    </motion.svg>
  );
}
