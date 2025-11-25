interface KeyboardProps {
  guessedLetters: Set<string>;
  correctLetters: Set<string>;
  onLetterClick: (letter: string) => void;
  disabled: boolean;
}

const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export function Keyboard({ guessedLetters, correctLetters, onLetterClick, disabled }: KeyboardProps) {
  const getKeyStatus = (letter: string): 'unused' | 'correct' | 'incorrect' => {
    if (!guessedLetters.has(letter)) return 'unused';
    return correctLetters.has(letter) ? 'correct' : 'incorrect';
  };

  const getKeyClassName = (status: string, isDisabled: boolean): string => {
    const baseClasses = 'px-4 py-3 rounded-lg transition-all duration-200 min-w-[2.5rem]';
    
    if (isDisabled) {
      if (status === 'correct') {
        return `${baseClasses} bg-green-500 text-white cursor-not-allowed`;
      }
      if (status === 'incorrect') {
        return `${baseClasses} bg-red-500 text-white cursor-not-allowed`;
      }
      return `${baseClasses} bg-gray-300 text-gray-500 cursor-not-allowed`;
    }

    if (status === 'correct') {
      return `${baseClasses} bg-green-500 text-white cursor-not-allowed`;
    }
    if (status === 'incorrect') {
      return `${baseClasses} bg-red-500 text-white cursor-not-allowed`;
    }
    return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 active:scale-95 cursor-pointer`;
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {row.map((letter) => {
            const status = getKeyStatus(letter);
            const isLetterDisabled = disabled || status !== 'unused';

            return (
              <button
                key={letter}
                onClick={() => onLetterClick(letter)}
                disabled={isLetterDisabled}
                className={getKeyClassName(status, isLetterDisabled)}
              >
                {letter}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
