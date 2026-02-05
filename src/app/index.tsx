/**
 * Article List Page - Word Bread AI
 * AI Generated - Optimized UI based on Stitch design
 */
import {
    Card,
    Icon,
    IconElement,
    Layout,
    List,
    Spinner,
    Text,
} from "@ui-kitten/components";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import {
    BORDER_RADIUS,
    Colors,
    FONT_FAMILY,
    PRIMARY_COLOR,
    SPACING,
} from "../constants/theme";
import { fetchArticles } from "../services/dataService";
import { Article } from "../types";

// Icons
const ArrowIcon = (props: any): IconElement => (
  <Icon {...props} name="arrow-ios-forward-outline" />
);

const ClockIcon = (props: any): IconElement => (
  <Icon {...props} name="clock-outline" />
);

// Calculate estimated reading time (approx 1 min per 2-3 sentences)
const getReadingTime = (sentenceCount: number): string => {
  const minutes = Math.max(1, Math.ceil(sentenceCount / 2));
  return `${minutes} min read`;
};

export default function ArticleList() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchArticles();
    setArticles(data);
    setLoading(false);
  };

  const renderItemHeader = (headerProps: any, item: Article) => (
    <View {...headerProps} style={[headerProps.style, styles.headerContainer]}>
      <Text category="h6" style={styles.title}>
        {item.title}
      </Text>
    </View>
  );

  const renderItemFooter = (footerProps: any, item: Article) => (
    <View {...footerProps} style={[footerProps.style, styles.footerContainer]}>
      <View style={styles.readTimeContainer}>
        <ClockIcon style={styles.clockIcon} fill={PRIMARY_COLOR} />
        <Text appearance="hint" category="c1" style={styles.readTimeText}>
          {getReadingTime(item.sentences.length)}
        </Text>
      </View>
      <View style={styles.arrowContainer}>
        <ArrowIcon style={styles.arrowIcon} fill={PRIMARY_COLOR} />
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: Article }) => (
    <Card
      style={styles.card}
      status="basic"
      header={(props) => renderItemHeader(props, item)}
      footer={(props) => renderItemFooter(props, item)}
      onPress={() => {
        router.push({
          pathname: `/practice/${item.id}`,
          params: { articleData: JSON.stringify(item) },
        });
      }}
    >
      <Text category="s1" style={styles.description}>
        {item.description}
      </Text>
    </Card>
  );

  if (loading) {
    return (
      <Layout style={styles.loadingContainer} level="2">
        <Spinner size="giant" status="primary" />
        <Text style={styles.loadingText} appearance="hint">
          Loading articles...
        </Text>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container} level="2">
      <List
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
        data={articles}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  list: {
    flex: 1,
    backgroundColor: "transparent",
  },
  contentContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  card: {
    marginVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 0,
    // Shadow for iOS
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xs,
  },
  title: {
    fontFamily: FONT_FAMILY.semiBold,
    color: Colors.light.text,
    fontSize: 18,
  },
  description: {
    color: Colors.light.textSecondary,
    fontFamily: FONT_FAMILY.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  readTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  clockIcon: {
    width: 16,
    height: 16,
    marginRight: SPACING.xs,
  },
  readTimeText: {
    fontFamily: FONT_FAMILY.regular,
    color: Colors.light.textSecondary,
  },
  arrowContainer: {
    backgroundColor: `${PRIMARY_COLOR}15`,
    borderRadius: BORDER_RADIUS.full,
    padding: SPACING.xs,
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontFamily: FONT_FAMILY.regular,
  },
});
