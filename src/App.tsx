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

function getRandomRevealedLetters(word: string): Set<string> {
    const length = word.length;
    let lettersToReveal = 1;

    if (length >= 6 && length <= 9) lettersToReveal = 2;
    else if (length > 9) lettersToReveal = 3;

    const uniqueLetters = Array.from(new Set(word.split('')));
    const revealed = new Set<string>();

    while (revealed.size < Math.min(lettersToReveal, uniqueLetters.length)) {
        const randomLetter =
            uniqueLetters[Math.floor(Math.random() * uniqueLetters.length)];
        revealed.add(randomLetter);
    }

    return revealed;
}

function App() {
    const [customWords, setCustomWords] = useState<WordEntry[]>(DEFAULT_WORDS);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [guessedWords, setGuessedWords] = useState<Set<string>>(new Set());
    const [guessedLetters, setGuessedLetters] = useState<Set<string>>(
        new Set()
    );
    const [revealedLetters, setRevealedLetters] = useState<Set<string>>(
        new Set()
    );
    const [showCustomInput, setShowCustomInput] = useState(false);

    const maxIncorrectGuesses = 6;

    const currentEntry = useMemo(() => {
        return customWords[currentWordIndex] || DEFAULT_WORDS[0];
    }, [customWords, currentWordIndex]);

    const secretWord = currentEntry.word.toUpperCase();
    const hint = currentEntry.hint;

    const incorrectLetters = useMemo(() => {
        return Array.from(guessedLetters).filter(
            (letter) => !secretWord.includes(letter)
        );
    }, [guessedLetters, secretWord]);

    const incorrectGuesses = incorrectLetters.length;

    const isWinner = useMemo(() => {
        return secretWord
            .split('')
            .every(
                (letter) =>
                    guessedLetters.has(letter) || revealedLetters.has(letter)
            );
    }, [secretWord, guessedLetters, revealedLetters]);

    const isLoser = incorrectGuesses >= maxIncorrectGuesses;

    const gameStatus = isWinner ? 'Won' : isLoser ? 'Lost' : 'Playing';

    const addGuessedLetter = useCallback(
        (letter: string) => {
            if (gameStatus !== 'Playing') return;
            setGuessedLetters(
                (prev) => new Set([...prev, letter.toUpperCase()])
            );
        },
        [gameStatus]
    );

    const resetGame = useCallback(() => {
        setGuessedLetters(new Set());
        const randomIndex = Math.floor(Math.random() * customWords.length);
        setCurrentWordIndex(randomIndex);

        const word = customWords[randomIndex].word.toUpperCase();
        setRevealedLetters(getRandomRevealedLetters(word));
    }, [customWords]);

    const handleNextWord = useCallback(() => {
        if (guessedWords.size >= customWords.length) {
            alert('🎉 You have guessed all words! Play again?');
            // Reset everything
            setGuessedWords(new Set());
            setCurrentWordIndex(0);
            const firstWord = customWords[0].word.toUpperCase();
            setRevealedLetters(getRandomRevealedLetters(firstWord));
            setGuessedLetters(new Set());
            return;
        }

        let nextIndex = currentWordIndex;
        let attempts = 0;

        do {
            nextIndex = (nextIndex + 1) % customWords.length;
            attempts++;
        } while (
            guessedWords.has(customWords[nextIndex].word.toUpperCase()) &&
            attempts <= customWords.length
        );

        setCurrentWordIndex(nextIndex);
        const nextWord = customWords[nextIndex].word.toUpperCase();
        setRevealedLetters(getRandomRevealedLetters(nextWord));
        setGuessedLetters(new Set());
    }, [customWords, guessedWords, currentWordIndex]);

    const handleCustomWordsSubmit = useCallback((words: WordEntry[]) => {
        setCustomWords(words);
        setShowCustomInput(false);
        setGuessedLetters(new Set());
        setRevealedLetters(
            getRandomRevealedLetters(words[0].word.toUpperCase())
        );
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

    useEffect(() => {
        if (isWinner) {
            setGuessedWords((prev) => new Set(prev).add(secretWord));
        }
    }, [isWinner, secretWord]);

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
                    <h1 className="text-blue-900 mb-4">
                        Shaina's Hangman Game
                    </h1>
                    <button
                        onClick={() => setShowCustomInput(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Customize Words
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
                    <div className="mb-4 text-center w-full">
                        <div className="bg-blue-100 rounded-xl p-4 flex justify-center items-center">
                            <p className="text-[96px] font-bold text-blue-900 text-center leading-tight">
                                💡 Hint: {hint}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-8">
                        <HangmanDrawing incorrectGuesses={incorrectGuesses} />
                        <div className="flex-1 w-full">
                            <WordToGuess
                                word={secretWord}
                                guessedLetters={guessedLetters}
                                revealedLetters={revealedLetters}
                                reveal={isLoser}
                            />

                            {gameStatus !== 'Playing' && (
                                <div className="mt-6 text-center">
                                    <div
                                        className={`text-2xl mb-4 ${
                                            isWinner
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}
                                    >
                                        {isWinner
                                            ? '🎉 Nice Work!'
                                            : '💀 Game Over!'}
                                    </div>
                                    <button
                                        onClick={
                                            isWinner
                                                ? handleNextWord
                                                : resetGame
                                        }
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        {isWinner ? 'Next Word' : 'Play Again'}
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

                    <div className="mt-4 flex justify-center gap-4">
                        <button
                            onClick={handleNextWord}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Skip to Next Word
                        </button>
                    </div>

                    <div className="mt-6 text-center text-gray-600">
                        <p>
                            Incorrect Guesses: {incorrectGuesses} /{' '}
                            {maxIncorrectGuesses}
                        </p>
                    </div>
                </div>

                <div className="text-center text-gray-700">
                    <p>
                        Use your keyboard or click the letters below to guess!
                    </p>
                </div>
            </div>
        </div>
    );
}

export default App;
