import { useState, useEffect, useCallback, useMemo } from 'react';
import { HangmanDrawing } from './components/HangmanDrawing';
import { WordToGuess } from './components/WordToGuess';
import { Keyboard } from './components/Keyboard';
import { CustomWordInput } from './components/CustomWordInput';

export interface WordEntry {
  word: string;
  hint: string;
}

const DEFAULT_WORDS: WordEntry[] = [
  { word: 'JAVASCRIPT', hint: 'A popular programming language' },
  { word: 'TYPESCRIPT', hint: 'JavaScript with types' },
  { word: 'REACT', hint: 'A JavaScript library for building UIs' },
  { word: 'COMPONENT', hint: 'A reusable piece of UI' },
  { word: 'HANGMAN', hint: 'The game you are playing right now' },
];

function App() {
  const [customWords, setCustomWords] = useState<WordEntry[]>(DEFAULT_WORDS);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [showCustomInput, setShowCustomInput] = useState(false);

  const maxIncorrectGuesses = 6;

  const currentEntry = useMemo(() => {
    return customWords[currentWordIndex] || DEFAULT_WORDS[0];
  }, [customWords, currentWordIndex]);

  const secretWord = currentEntry.word.toUpperCase();
  const hint = currentEntry.hint;

  const incorrectLetters = useMemo(() => {
    return Array.from(guessedLetters).filter(letter => !secretWord.includes(letter));
  }, [guessedLetters, secretWord]);

  const incorrectGuesses = incorrectLetters.length;

  const isWinner = useMemo(() => {
    return secretWord.split('').every(letter => guessedLetters.has(letter));
  }, [secretWord, guessedLetters]);

  const isLoser = incorrectGuesses >= maxIncorrectGuesses;

  const gameStatus = isWinner ? 'Won' : isLoser ? 'Lost' : 'Playing';

  const addGuessedLetter = useCallback((letter: string) => {
    if (gameStatus !== 'Playing') return;
    setGuessedLetters(prev => new Set([...prev, letter.toUpperCase()]));
  }, [gameStatus]);

  const resetGame = useCallback(() => {
    setGuessedLetters(new Set());
    // Select a random word from the list
    const randomIndex = Math.floor(Math.random() * customWords.length);
    setCurrentWordIndex(randomIndex);
  }, [customWords]);

  const handleCustomWordsSubmit = useCallback((words: WordEntry[]) => {
    setCustomWords(words);
    setShowCustomInput(false);
    setGuessedLetters(new Set());
    setCurrentWordIndex(0);
  }, []);

  // Physical keyboard support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key.length === 1 && key >= 'A' && key <= 'Z') {
        addGuessedLetter(key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [addGuessedLetter]);

  if (showCustomInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <CustomWordInput
          initialWords={customWords}
          onSubmit={handleCustomWordsSubmit}
          onCancel={() => setShowCustomInput(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-blue-900 mb-4">Shaina's Hangman Game</h1>
          <button
            onClick={() => setShowCustomInput(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Customize Words
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="mb-6 text-center">
            <div className="inline-block px-4 py-2 bg-blue-100 rounded-lg">
              <p className="text-blue-900">💡 Hint: {hint}</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-8">
            <HangmanDrawing incorrectGuesses={incorrectGuesses} />
            <div className="flex-1 w-full">
              <WordToGuess word={secretWord} guessedLetters={guessedLetters} reveal={isLoser} />
              
              {gameStatus !== 'Playing' && (
                <div className="mt-6 text-center">
                  <div className={`text-2xl mb-4 ${isWinner ? 'text-green-600' : 'text-red-600'}`}>
                    {isWinner ? '🎉 You Won!' : '💀 Game Over!'}
                  </div>
                  <button
                    onClick={resetGame}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
          </div>

          <Keyboard
            guessedLetters={guessedLetters}
            correctLetters={new Set(secretWord.split(''))}
            onLetterClick={addGuessedLetter}
            disabled={gameStatus !== 'Playing'}
          />

          <div className="mt-6 text-center text-gray-600">
            <p>Incorrect Guesses: {incorrectGuesses} / {maxIncorrectGuesses}</p>
          </div>
        </div>

        <div className="text-center text-gray-700">
          <p>Use your keyboard or click the letters below to guess!</p>
        </div>
      </div>
    </div>
  );
}

export default App;
