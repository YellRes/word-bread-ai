import "../global.css";
import { Stack } from "expo-router";
import { View } from "react-native";

import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

export default function RootLayout() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <View style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="index" options={{ title: "Word Bread" }} />
            <Stack.Screen name="practice/[articleId]" options={{ title: "Practice" }} />
          </Stack>
        </View>
      </ApplicationProvider>
    </>
  );
}
