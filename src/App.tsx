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

    const [revealedLetters, setRevealedLetters] = useState<Set<string>>(() => {
        const word = customWords[0].word.toUpperCase();
        return getRandomRevealedLetters(word);
    });

    const [showCustomInput, setShowCustomInput] = useState(false);
    const [showGameOverModal, setShowGameOverModal] = useState(false);

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
            if (guessedWords.size >= customWords.length) {
                setShowGameOverModal(true);
                return;
            }
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
            <div
                style={{
                    minHeight: '100vh',
                    background:
                        'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                }}
            >
                <CustomWordInput
                    initialWords={customWords}
                    onSubmit={handleCustomWordsSubmit}
                    onCancel={() => setShowCustomInput(false)}
                />
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                background:
                    'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
            }}
        >
            <div style={{ width: '100%', maxWidth: '64rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>
                        Shaina's Hangman Game
                    </h1>
                    <button
                        onClick={() => setShowCustomInput(true)}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#4f46e5',
                            color: '#fff',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            border: 'none',
                        }}
                    >
                        Customize Words
                    </button>
                </div>

                <div
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: '2rem',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
                        padding: '2rem',
                        marginBottom: '1.5rem',
                    }}
                >
                    <div
                        style={{
                            marginBottom: '0.5rem',
                            textAlign: 'center',
                            width: '100%',
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: '#bfdbfe',
                                borderRadius: '1rem',
                                padding: '1rem',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <p
                                style={{
                                    fontSize: '25px',
                                    fontWeight: '700',
                                    color: '#1e3a8a',
                                    lineHeight: '1',
                                    textAlign: 'center',
                                    margin: 0,
                                }}
                            >
                                💡 Hint: {hint}
                            </p>
                        </div>
                    </div>

                    <div
                        style={{
                            textAlign: 'center',
                            color: '#4b5563',
                        }}
                    >
                        <p>
                            Incorrect Guesses: {incorrectGuesses} /{' '}
                            {maxIncorrectGuesses}
                        </p>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '2rem',
                            marginBottom: '2rem',
                        }}
                    >
                        <HangmanDrawing incorrectGuesses={incorrectGuesses} />
                        <div style={{ flex: 1, width: '100%' }}>
                            <WordToGuess
                                word={secretWord}
                                guessedLetters={guessedLetters}
                                revealedLetters={revealedLetters}
                                reveal={isLoser}
                            />

                            {gameStatus !== 'Playing' && (
                                <div
                                    style={{
                                        marginTop: '1.5rem',
                                        textAlign: 'center',
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: '1.5rem',
                                            marginBottom: '1rem',
                                            color: isWinner
                                                ? '#16a34a'
                                                : '#dc2626',
                                        }}
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
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            backgroundColor: '#2563eb',
                                            color: '#fff',
                                            borderRadius: '0.5rem',
                                            cursor: 'pointer',
                                            border: 'none',
                                        }}
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

                    <div
                        style={{
                            marginTop: '1rem',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '1rem',
                        }}
                    >
                        <button
                            onClick={handleNextWord}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#2563eb',
                                color: '#fff',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                border: 'none',
                            }}
                        >
                            Skip to Next Word
                        </button>
                    </div>
                </div>
            </div>
            {showGameOverModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '1rem',
                            padding: '2rem',
                            textAlign: 'center',
                            minWidth: '300px',
                            maxWidth: '90%',
                        }}
                    >
                        <p
                            style={{
                                fontWeight: 'bold',
                                fontSize: '18px',
                                marginBottom: '1.5rem',
                            }}
                        >
                            🎉 You have guessed all words! What do you want to
                            do?
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '1rem',
                            }}
                        >
                            <button
                                onClick={() => {
                                    setShowCustomInput(true);
                                    setShowGameOverModal(false);
                                }}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#4f46e5',
                                    color: '#fff',
                                    borderRadius: '0.5rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                Customize New Words
                            </button>
                            <button
                                onClick={() => {
                                    setGuessedWords(new Set());
                                    resetGame();
                                    setShowGameOverModal(false);
                                }}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#2563eb',
                                    color: '#fff',
                                    borderRadius: '0.5rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                Play Again
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
