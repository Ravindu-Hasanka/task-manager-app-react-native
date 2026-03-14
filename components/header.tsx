import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { buildTheme } from '@/constants/theme/build-theme';

export const Header = ({
  theme,
  onThemeToggle,
}: {
  theme: ReturnType<typeof buildTheme>;
  onThemeToggle: () => void;
}) => (
  <View style={styles.headerRow}>
    <View style={styles.headerLeft}>
      <View style={[styles.avatar, { borderColor: theme.avatarRing }]}>
        <Ionicons name="person" size={22} color={theme.textPrimary} />
      </View>
      <View>
        <Text style={[styles.greeting, { color: theme.textPrimary }]}>Good Morning, Dr. Nimal</Text>
        <Text style={[styles.dateText, { color: theme.textSecondary }]}>Thursday, Oct 24</Text>
      </View>
    </View>

    <View style={styles.headerActions}>
      <TouchableOpacity
        onPress={onThemeToggle}
        style={[styles.themeButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
      >
        <Ionicons
          name={theme.mode === 'dark' ? 'sunny-outline' : 'moon-outline'}
          size={20}
          color={theme.textPrimary}
        />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.bellButton, { backgroundColor: theme.blue }]}>
        <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  themeButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 17,
    fontWeight: '800',
  },
  dateText: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '500',
  },
});
