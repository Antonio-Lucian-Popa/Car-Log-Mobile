import Button from '@/components/Button';
import GoogleButton from '@/components/GoogleButton';
import Input from '@/components/Input';
import Colors from '@/constants/Colors';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login, isLoading, error, clearError } = useAuthStore();
  const { theme } = useThemeStore();
  const colors = Colors[theme];
  const styles = createStyles(colors);

  const validateForm = () => {
    let isValid = true;

    setEmailError('');
    setPasswordError('');
    clearError();

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        await login(email, password);
      } catch (err) {
        Alert.alert('Login Failed', 'Please check your credentials and try again.');
      }
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Google login is not implemented in this demo.');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/icon.jpeg')}
            style={styles.logo}
          />
          <Text style={styles.subtitle}>Track your vehicle expenses</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={passwordError}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            title="Login"
            onPress={handleLogin}
            isLoading={isLoading}
            style={styles.loginButton}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <GoogleButton onPress={handleGoogleLogin} />

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don&apos;t have an account?</Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: typeof Colors.light | typeof Colors.dark) =>
  StyleSheet.create({
    logo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 16,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      padding: 20,
      paddingTop: 60,
    },
    header: {
      alignItems: 'center',
      marginVertical: 48,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    form: {
      width: '100%',
    },
    loginButton: {
      marginTop: 16,
    },
    errorText: {
      color: colors.error,
      marginTop: 8,
      textAlign: 'center',
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 24,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      marginHorizontal: 10,
      color: colors.textSecondary,
    },
    googleButton: {
      marginBottom: 16,
    },
    registerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 16,
    },
    registerText: {
      color: colors.textSecondary,
      marginRight: 4,
    },
    registerLink: {
      color: colors.primary,
      fontWeight: '600',
    },
  });
