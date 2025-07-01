import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function AuthLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerShadowVisible: false,
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: "600",
          },
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen
          name="login"
          options={{
            title: "Login",
            headerShown: false
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            title: "Register",
            headerShown: false
          }}
        />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});