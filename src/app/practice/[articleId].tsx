/**
 * Practice Page - Word Bread AI
 * AI Generated - Optimized UI based on Stitch design
 */
import {
  Button,
  Card,
  Icon,
  IconElement,
  Layout,
  Text,
} from "@ui-kitten/components";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import {
  BORDER_RADIUS,
  Colors,
  FONT_FAMILY,
  PRIMARY_COLOR,
  SPACING,
  SUCCESS_COLOR,
} from "../../constants/theme";
import { Article } from "../../types";

// Icons
const VolumeIcon = (props: any): IconElement => (
  <Icon {...props} name="volume-up-outline" />
);

const ArrowBackIcon = (props: any): IconElement => (
  <Icon {...props} name="arrow-back-outline" />
);

const ArrowForwardIcon = (props: any): IconElement => (
  <Icon {...props} name="arrow-forward-outline" />
);

const CheckmarkIcon = (props: any): IconElement => (
  <Icon {...props} name="checkmark-circle-2-outline" />
);

const BulbIcon = (props: any): IconElement => (
  <Icon {...props} name="bulb-outline" />
);

// Get current blank word for tip
const getBlankWord = (segments: any[]): string => {
  const blank = segments.find((s) => s.isBlank);
  return blank?.answer || "";
};

export default function PracticePage() {
  const { articleId, articleData } = useLocalSearchParams<{
    articleId: string;
    articleData: string;
  }>();
  const router = useRouter();

  const [article, setArticle] = useState<Article | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<"none" | "correct" | "wrong">(
    "none",
  );

  useEffect(() => {
    if (articleData) {
      try {
        const parsedArticle = JSON.parse(articleData);
        setArticle(parsedArticle);
      } catch (e) {
        console.error("Failed to parse article data", e);
      }
    }
  }, [articleData, articleId]);

  if (!article) {
    return (
      <Layout style={styles.container} level="1">
        <View style={styles.centerContent}>
          <Text category="h5" status="danger" style={styles.errorText}>
            Article not found
          </Text>
          <Button
            style={styles.backButton}
            onPress={() => router.back()}
            status="primary"
          >
            Go Back
          </Button>
        </View>
      </Layout>
    );
  }

  const currentSentence = article.sentences[currentIndex];
  const blankWord = getBlankWord(currentSentence.segments);

  const handleNext = () => {
    if (currentIndex < article.sentences.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetState();
    } else {
      Alert.alert("Completed!", "Great job! You finished this article.", [
        { text: "Back to List", onPress: () => router.back() },
      ]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      resetState();
    }
  };

  const resetState = () => {
    setUserAnswers({});
    setFeedback("none");
  };

  const playSound = () => {
    const textToSpeak = currentSentence.segments
      .map((s) => {
        if (s.isBlank) return s.answer;
        return s.text;
      })
      .join(" ");

    Speech.speak(textToSpeak, { language: "en" });
  };

  const isFirst = currentIndex === 0;

  return (
    <Layout style={styles.container} level="1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Success Banner - Top */}
          {feedback === "correct" && (
            <View style={styles.successBanner}>
              <CheckmarkIcon style={styles.checkIcon} fill={SUCCESS_COLOR} />
              <Text style={styles.successText}>CORRECT!</Text>
            </View>
          )}

          {/* Sentence Card */}
          <Card style={styles.card}>
            <View style={styles.sentenceContainer}>
              {currentSentence.segments.map((seg) => (
                <View key={seg.id} style={styles.segmentWrapper}>
                  {seg.isBlank ? (
                    <View style={styles.inputWrapper}>
                      {feedback === "correct" ? (
                        <View style={styles.correctAnswerContainer}>
                          <Text style={styles.correctAnswerText}>
                            {seg.answer}
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.inputContainer}>
                          <TextInput
                            style={styles.textInput}
                            placeholder={`(${seg.hint})`}
                            placeholderTextColor={Colors.light.textSecondary}
                            value={userAnswers[seg.id] || ""}
                            onChangeText={(text) => {
                              const newAnswers = {
                                ...userAnswers,
                                [seg.id]: text,
                              };
                              setUserAnswers(newAnswers);

                              const blankSegments =
                                currentSentence.segments.filter(
                                  (s) => s.isBlank,
                                );
                              const allCorrect = blankSegments.every((s) => {
                                const ans = newAnswers[s.id] || "";
                                return (
                                  s.answer &&
                                  ans.trim().toLowerCase() ===
                                    s.answer.toLowerCase()
                                );
                              });

                              if (allCorrect) {
                                setFeedback("correct");
                              } else {
                                if (feedback !== "none") setFeedback("none");
                              }
                            }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            selectionColor={PRIMARY_COLOR}
                          />
                        </View>
                      )}
                      {feedback === "wrong" && (
                        <Text style={styles.tryAgainText}>Try again!</Text>
                      )}
                    </View>
                  ) : (
                    <Text style={styles.staticText}>{seg.text}</Text>
                  )}
                </View>
              ))}
            </View>
          </Card>

          {/* Audio Button */}
          <View style={styles.audioContainer}>
            <Button
              style={styles.audioButton}
              accessoryLeft={(props) => (
                <VolumeIcon {...props} fill="#FFFFFF" />
              )}
              size="medium"
              onPress={playSound}
            >
              {() => <Text style={styles.audioButtonText}>Play Audio</Text>}
            </Button>
          </View>

          {/* Next Button - shown on correct */}
          {feedback === "correct" && (
            <Button
              style={styles.nextButton}
              size="large"
              accessoryRight={(props) => (
                <ArrowForwardIcon {...props} fill="#FFFFFF" />
              )}
              onPress={handleNext}
            >
              {() => <Text style={styles.nextButtonText}>Next Word</Text>}
            </Button>
          )}

          {/* Tip Section */}
          <View style={styles.tipContainer}>
            <BulbIcon style={styles.bulbIcon} fill={PRIMARY_COLOR} />
            <View style={styles.tipTextContainer}>
              <Text style={styles.tipLabel}>Tip:</Text>
              <Text style={styles.tipText}>
                &apos;{blankWord}&apos; is a common word. Keep up the great work
                with your daily bread!
              </Text>
            </View>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {currentIndex + 1} / {article.sentences.length}
            </Text>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navButtons}>
            <Button
              style={styles.navButton}
              appearance="outline"
              status="basic"
              accessoryLeft={ArrowBackIcon}
              disabled={isFirst}
              onPress={handlePrev}
            >
              Prev
            </Button>
            <Button
              style={styles.navButton}
              appearance="outline"
              status="basic"
              accessoryRight={ArrowForwardIcon}
              onPress={handleNext}
            >
              {feedback === "correct" ? "Next" : "Skip"}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  keyboardView: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  errorText: {
    fontFamily: FONT_FAMILY.semiBold,
    marginBottom: SPACING.md,
  },
  backButton: {
    borderRadius: BORDER_RADIUS.medium,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  // Success Banner
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${SUCCESS_COLOR}15`,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.lg,
  },
  checkIcon: {
    width: 28,
    height: 28,
    marginRight: SPACING.sm,
  },
  successText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 20,
    color: SUCCESS_COLOR,
  },
  // Card
  card: {
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sentenceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
  segmentWrapper: {
    marginHorizontal: 3,
    alignItems: "center",
    marginVertical: 4,
  },
  inputWrapper: {
    minWidth: 80,
    alignItems: "center",
  },
  inputContainer: {
    borderBottomWidth: 2,
    borderBottomColor: PRIMARY_COLOR,
  },
  textInput: {
    minWidth: 100,
    textAlign: "center",
    backgroundColor: "transparent",
    borderWidth: 0,
    fontSize: 22,
    fontFamily: FONT_FAMILY.bold,
    color: Colors.light.text,
    paddingVertical: 8,
    paddingHorizontal: 4,
    // Remove focus outline on web
    ...Platform.select({
      web: {
        outlineStyle: "none",
      } as any,
    }),
  },
  correctAnswerContainer: {
    borderBottomWidth: 2,
    borderBottomColor: SUCCESS_COLOR,
    paddingBottom: 4,
  },
  correctAnswerText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 22,
    color: SUCCESS_COLOR,
  },
  staticText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 22,
    lineHeight: 36,
    color: Colors.light.text,
  },
  tryAgainText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12,
    color: Colors.light.error,
    marginTop: 4,
  },
  // Audio Button
  audioContainer: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  audioButton: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: SPACING.lg,
  },
  audioButtonText: {
    fontFamily: FONT_FAMILY.semiBold,
    color: "#FFFFFF",
    marginLeft: SPACING.sm,
  },
  // Next Button
  nextButton: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.lg,
  },
  nextButtonText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 16,
    color: "#FFFFFF",
  },
  // Tip Section
  tipContainer: {
    flexDirection: "row",
    backgroundColor: `${PRIMARY_COLOR}10`,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.lg,
    alignItems: "flex-start",
  },
  bulbIcon: {
    width: 24,
    height: 24,
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  tipTextContainer: {
    flex: 1,
  },
  tipLabel: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 14,
    color: PRIMARY_COLOR,
    marginBottom: 4,
  },
  tipText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  // Progress
  progressContainer: {
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  progressText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  // Navigation
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.md,
  },
  navButton: {
    flex: 1,
    borderRadius: BORDER_RADIUS.medium,
    borderColor: Colors.light.border,
  },
});
