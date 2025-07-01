import Button from '@/components/Button';
import Card from '@/components/Card';
import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import {
  Bell,
  HelpCircle,
  Moon,
  Shield,
  User
} from 'lucide-react-native';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function SettingsScreen() {
  const { user, logout, deleteAccount } = useAuthStore();
  const [notifications, setNotifications] = React.useState(true);
  const { theme, toggleTheme } = useThemeStore();

  const styles = createStyles(theme);
  const colors = Colors[theme];

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: logout },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirm Deletion',
              'All your data will be permanently deleted. This cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete Account', style: 'destructive', onPress: deleteAccount },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      {/* Account Section */}
      <Card title="Account">
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <User size={24} color={colors.primary} />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.email}</Text>
            <Text style={styles.userEmail}>User ID: {user?.id}</Text>
          </View>
        </View>

        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />
      </Card>

      {/* Preferences Section */}
      <Card title="Preferences">
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceLeft}>
            <Moon size={20} color={colors.text} />
            <Text style={styles.preferenceText}>Dark Mode</Text>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceLeft}>
            <Bell size={20} color={colors.text} />
            <Text style={styles.preferenceText}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>
      </Card>

      {/* Support Section */}
      <Card title="Support">
        <TouchableOpacity style={styles.supportItem}>
          <HelpCircle size={20} color={colors.text} />
          <Text style={styles.supportText}>Help & FAQ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.supportItem}>
          <Shield size={20} color={colors.text} />
          <Text style={styles.supportText}>Privacy Policy</Text>
        </TouchableOpacity>
      </Card>

      {/* Danger Zone */}
      <Card title="Danger Zone" titleStyle={styles.dangerTitle}>
        <Text style={styles.dangerText}>
          Deleting your account will remove all your data permanently.
        </Text>
        <Button
          title="Delete Account"
          onPress={handleDeleteAccount}
          variant="danger"
          style={styles.deleteButton}
        />
      </Card>

      <Text style={styles.versionText}>Car Logbook v1.0.0</Text>
    </ScrollView>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const colors = Colors[theme];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingVertical: 48,
    },
    content: {
      padding: 16,
      paddingBottom: 32,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    userDetails: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    logoutButton: {
      marginTop: 8,
    },
    preferenceItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    preferenceLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    preferenceText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 12,
    },
    supportItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    supportText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 12,
    },
    dangerTitle: {
      color: colors.error,
    },
    dangerText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    deleteButton: {
      backgroundColor: colors.error,
    },
    versionText: {
      textAlign: 'center',
      marginTop: 24,
      color: colors.textSecondary,
      fontSize: 14,
    },
  });
}
