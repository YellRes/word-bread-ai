/**
 * Root Layout - Word Bread AI
 * AI Generated - Applies custom theme from Stitch design
 */
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";

import * as eva from "@eva-design/eva";
import {
    ApplicationProvider,
    IconRegistry
} from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

import {
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
    useFonts,
} from "@expo-google-fonts/lexend";

import { Colors, customTheme, PRIMARY_COLOR } from "../constants/theme";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Merge custom theme with eva light theme
const theme = { ...eva.light, ...customTheme };

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.light.background,
        }}
      >
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={theme}>
        <View style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: PRIMARY_COLOR,
              },
              headerTintColor: "#FFFFFF",
              headerTitleStyle: {
                fontFamily: "Lexend_600SemiBold",
                fontWeight: "600",
              },
              contentStyle: {
                backgroundColor: Colors.light.background,
              },
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                title: "Word Bread AI",
                headerTitleStyle: {
                  fontFamily: "Lexend_700Bold",
                  fontWeight: "700",
                },
              }}
            />
            <Stack.Screen
              name="practice/[articleId]"
              options={{
                title: "Practice",
              }}
            />
          </Stack>
        </View>
      </ApplicationProvider>
    </View>
  );
}
