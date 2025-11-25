import { useState } from 'react';
import type { WordEntry } from '../App';

interface CustomWordInputProps {
    initialWords: WordEntry[];
    onSubmit: (words: WordEntry[]) => void;
    onCancel: () => void;
}

export function CustomWordInput({
    initialWords,
    onSubmit,
    onCancel,
}: CustomWordInputProps) {
    const [inputText, setInputText] = useState(() => {
        return initialWords
            .map((entry) => `${entry.word}:${entry.hint}`)
            .join('\n');
    });
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = () => {
        setError(null);

        const lines = inputText
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

        if (lines.length === 0) {
            setError('Please enter at least one word and hint.');
            return;
        }

        const parsedWords: WordEntry[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const parts = line.split(':');

            if (parts.length !== 2) {
                setError(`Line ${i + 1}: Invalid format. Use: WORD|Hint text`);
                return;
            }

            const word = parts[0].trim().toUpperCase();
            const hint = parts[1].trim();

            if (word.length === 0) {
                setError(`Line ${i + 1}: Word cannot be empty.`);
                return;
            }

            if (!/^[A-Z]+$/.test(word)) {
                setError(
                    `Line ${
                        i + 1
                    }: Word must contain only letters (no spaces or special characters).`
                );
                return;
            }

            if (hint.length === 0) {
                setError(`Line ${i + 1}: Hint cannot be empty.`);
                return;
            }

            parsedWords.push({ word, hint });
        }

        onSubmit(parsedWords);
    };

    const addExample = () => {
        const examples = [
            'OCEAN:Large body of salt water',
            'MOUNTAIN:Tall natural elevation of the earth',
            'RAINBOW:Colorful arc in the sky after rain',
        ];
        setInputText((prev) => {
            const newText = prev.trim()
                ? `${prev}\n${examples.join('\n')}`
                : examples.join('\n');
            return newText;
        });
    };

    return (
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-blue-900 mb-6">Customize Word List</h2>

            <div className="mb-4">
                <p className="text-gray-700 mb-2">
                    Enter one word and hint per line, separated by a colon
                    character (:).
                </p>
                <p className="text-gray-600 mb-4">
                    Format:{' '}
                    <code className="bg-gray-100 px-2 py-1 rounded">
                        WORD:Hint text
                    </code>
                </p>

                <button
                    onClick={addExample}
                    className="mb-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                    Add Example Words
                </button>
            </div>

            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-96 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                placeholder="JAVASCRIPT:A popular programming language&#10;TYPESCRIPT:JavaScript with types&#10;REACT:A library for building user interfaces"
            />

            {error && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <div className="mt-6 flex gap-4 justify-end">
                <button
                    onClick={onCancel}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Save & Start Playing
                </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">
                    💡 <strong>Tip:</strong>
                    Each word should contain only letters (A-Z), no spaces or
                    other special characters other than the colon (:) to
                    separate the word from its hint. You can add as many words
                    as you like!
                </p>
            </div>
        </div>
    );
}
