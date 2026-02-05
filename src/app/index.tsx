/**
 * Article List Page - Word Bread AI
 * AI Generated - Optimized UI based on Stitch design
 */
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BORDER_RADIUS,
  Colors,
  FONT_FAMILY,
  PRIMARY_COLOR,
  PRIMARY_COLOR_LIGHT,
  SPACING,
} from "../constants/theme";
import { fetchArticles } from "../services/dataService";
import { Article } from "../types";

// Calculate estimated reading time (approx 1 min per 2-3 sentences)
const getReadingTime = (sentenceCount: number): string => {
  const minutes = Math.max(1, Math.ceil(sentenceCount / 2));
  return `${minutes} Sentence NEED REVIEW`;
};

// Article Card Component
const ArticleCard = ({
  item,
  onPress,
}: {
  item: Article;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
    <Text style={styles.cardTitle}>{item.title}</Text>
    <Text style={styles.cardDescription} numberOfLines={2}>
      {item.description}
    </Text>
    <View style={styles.cardFooter}>
      <View style={styles.readTimeBadge}>
        <View style={styles.badgeDot} />
        <Text style={styles.readTimeText}>
          {getReadingTime(item.sentences.length)}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function ArticleList() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchArticles();
    setArticles(data);
    setLoading(false);
  };

  const handleArticlePress = (item: Article) => {
    router.push({
      pathname: `/practice/${item.id}` as any,
      params: { articleData: JSON.stringify(item) },
    });
  };

  // Filter articles based on search text
  const filteredArticles = articles.filter(
    (item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase()),
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          <Text style={styles.loadingText}>Loading articles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.light.cardBackground}
      />
      <View style={styles.container}>
        {/* Header - Icon + Title only */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <MaterialIcons name="bakery-dining" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.headerTitle}>Word Bread AI</Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <MaterialIcons
              name="search"
              size={20}
              color={Colors.light.textSecondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search bakery articles..."
              placeholderTextColor={Colors.light.textSecondary}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Articles List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {filteredArticles.map((item) => (
            <ArticleCard
              key={item.id}
              item={item}
              onPress={() => handleArticlePress(item)}
            />
          ))}

          {/* Bottom Footer Text */}
          <View style={styles.footerContainer}>
            <MaterialIcons
              name="bakery-dining"
              size={16}
              color={PRIMARY_COLOR}
            />
            <Text style={styles.footerText}>FRESHLY BAKED DAILY</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.cardBackground,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  // Header Styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: Colors.light.cardBackground,
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.large,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  headerTitle: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 20,
    color: Colors.light.text,
  },
  // Search Input Styles
  searchContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: Colors.light.cardBackground,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONT_FAMILY.regular,
    fontSize: 14,
    color: Colors.light.text,
    padding: 0,
  },
  // ScrollView
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  // Card Styles
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cardTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: SPACING.xs,
  },
  cardDescription: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.xs,
  },
  readTimeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR_LIGHT + "20",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PRIMARY_COLOR,
    marginRight: SPACING.xs,
  },
  readTimeText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 11,
    color: PRIMARY_COLOR,
    letterSpacing: 0.5,
  },
  // Footer
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.lg,
    marginTop: SPACING.md,
  },
  footerText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 12,
    color: PRIMARY_COLOR,
    letterSpacing: 1,
    marginLeft: SPACING.xs,
  },
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontFamily: FONT_FAMILY.regular,
    color: Colors.light.textSecondary,
  },
});
