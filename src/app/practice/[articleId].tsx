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
  TouchableOpacity,
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
import { fetchArticles } from "../../services/dataService";
import { Article, Sentence } from "../../types";

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

// Prefer explicit translation; fallback to replacing (answer-hint) with hint.
const getSentenceTranslation = (sentence: Sentence): string => {
  const explicitTranslation =
    (sentence as any).translate ||
    (sentence as any).translation ||
    (sentence as any).cn ||
    "";
  if (typeof explicitTranslation === "string" && explicitTranslation.trim()) {
    return explicitTranslation.trim();
  }

  return (sentence.raw || "")
    .replace(/\(([^)]+)\)/g, (_, content: string) => {
      const separatorIdx = content.lastIndexOf("-");
      if (separatorIdx === -1) return content.trim();

      const hint = content.substring(separatorIdx + 1).trim();
      const answer = content.substring(0, separatorIdx).trim();
      return hint || answer;
    })
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
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
  const [revealedAnswers, setRevealedAnswers] = useState<
    Record<string, boolean>
  >({});
  const [feedback, setFeedback] = useState<"none" | "correct" | "wrong">(
    "none",
  );

  useEffect(() => {
    let cancelled = false;

    const loadArticle = async () => {
      if (!articleData) return;

      try {
        const parsedArticle = JSON.parse(articleData) as Article;
        if (!cancelled) setArticle(parsedArticle);

        // Some navigations may carry stale articleData in params.
        // If translation is missing in params, refetch by articleId.
        const hasTranslation = parsedArticle.sentences?.some((s) =>
          Boolean(s.translate?.trim() || s.translation?.trim()),
        );
        if (hasTranslation || !articleId) return;

        const latestArticles = await fetchArticles();
        const latestArticle = latestArticles.find(
          (a) => String(a.id) === String(articleId),
        );
        if (latestArticle && !cancelled) {
          setArticle(latestArticle);
        }
      } catch (e) {
        console.error("Failed to parse article data", e);
      }
    };

    loadArticle();

    return () => {
      cancelled = true;
    };
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
  const blankSegments = currentSentence.segments.filter((s) => s.isBlank);
  const sentenceTranslation = getSentenceTranslation(currentSentence);

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
    setRevealedAnswers({});
    setFeedback("none");
  };

  const playBlankWordSound = (answer?: string) => {
    const englishWord = answer?.trim();
    if (!englishWord) return;

    Speech.stop();
    Speech.speak(englishWord, { language: "en-US" });
  };

  const toggleRevealAnswer = (segId: string) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [segId]: !prev[segId],
    }));
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

          {/* Blank Tools Section */}
          {blankSegments.length > 0 && (
            <View style={styles.blankToolsContainer}>
              <Text style={styles.blankToolsTitle}>挖空操作</Text>
              <View style={styles.blankToolsList}>
                {blankSegments.map((seg, index) => (
                  <View key={`tool-${seg.id}`} style={styles.blankToolItem}>
                    <Text style={styles.blankToolLabel}>#{index + 1}</Text>
                    <TouchableOpacity
                      style={styles.blankIconButton}
                      onPress={() => playBlankWordSound(seg.answer)}
                      activeOpacity={0.7}
                    >
                      <VolumeIcon
                        style={styles.blankActionIcon}
                        fill={PRIMARY_COLOR}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.blankIconButton,
                        revealedAnswers[seg.id] && styles.blankIconButtonActive,
                      ]}
                      onPress={() => toggleRevealAnswer(seg.id)}
                      activeOpacity={0.7}
                    >
                      <Icon
                        name={
                          revealedAnswers[seg.id]
                            ? "eye-off-outline"
                            : "eye-outline"
                        }
                        style={styles.blankActionIcon}
                        fill={PRIMARY_COLOR}
                      />
                    </TouchableOpacity>
                    {revealedAnswers[seg.id] && !!seg.answer && (
                      <View style={styles.revealedAnswerChip}>
                        <Text style={styles.revealedAnswerText}>
                          {seg.answer}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

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

          {/* Translation Section */}
          <View style={styles.tipContainer}>
            <BulbIcon style={styles.bulbIcon} fill={PRIMARY_COLOR} />
            <View style={styles.tipTextContainer}>
              <Text style={styles.tipLabel}>翻译：</Text>
              <Text style={styles.tipText}>{sentenceTranslation || "暂无翻译"}</Text>
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
    minWidth: 90,
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
  blankToolsContainer: {
    marginBottom: SPACING.lg,
  },
  blankToolsTitle: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: SPACING.xs,
  },
  blankToolsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },
  blankToolItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
  },
  blankToolLabel: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  // Blank action icon buttons
  blankIconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${PRIMARY_COLOR}12`,
  },
  blankIconButtonActive: {
    backgroundColor: `${PRIMARY_COLOR}22`,
  },
  blankActionIcon: {
    width: 16,
    height: 16,
  },
  revealedAnswerText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 12,
    color: PRIMARY_COLOR,
  },
  revealedAnswerChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: `${PRIMARY_COLOR}12`,
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
