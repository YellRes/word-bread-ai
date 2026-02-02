import { View, Text, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MOCK_ARTICLES } from '../constants/mockData';
import { Article } from '../types';

export default function ArticleList() {
    const router = useRouter();

    const renderItem = ({ item }: { item: Article }) => (
        <Pressable
            className="bg-white p-4 mb-3 rounded-lg shadow-sm active:bg-gray-50"
            onPress={() => router.push(`/practice/${item.id}`)}
        >
            <Text className="text-lg font-bold text-slate-800">{item.title}</Text>
            <Text className="text-sm text-slate-500 mt-1">{item.description}</Text>
            <Text className="text-xs text-slate-400 mt-2">{item.sentences.length} Sentences</Text>
        </Pressable>
    );

    return (
        <View className="flex-1 bg-slate-100 p-4">
            <FlatList
                data={MOCK_ARTICLES}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}
