import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { buildTheme } from '../constants/theme/build-theme';

type DashboardHeaderProps = {
  theme: ReturnType<typeof buildTheme>;
  variant?: 'dashboard';
  onThemeToggle: () => void;
};

type TitleHeaderProps = {
  theme: ReturnType<typeof buildTheme>;
  variant: 'title';
  title: string;
  onBackPress: () => void;
};

type HeaderProps = DashboardHeaderProps | TitleHeaderProps;

export const Header = (props: HeaderProps) => {
  const { theme } = props;
  const now = new Date();
  const currentHour = now.getHours();
  const greeting =
    currentHour < 12
      ? 'Good Morning, Dr. Nimal'
      : currentHour < 18
        ? 'Good Afternoon, Dr. Nimal'
        : 'Good Evening, Dr. Nimal';
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(now);

  if (props.variant === 'title') {
    return (
      <View style={styles.titleHeaderRow}>
        <TouchableOpacity onPress={props.onBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.titleText, { color: theme.textPrimary }]}>{props.title}</Text>
        <View style={styles.backButton} />
      </View>
    );
  }

  return (
    <View style={styles.headerRow}>
      <View style={styles.headerLeft}>
        <View style={[styles.avatar, { borderColor: theme.avatarRing }]}>
          <Ionicons name="person" size={22} color={theme.textPrimary} />
        </View>
        <View>
          <Text style={[styles.greeting, { color: theme.textPrimary }]}>{greeting}</Text>
          <Text style={[styles.dateText, { color: theme.textSecondary }]}>{formattedDate}</Text>
        </View>
      </View>

      <View style={styles.headerActions}>
        <TouchableOpacity
          onPress={props.onThemeToggle}
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
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  titleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'flex-start',
    justifyContent: 'center',
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
  titleText: {
    fontSize: 24,
    fontWeight: '800',
  },
  dateText: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '500',
  },
});
