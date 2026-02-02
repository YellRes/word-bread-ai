import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MOCK_ARTICLES } from '../../constants/mockData';
import { Article, Sentence, WordSegment } from '../../types';

export default function PracticePage() {
    const { articleId } = useLocalSearchParams<{ articleId: string }>();
    const router = useRouter();

    const [article, setArticle] = useState<Article | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

    useEffect(() => {
        const found = MOCK_ARTICLES.find(a => a.id === articleId);
        if (found) {
            setArticle(found);
        }
    }, [articleId]);

    if (!article) {
        return <View className="flex-1 justify-center items-center"><Text>Article not found</Text></View>;
    }

    const currentSentence = article.sentences[currentIndex];

    const handleNext = () => {
        if (currentIndex < article.sentences.length - 1) {
            setCurrentIndex(prev => prev + 1);
            resetState();
        } else {
            Alert.alert("Completed", "You finished this article!", [
                { text: "Back to List", onPress: () => router.back() }
            ]);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            resetState();
        }
    };

    const resetState = () => {
        setUserAnswer('');
        setFeedback('none');
    };

    const handleSubmit = () => {
        if (feedback === 'correct') {
            handleNext();
            return;
        }

        const blankSegment = currentSentence.segments.find(s => s.isBlank);
        if (!blankSegment || !blankSegment.answer) return;

        const isCorrect = userAnswer.trim().toLowerCase() === blankSegment.answer.toLowerCase();

        if (isCorrect) {
            setFeedback('correct');
            // Auto advance or wait for user? User said "Submit ... if correct enter next".
            // I'll add a small delay or let user click "Next" which now says "Continue"?
            // "提交正确则进入下一个句子" -> implies automatic or immediate transition logic.
            // But usually feedback is good. I'll auto-advance after 1s or show a "Correct! Next" button state.
            // Let's manually advance to ensure they see the green state.
        } else {
            setFeedback('wrong');
        }
    };

    const playSound = () => {
        // Simulated TTS
        console.log(`Playing audio for: ${currentSentence.raw}`);
        Alert.alert("Audio", `Playing: "${currentSentence.raw}"`);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <ScrollView contentContainerClassName="p-6 flex-grow justify-center">
                {/* Progress Header */}
                <View className="mb-8 flex-row justify-between items-center">
                    <Text className="text-gray-500 font-medium">
                        Sentence {currentIndex + 1} / {article.sentences.length}
                    </Text>
                    <Pressable onPress={playSound} className="p-2 bg-blue-100 rounded-full">
                        <Text className="text-xl">🔊</Text>
                    </Pressable>
                </View>

                {/* Sentence Display */}
                <View className="flex-row flex-wrap items-center justify-center mb-10">
                    {currentSentence.segments.map((seg, idx) => (
                        <React.Fragment key={seg.id}>
                            {seg.isBlank ? (
                                <View className="mx-1 items-center">
                                    <View className="flex-row items-center">
                                        {/* Input or Result */}
                                        {feedback === 'correct' ? (
                                            <Text className="text-2xl font-bold text-green-600 border-b-2 border-green-600 px-2">
                                                {seg.answer}
                                            </Text>
                                        ) : feedback === 'wrong' ? (
                                            <View className="flex-col items-center">
                                                <Text className="text-xl text-red-500 line-through mb-1">{userAnswer}</Text>
                                                <Text className="text-2xl font-bold text-green-600">{seg.answer}</Text>
                                            </View>
                                        ) : (
                                            <TextInput
                                                className="border-b-2 border-gray-400 text-2xl px-2 min-w-[80px] text-center text-slate-800"
                                                placeholder="____"
                                                value={userAnswer}
                                                onChangeText={setUserAnswer}
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                            />
                                        )}

                                        {/* Hint Display */}
                                        {seg.hint && (
                                            <Text className="text-sm text-gray-500 ml-1">({seg.hint})</Text>
                                        )}
                                    </View>
                                </View>
                            ) : (
                                <Text className="text-2xl text-slate-800 mx-1">{seg.text}</Text>
                            )}
                        </React.Fragment>
                    ))}
                </View>

                {/* Feedback Message */}
                {feedback === 'wrong' && (
                    <Text className="text-red-500 text-center mb-4 font-bold text-lg">Incorrect. Try to remember!</Text>
                )}
                {feedback === 'correct' && (
                    <Text className="text-green-600 text-center mb-4 font-bold text-lg">Correct! Well done.</Text>
                )}

                {/* Controls */}
                <View className="mt-8">
                    {feedback === 'correct' ? (
                        <Pressable
                            onPress={handleNext}
                            className="bg-green-500 p-4 rounded-xl items-center shadow-md"
                        >
                            <Text className="text-white text-lg font-bold">Next Sentence →</Text>
                        </Pressable>
                    ) : (
                        <Pressable
                            onPress={handleSubmit}
                            className={`p-4 rounded-xl items-center shadow-md ${userAnswer.length > 0 ? 'bg-blue-600' : 'bg-gray-300'}`}
                            disabled={userAnswer.length === 0}
                        >
                            <Text className="text-white text-lg font-bold">Submit</Text>
                        </Pressable>
                    )}

                    <View className="flex-row justify-between mt-6">
                        <Pressable
                            onPress={handlePrev}
                            className={`p-3 rounded-lg ${currentIndex === 0 ? 'opacity-30' : 'bg-gray-200'}`}
                            disabled={currentIndex === 0}
                        >
                            <Text className="font-semibold text-gray-600">← Prev</Text>
                        </Pressable>

                        <Pressable
                            onPress={handleNext}
                            className={`p-3 rounded-lg ${currentIndex === article.sentences.length - 1 ? 'opacity-30' : 'bg-gray-200'}`}
                            disabled={currentIndex === article.sentences.length - 1}
                        >
                            <Text className="font-semibold text-gray-600">Skip →</Text>
                        </Pressable>
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
