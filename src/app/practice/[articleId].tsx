import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Layout, Text, Button, Input, Card, Icon, IconElement, Spinner } from '@ui-kitten/components';
import { Article } from '../../types';
import * as Speech from 'expo-speech';


// Icons


const VolumeIcon = (props: any): IconElement => (
    <Icon {...props} name='volume-up-outline' />
);

const ArrowBackIcon = (props: any): IconElement => (
    <Icon {...props} name='arrow-back-outline' />
);

const ArrowForwardIcon = (props: any): IconElement => (
    <Icon {...props} name='arrow-forward-outline' />
);

const CheckmarkIcon = (props: any): IconElement => (
    <Icon {...props} name='checkmark-circle-2-outline' />
);

export default function PracticePage() {
    const { articleId, articleData } = useLocalSearchParams<{ articleId: string, articleData: string }>();
    const router = useRouter();

    const [article, setArticle] = useState<Article | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

    useEffect(() => {
        if (articleData) {
            try {
                const parsedArticle = JSON.parse(articleData);
                setArticle(parsedArticle);
            } catch (e) {
                console.error("Failed to parse article data", e);
                // Fallback or error handling
            }
        }
        // If we implement 'fetch by ID' later, we would add else block here.
    }, [articleData, articleId]);

    if (!article) {
        return (
            <Layout style={styles.container} level='1'>
                <View style={styles.centerContent}>
                    <Text category='h5' status='danger'>Article not found</Text>
                    <Button style={styles.marginTop} onPress={() => router.back()}>Go Back</Button>
                </View>
            </Layout>
        );
    }

    const currentSentence = article.sentences[currentIndex];

    // Helpers
    const handleNext = () => {
        if (currentIndex < article.sentences.length - 1) {
            setCurrentIndex(prev => prev + 1);
            resetState();
        } else {
            // Show completion modal or alert
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
        setUserAnswers({});
        setFeedback('none');
    };





    const playSound = () => {
        // Construct the clean sentence to speak
        // Filter out the hint part from blanks. 
        // Logic: if isBlank, use the answer. If not, use text.
        const textToSpeak = currentSentence.segments.map(s => {
            if (s.isBlank) return s.answer;
            return s.text;
        }).join(' ');

        console.log(`Playing audio for: ${textToSpeak}`);
        Speech.speak(textToSpeak, { language: 'en' });
    };

    // Derived UI states
    const inputStatus = feedback === 'correct' ? 'success' : feedback === 'wrong' ? 'danger' : 'basic';
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === article.sentences.length - 1;

    return (
        <Layout style={styles.container} level='1'>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* Header Info */}
                    <View style={styles.header}>
                        <Text category='s1' appearance='hint'>
                            Sentence {currentIndex + 1} / {article.sentences.length}
                        </Text>

                        <Button
                            accessoryLeft={VolumeIcon}
                            size='small'
                            appearance='ghost'
                            status='primary'
                            onPress={playSound}
                        >
                            Play Audio
                        </Button>
                    </View>

                    {/* Sentence Layout */}
                    <Card style={styles.card} status='primary'>
                        <View style={styles.sentenceContainer}>
                            {currentSentence.segments.map((seg, idx) => (
                                <View key={seg.id} style={styles.segmentWrapper}>
                                    {seg.isBlank ? (
                                        <View style={styles.inputWrapper}>
                                            {feedback === 'correct' ? (
                                                <Text status='success' category='h5' style={styles.answerText}>
                                                    {seg.answer}
                                                </Text>
                                            ) : (
                                                <Input
                                                    style={styles.input}
                                                    status={inputStatus}
                                                    placeholder={seg.hint}
                                                    value={userAnswers[seg.id] || ''}
                                                    onChangeText={text => {
                                                        const newAnswers = { ...userAnswers, [seg.id]: text };
                                                        setUserAnswers(newAnswers);

                                                        // Real-time validation for ALL blanks
                                                        const blankSegments = currentSentence.segments.filter(s => s.isBlank);
                                                        const allCorrect = blankSegments.every(s => {
                                                            const ans = newAnswers[s.id] || '';
                                                            return s.answer && ans.trim().toLowerCase() === s.answer.toLowerCase();
                                                        });

                                                        if (allCorrect) {
                                                            setFeedback('correct');
                                                            // Optional: Dismiss keyboard on success?
                                                            // Keyboard.dismiss();
                                                        } else {
                                                            if (feedback !== 'none') setFeedback('none');
                                                        }
                                                    }}
                                                    autoCapitalize='none'
                                                    autoCorrect={false}
                                                    textStyle={styles.inputText}
                                                />
                                            )}
                                            {feedback === 'wrong' && (
                                                <Text status='danger' category='c1' style={styles.hintText}>
                                                    Try again!
                                                </Text>
                                            )}
                                            {/* Hint moved to placeholder */}
                                        </View>
                                    ) : (
                                        <Text category='h5' style={styles.staticText}>{seg.text}</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    </Card>

                    {/* Feedback & Actions */}
                    <View style={styles.actionsContainer}>
                        {feedback === 'correct' && (
                            <Layout level='2' style={styles.successBanner}>
                                <Icon style={styles.icon} fill='#3366FF' name='star' />
                                <Text status='primary' category='h6'>Correct! Well done.</Text>
                            </Layout>
                        )}

                        {feedback === 'correct' && (
                            <Button
                                style={styles.mainButton}
                                size='giant'
                                status='success'
                                accessoryRight={ArrowForwardIcon}
                                onPress={handleNext}
                            >
                                Next Sentence
                            </Button>
                        )}

                        <View style={styles.navButtons}>
                            <Button
                                appearance='ghost'
                                status='basic'
                                accessoryLeft={ArrowBackIcon}
                                disabled={isFirst}
                                onPress={handlePrev}
                            >
                                Prev
                            </Button>
                            <Button
                                appearance='ghost'
                                status='basic'
                                accessoryRight={ArrowForwardIcon}
                                disabled={isLast}
                                onPress={handleNext}
                            >
                                Skip
                            </Button>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    card: {
        marginBottom: 32,
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sentenceContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    segmentWrapper: {
        marginHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    inputWrapper: {
        minWidth: 100,
        alignItems: 'center',
    },
    input: {
        minWidth: 120,
        textAlign: 'center',
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: '#8F9BB3',
        ...Platform.select({
            web: {
                outlineStyle: 'none',
            } as any,
        }),
    },
    inputText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    answerText: {
        textDecorationLine: 'underline',
        marginBottom: 8,
    },
    staticText: {
        lineHeight: 40,
        marginBottom: 8,
    },
    hintText: {
        marginTop: 4,
    },
    marginTop: {
        marginTop: 16,
    },
    actionsContainer: {
        marginTop: 8,
    },
    successBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        gap: 8,
    },
    mainButton: {
        marginBottom: 24,
    },
    navButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    icon: {
        width: 32,
        height: 32,
    },
});
