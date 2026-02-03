import { supabase } from '../utils/supabase';
import { Article, Sentence, WordSegment } from '../types';

export const fetchArticles = async (): Promise<Article[]> => {
    try {
        // Query 'Article' and join 'Sentence'
        // Using strict table names as provided by user: 'Article', 'Sentence'
        const { data, error } = await supabase
            .from('Article')
            .select(`
                *,
                Sentence (*)
            `);

        if (error) {
            console.error('Error fetching articles:', error);
            return [];
        }

        if (!data || data.length === 0) return [];

        return data.map((articleData: any) => {
            // Sort sentences if needed, or take as is. 
            // DB sentences might come in random order unless ordered.
            const dbSentences = articleData.Sentence || [];

            const parsedSentences: Sentence[] = dbSentences.map((s: any) =>
                parseRawSentence({
                    id: s.id,
                    raw: s.content // Map DB 'content' to our 'raw'
                })
            );

            return {
                id: articleData.id.toString(),
                title: articleData.title,
                description: articleData.title, // Schema doesn't have description, use title or empty
                createdAt: articleData.createdAt,
                sentences: parsedSentences,
            };
        });

    } catch (e) {
        console.error('Unexpected error fetching articles:', e);
        return [];
    }
};

const parseRawSentence = (item: { id: any, raw: string }): Sentence => {
    // raw content example: "I have a (pen-笔)"

    const segments: WordSegment[] = [];
    const regex = /\(([^)]+)\)/g;
    let lastIndex = 0;
    let match;
    const raw = item.raw || '';

    if (!raw) {
        return {
            id: String(item.id),
            raw: 'Error: No content',
            segments: []
        };
    }

    while ((match = regex.exec(raw)) !== null) {
        // Text before the match
        const textBefore = raw.substring(lastIndex, match.index);
        if (textBefore.trim()) {
            textBefore.trim().split(/\s+/).forEach((word: string, idx: number) => {
                segments.push({
                    id: `${item.id}-pre-${lastIndex}-${idx}`,
                    text: word,
                    isBlank: false
                });
            });
        }

        // The blank part: (pen-笔)
        const content = match[1];

        let answer = content;
        let hint = '?';

        // Use lastIndexOf to support hyphens in the answer part (e.g. self-esteem-自尊)
        const separatorIdx = content.lastIndexOf('-');
        if (separatorIdx !== -1) {
            answer = content.substring(0, separatorIdx).trim();
            // If the hint format is strictly expected, we take the rest. 
            // If hint is missing, we might want to handle that, but typically it follows the dash.
            const possibleHint = content.substring(separatorIdx + 1).trim();
            if (possibleHint) {
                hint = possibleHint;
            }
        }

        segments.push({
            id: `${item.id}-blank-${match.index}`,
            text: answer,
            isBlank: true,
            answer: answer,
            hint: hint
        });

        lastIndex = regex.lastIndex;
    }

    // Text after the last match
    if (lastIndex < raw.length) {
        const textAfter = raw.substring(lastIndex);
        if (textAfter.trim()) {
            textAfter.trim().split(/\s+/).forEach((word: string, idx: number) => {
                segments.push({
                    id: `${item.id}-post-${lastIndex}-${idx}`,
                    text: word,
                    isBlank: false
                });
            });
        }
    }

    return {
        id: String(item.id),
        raw: raw,
        segments: segments
    };
};
