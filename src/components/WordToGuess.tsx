interface WordToGuessProps {
  word: string;
  guessedLetters: Set<string>;
  reveal?: boolean;
}

export function WordToGuess({ word, guessedLetters, reveal = false }: WordToGuessProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-4">
      {word.split('').map((letter, index) => {
        const isGuessed = guessedLetters.has(letter);
        const shouldShow = isGuessed || reveal;

        return (
          <div
            key={index}
            className="w-12 h-16 border-b-4 border-blue-600 flex items-center justify-center"
          >
            <span
              className={`text-3xl uppercase transition-all duration-300 ${
                shouldShow ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              } ${reveal && !isGuessed ? 'text-red-500' : 'text-blue-900'}`}
            >
              {shouldShow ? letter : ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}
