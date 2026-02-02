import { Article } from '../types';

export const MOCK_ARTICLES: Article[] = [
    {
        id: '1',
        title: 'Daily Conversation',
        description: 'Basic daily life sentences.',
        sentences: [
            {
                id: 's1',
                raw: 'I have a (pen-笔)',
                segments: [
                    { id: 'w1', text: 'I', isBlank: false },
                    { id: 'w2', text: 'have', isBlank: false },
                    { id: 'w3', text: 'a', isBlank: false },
                    { id: 'w4', text: 'pen', isBlank: true, hint: '笔', answer: 'pen' },
                ],
            },
            {
                id: 's2',
                raw: 'This is an (apple-苹果)',
                segments: [
                    { id: 'w5', text: 'This', isBlank: false },
                    { id: 'w6', text: 'is', isBlank: false },
                    { id: 'w7', text: 'an', isBlank: false },
                    { id: 'w8', text: 'apple', isBlank: true, hint: '苹果', answer: 'apple' },
                ],
            },
            {
                id: 's3',
                raw: 'He likes (playing-玩) football',
                segments: [
                    { id: 'w9', text: 'He', isBlank: false },
                    { id: 'w10', text: 'likes', isBlank: false },
                    { id: 'w11', text: 'playing', isBlank: true, hint: '玩', answer: 'playing' },
                    { id: 'w12', text: 'football', isBlank: false },
                ],
            },
        ],
    },
    {
        id: '2',
        title: 'Travel Essentials',
        description: 'Useful phrases for traveling.',
        sentences: [
            {
                id: 's4',
                raw: 'Where is the (station-车站)?',
                segments: [
                    { id: 'w13', text: 'Where', isBlank: false },
                    { id: 'w14', text: 'is', isBlank: false },
                    { id: 'w15', text: 'the', isBlank: false },
                    { id: 'w16', text: 'station', isBlank: true, hint: '车站', answer: 'station' },
                    { id: 'w17', text: '?', isBlank: false },
                ]
            }
        ]
    }
];
