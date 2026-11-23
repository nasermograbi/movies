import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreen } from "../screens/HomeScreen";
import { MovieDetailsScreen } from "../screens/MovieDetailsScreen";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerBackButtonDisplayMode: "minimal" }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "ExWo Movies" }}
      />
      <Stack.Screen
        name="MovieDetails"
        component={MovieDetailsScreen}
        options={{ title: "" }}
      />
    </Stack.Navigator>
  );
}
