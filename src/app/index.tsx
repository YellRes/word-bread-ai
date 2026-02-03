import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Layout, List, Text, Card, Icon, IconElement, Spinner } from '@ui-kitten/components';
import { fetchArticles } from '../services/dataService';
import { Article } from '../types';

const ArrowIcon = (props: any): IconElement => (
    <Icon {...props} name='arrow-ios-forward-outline' />
);

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
        <View {...headerProps}>
            <Text category='h6'>{item.title}</Text>
        </View>
    );

    const renderItemFooter = (footerProps: any, item: Article) => (
        <View {...footerProps} style={[footerProps.style, styles.footerContainer]}>
            <Text appearance='hint' category='c1'>
                {item.sentences.length} Sentences
            </Text>
            <ArrowIcon style={styles.icon} fill='#8F9BB3' />
        </View>
    );

    const renderItem = ({ item }: { item: Article }) => (
        <Card
            style={styles.item}
            status='basic'
            header={(props) => renderItemHeader(props, item)}
            footer={(props) => renderItemFooter(props, item)}
            onPress={() => {
                // We need to pass the article data or ID.
                // Since our previous implementation fetched by ID from MOCK,
                // we should update PracticePage to accept data OR we ensure dataService caches it.
                // For simplicity now, we rely on ID, but practice page needs to know about dynamic data.
                // Given the router limit, passing complex object in params is discouraged.
                // Ideally we update a global store or context.
                // For this step, let's stick to ID and let PracticePage might fail if it relies ONLY on MOCK.
                // **CRITICAL FIX**: PracticePage currently looks up MOCK_DATA.
                // We need to pass the article to Practice Page via some state management or context.
                // OR, simpler for now: Pass the object as string param (not ideal but works for prototype)
                // OR, update PracticePage to fetch too. 

                // Let's pass the index or id, but PracticePage needs to change to use the same data source.
                // I will add a parameter to route.
                router.push({
                    pathname: `/practice/${item.id}` as any, // Cast to any to bypass strict route typing for dynamic segment
                    params: { articleData: JSON.stringify(item) }
                });
            }}
        >
            <Text category='s1' style={styles.description}>
                {item.description}
            </Text>
        </Card>
    );

    if (loading) {
        return (
            <Layout style={styles.loadingContainer} level='2'>
                <Spinner size='giant' />
                <Text style={{ marginTop: 10 }} appearance='hint'>Loading sentences...</Text>
            </Layout>
        )
    }

    return (
        <Layout style={styles.container} level='2'>
            <List
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                data={articles}
                renderItem={renderItem}
            />
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    item: {
        marginVertical: 8,
        borderRadius: 8,
    },
    description: {
        color: '#8F9BB3', // Using a hint-like color or default text color
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    icon: {
        width: 20,
        height: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
