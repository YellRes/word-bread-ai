/// <reference types="nativewind/types" />

export interface WordSegment {
    id: string;
    text: string;
    isBlank: boolean;
    hint?: string; // The Chinese hint, e.g., "笔"
    answer?: string; // The correct English word, e.g., "pen"
}

export interface Sentence {
    id: string;
    segments: WordSegment[];
    raw: string; // "I have a (pen-笔)"
}

export interface Article {
    id: string;
    title: string;
    description: string;
    createdAt?: string;
    sentences: Sentence[];
}
