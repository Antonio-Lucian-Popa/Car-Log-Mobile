import Colors from '@/constants/Colors';
import { useThemeStore } from '@/stores/themeStore';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function ModalScreen() {
  const { theme } = useThemeStore();
  const colors = Colors[theme] ?? Colors.light;
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <View style={styles.separator} />
      <Text style={styles.text}>
        This is an example modal. You can edit it in app/modal.tsx.
      </Text>

      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const colors = Colors[theme] ?? Colors.light;

  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    text: {
      color: colors.text,
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
      backgroundColor: colors.border,
    },
  });
}
