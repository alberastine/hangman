interface HangmanDrawingProps {
  incorrectGuesses: number;
}

export function HangmanDrawing({ incorrectGuesses }: HangmanDrawingProps) {
  const HEAD = incorrectGuesses > 0;
  const BODY = incorrectGuesses > 1;
  const LEFT_ARM = incorrectGuesses > 2;
  const RIGHT_ARM = incorrectGuesses > 3;
  const LEFT_LEG = incorrectGuesses > 4;
  const RIGHT_LEG = incorrectGuesses > 5;

  return (
    <div className="relative w-64 h-80 flex items-center justify-center">
      <svg width="250" height="300" className="hangman-svg">
        {/* Gallows base */}
        <line x1="20" y1="280" x2="180" y2="280" stroke="#4B5563" strokeWidth="4" />
        {/* Gallows vertical pole */}
        <line x1="80" y1="280" x2="80" y2="20" stroke="#4B5563" strokeWidth="4" />
        {/* Gallows horizontal pole */}
        <line x1="80" y1="20" x2="180" y2="20" stroke="#4B5563" strokeWidth="4" />
        {/* Gallows rope */}
        <line x1="180" y1="20" x2="180" y2="60" stroke="#4B5563" strokeWidth="3" />

        {/* Head */}
        {HEAD && (
          <circle 
            cx="180" 
            cy="80" 
            r="20" 
            stroke="#DC2626" 
            strokeWidth="3" 
            fill="none"
            className="animate-appear"
          />
        )}

        {/* Body */}
        {BODY && (
          <line 
            x1="180" 
            y1="100" 
            x2="180" 
            y2="160" 
            stroke="#DC2626" 
            strokeWidth="3"
            className="animate-appear"
          />
        )}

        {/* Left Arm */}
        {LEFT_ARM && (
          <line 
            x1="180" 
            y1="120" 
            x2="150" 
            y2="140" 
            stroke="#DC2626" 
            strokeWidth="3"
            className="animate-appear"
          />
        )}

        {/* Right Arm */}
        {RIGHT_ARM && (
          <line 
            x1="180" 
            y1="120" 
            x2="210" 
            y2="140" 
            stroke="#DC2626" 
            strokeWidth="3"
            className="animate-appear"
          />
        )}

        {/* Left Leg */}
        {LEFT_LEG && (
          <line 
            x1="180" 
            y1="160" 
            x2="160" 
            y2="200" 
            stroke="#DC2626" 
            strokeWidth="3"
            className="animate-appear"
          />
        )}

        {/* Right Leg */}
        {RIGHT_LEG && (
          <line 
            x1="180" 
            y1="160" 
            x2="200" 
            y2="200" 
            stroke="#DC2626" 
            strokeWidth="3"
            className="animate-appear"
          />
        )}
      </svg>

      <style>{`
        @keyframes appear {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-appear {
          animation: appear 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
