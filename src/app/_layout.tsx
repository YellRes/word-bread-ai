import "../global.css";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Word Bread" }} />
        <Stack.Screen name="practice/[articleId]" options={{ title: "Practice" }} />
      </Stack>
    </View>
  );
}
