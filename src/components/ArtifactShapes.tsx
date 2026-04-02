import type { ArtifactShape } from '../types';

interface Props {
  shape: ArtifactShape;
  className?: string;
}

export default function ArtifactShapeSVG({ shape, className }: Props) {
  const common = {
    className,
    viewBox: '0 0 120 120',
    xmlns: 'http://www.w3.org/2000/svg',
    style: { width: '100%', height: '100%' } as React.CSSProperties,
  };

  switch (shape) {
    case 'ceramic-shard':
      return (
        <svg {...common}>
          <path
            d="M20 30 Q35 15 60 20 Q85 25 95 45 Q100 65 90 85 Q75 100 50 95 Q25 90 15 70 Q10 50 20 30Z"
            fill="none"
            stroke="#8B6914"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.8"
          />
          <path
            d="M35 40 Q45 35 55 42 Q60 50 55 58"
            fill="none"
            stroke="#6B4423"
            strokeWidth="0.8"
            opacity="0.5"
          />
          <circle cx="70" cy="60" r="2" fill="#8B6914" opacity="0.4" />
          <circle cx="45" cy="70" r="1.5" fill="#8B6914" opacity="0.3" />
        </svg>
      );

    case 'fossil':
      return (
        <svg {...common}>
          <ellipse
            cx="60" cy="55" rx="40" ry="35"
            fill="none"
            stroke="#8B6914"
            strokeWidth="1.5"
            strokeDasharray="3 4"
            opacity="0.8"
          />
          <path
            d="M35 55 C40 45 50 40 60 42 C70 44 78 50 82 58"
            fill="none"
            stroke="#6B4423"
            strokeWidth="1"
            opacity="0.6"
          />
          <path
            d="M40 62 Q50 56 60 58 Q70 60 75 65"
            fill="none"
            stroke="#6B4423"
            strokeWidth="0.8"
            opacity="0.4"
          />
          <path
            d="M42 70 Q52 66 62 68 Q70 70 72 72"
            fill="none"
            stroke="#6B4423"
            strokeWidth="0.6"
            opacity="0.3"
          />
          {/* small spiral — ammonite hint */}
          <path
            d="M58 50 Q62 48 63 52 Q64 56 60 57 Q56 58 55 54 Q54 50 58 49"
            fill="none"
            stroke="#5C4033"
            strokeWidth="0.8"
            opacity="0.5"
          />
        </svg>
      );

    case 'tool-fragment':
      return (
        <svg {...common}>
          <path
            d="M30 90 L45 25 L55 20 L65 25 L70 40 L60 45 L55 90Z"
            fill="none"
            stroke="#8B6914"
            strokeWidth="1.5"
            strokeDasharray="5 3"
            opacity="0.8"
          />
          {/* flaking marks */}
          <path d="M48 35 L52 30" fill="none" stroke="#6B4423" strokeWidth="0.8" opacity="0.4" />
          <path d="M50 45 L55 40" fill="none" stroke="#6B4423" strokeWidth="0.8" opacity="0.4" />
          <path d="M47 55 L53 52" fill="none" stroke="#6B4423" strokeWidth="0.6" opacity="0.3" />
          {/* wear mark */}
          <ellipse cx="52" cy="70" rx="5" ry="8" fill="none" stroke="#5C4033" strokeWidth="0.5" opacity="0.3" />
        </svg>
      );

    case 'tablet':
      return (
        <svg {...common}>
          <rect
            x="20" y="20" width="80" height="80" rx="4"
            fill="none"
            stroke="#8B6914"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.8"
          />
          {/* inscription lines */}
          <line x1="30" y1="35" x2="90" y2="35" stroke="#6B4423" strokeWidth="0.6" opacity="0.4" />
          <line x1="30" y1="45" x2="85" y2="45" stroke="#6B4423" strokeWidth="0.6" opacity="0.4" />
          <line x1="30" y1="55" x2="88" y2="55" stroke="#6B4423" strokeWidth="0.6" opacity="0.4" />
          <line x1="30" y1="65" x2="75" y2="65" stroke="#6B4423" strokeWidth="0.6" opacity="0.35" />
          <line x1="30" y1="75" x2="80" y2="75" stroke="#6B4423" strokeWidth="0.6" opacity="0.3" />
          <line x1="30" y1="85" x2="60" y2="85" stroke="#6B4423" strokeWidth="0.6" opacity="0.25" />
          {/* crack */}
          <path
            d="M65 20 L70 40 L66 55 L72 80 L68 100"
            fill="none"
            stroke="#5C4033"
            strokeWidth="0.8"
            opacity="0.3"
          />
        </svg>
      );

    case 'vessel':
      return (
        <svg {...common}>
          <path
            d="M40 25 Q35 25 32 30 Q28 40 30 55 Q32 75 38 90 Q42 98 60 98 Q78 98 82 90 Q88 75 90 55 Q92 40 88 30 Q85 25 80 25"
            fill="none"
            stroke="#8B6914"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.8"
          />
          {/* rim */}
          <path
            d="M40 25 Q50 20 60 19 Q70 20 80 25"
            fill="none"
            stroke="#6B4423"
            strokeWidth="1"
            opacity="0.6"
          />
          {/* decorative band */}
          <path
            d="M32 50 Q46 47 60 48 Q74 49 88 50"
            fill="none"
            stroke="#6B4423"
            strokeWidth="0.6"
            opacity="0.4"
          />
          <path
            d="M33 55 Q47 52 60 53 Q73 54 87 55"
            fill="none"
            stroke="#6B4423"
            strokeWidth="0.6"
            opacity="0.3"
          />
          {/* missing chunk */}
          <path
            d="M75 60 Q82 58 85 65 Q83 72 78 70"
            fill="none"
            stroke="#5C4033"
            strokeWidth="0.8"
            strokeDasharray="2 2"
            opacity="0.4"
          />
        </svg>
      );

    case 'bone':
      return (
        <svg {...common}>
          <path
            d="M25 50 Q30 35 40 32 Q48 30 50 35 Q52 30 58 32 Q65 35 68 50 L72 70 Q75 85 70 90 Q65 95 60 88 Q58 95 52 92 Q45 88 48 80 Z"
            fill="none"
            stroke="#8B6914"
            strokeWidth="1.5"
            strokeDasharray="3 4"
            opacity="0.8"
          />
          {/* surface texture */}
          <path d="M45 45 Q50 42 55 45" fill="none" stroke="#6B4423" strokeWidth="0.6" opacity="0.3" />
          <path d="M42 55 Q48 52 54 55" fill="none" stroke="#6B4423" strokeWidth="0.5" opacity="0.25" />
          <circle cx="50" cy="65" r="1.5" fill="#6B4423" opacity="0.2" />
        </svg>
      );
  }
}
