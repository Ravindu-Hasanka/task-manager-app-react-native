// import { Image } from 'expo-image';
// import { Platform, StyleSheet } from 'react-native';

// import { HelloWave } from '@/components/hello-wave';
// import ParallaxScrollView from '@/components/parallax-scroll-view';
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { Link } from 'expo-router';

// export default function HomeScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/partial-react-logo.png')}
//           style={styles.reactLogo}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome to App!</ThemedText>
//         <HelloWave />
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//         <ThemedText>
//           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
//           Press{' '}
//           <ThemedText type="defaultSemiBold">
//             {Platform.select({
//               ios: 'cmd + d',
//               android: 'cmd + m',
//               web: 'F12',
//             })}
//           </ThemedText>{' '}
//           to open developer tools.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <Link href="/modal">
//           <Link.Trigger>
//             <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//           </Link.Trigger>
//           <Link.Preview />
//           <Link.Menu>
//             <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
//             <Link.MenuAction
//               title="Share"
//               icon="square.and.arrow.up"
//               onPress={() => alert('Share pressed')}
//             />
//             <Link.Menu title="More" icon="ellipsis">
//               <Link.MenuAction
//                 title="Delete"
//                 icon="trash"
//                 destructive
//                 onPress={() => alert('Delete pressed')}
//               />
//             </Link.Menu>
//           </Link.Menu>
//         </Link>

//         <ThemedText>
//           {`Tap the Explore tab to learn more about what's included in this starter app.`}
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//         <ThemedText>
//           {`When you're ready, run `}
//           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
//           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//         </ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });

import React, { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { buildTheme } from '@/constants/theme/build-theme';
import { ThemeMode } from '@/types/theme-mode';
import { Filter } from '@/types/task-filter';
import { Task } from '@/types/task';
import { TASKS } from '@/mock-data/tasks';
import { useThemeMode } from '@/hooks/use-theme-mode';

export const DashboardScreen = ({
  mode,
}: {
  mode: ThemeMode;
}) => {
  const theme = useMemo(() => buildTheme(mode), [mode]);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const filteredTasks = TASKS.filter((task) => {
    const searchMatch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.subtitle.toLowerCase().includes(search.toLowerCase());

    const filterMatch =
      filter === 'all'
        ? true
        : filter === 'pending'
        ? task.status === 'Pending'
        : task.status === 'Completed';

    return searchMatch && filterMatch;
  });

  const completedCount = TASKS.filter((task) => task.status === 'Completed').length;
  const pendingCount = TASKS.filter((task) => task.status === 'Pending').length;
  const progress = completedCount / TASKS.length;

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <View style={styles.screenWrapper}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 32 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.heading, { color: theme.textPrimary }]}>You have 5 tasks today</Text>

          <View style={styles.statsRow}>
            <StatCard label="Completed" value={completedCount} valueColor="#10B981" theme={theme} />
            <StatCard label="Pending" value={pendingCount} valueColor="#F59E0B" theme={theme} />
          </View>

          <View style={styles.progressHeader}>
            <Text style={[styles.progressTitle, { color: theme.blue }]}>Today Progress</Text>
            <Text style={[styles.progressText, { color: theme.textSecondary }]}>
              {completedCount} of {TASKS.length} completed ({Math.round(progress * 100)}%)
            </Text>
          </View>

          <View style={[styles.progressTrack, { backgroundColor: theme.progressTrack }]}>
            <View style={[styles.progressFill, { backgroundColor: theme.blue, width: `${progress * 100}%` }]} />
          </View>

          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
              },
            ]}
          >
            <Feather name="search" size={20} color={theme.iconMuted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search tasks, patients ..."
              placeholderTextColor={theme.textSecondary}
              style={[styles.searchInput, { color: theme.textPrimary }]}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle-outline" size={24} color={theme.iconMuted} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.filterRow}>
            <FilterChip label="All Tasks" active={filter === 'all'} onPress={() => setFilter('all')} theme={theme} />
            <FilterChip label="Pending" active={filter === 'pending'} onPress={() => setFilter('pending')} theme={theme} />
            <FilterChip
              label="Completed"
              active={filter === 'completed'}
              onPress={() => setFilter('completed')}
              theme={theme}
            />
          </View>

          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} theme={theme} />
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={() => router.push('/add-task')}
          style={[
            styles.fab,
            {
              backgroundColor: theme.blue,
              shadowColor: theme.fabShadow,
              bottom: insets.bottom,
            },
          ]}
        >
          <Ionicons name="add" size={34} color="#FFFFFF" />
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

export default function HomeScreen() {
  const { mode } = useThemeMode();

  return <DashboardScreen mode={mode} />;
}



const StatCard = ({
  label,
  value,
  valueColor,
  theme,
}: {
  label: string;
  value: number;
  valueColor: string;
  theme: ReturnType<typeof buildTheme>;
}) => (
  <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{label}</Text>
    <Text style={[styles.statValue, { color: valueColor }]}>{value}</Text>
  </View>
);

const FilterChip = ({
  label,
  active,
  onPress,
  theme,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  theme: ReturnType<typeof buildTheme>;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.filterChip,
      {
        backgroundColor: active ? theme.blue : theme.chipBg,
        borderColor: active ? theme.blue : theme.chipBorder,
      },
    ]}
  >
    <Text style={[styles.filterChipText, { color: active ? '#FFFFFF' : theme.textSecondary }]}>{label}</Text>
  </TouchableOpacity>
);

const TaskCard = ({ task, theme }: { task: Task; theme: ReturnType<typeof buildTheme> }) => {
  const isCompleted = task.status === 'Completed';

  const priorityStyles =
    task.priority === 'HIGH PRIORITY'
      ? { bg: theme.highBg, text: theme.highText }
      : task.priority === 'MEDIUM PRIORITY'
      ? { bg: theme.mediumBg, text: theme.mediumText }
      : { bg: theme.normalBg, text: theme.normalText };

  return (
    <View style={[styles.taskCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <View style={styles.taskTopRow}>
        <View style={styles.taskMetaRow}>
          <View style={[styles.priorityBadge, { backgroundColor: priorityStyles.bg }]}>
            <Text style={[styles.priorityText, { color: priorityStyles.text }]}>{task.priority}</Text>
          </View>
          <Text style={[styles.taskTime, { color: theme.textSecondary }]}>{task.time}</Text>
        </View>

        {isCompleted ? (
          <View style={[styles.completedIconBox, { backgroundColor: theme.successChip }]}>
            <MaterialCommunityIcons name="check-all" size={22} color={theme.completed} />
          </View>
        ) : (
          <TouchableOpacity style={[styles.menuButton, { borderColor: theme.chipBorder }]}>
            <Feather name="more-vertical" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <Text
        style={[
          styles.taskTitle,
          {
            color: theme.textPrimary,
            textDecorationLine: isCompleted ? 'line-through' : 'none',
            opacity: isCompleted ? 0.6 : 1,
          },
        ]}
      >
        {task.title}
      </Text>

      <Text style={[styles.taskSubtitle, { color: theme.textSecondary }]}>{task.subtitle}</Text>

      <View style={styles.statusRow}>
        <Ionicons
          name={isCompleted ? 'checkmark-circle-outline' : 'time-outline'}
          size={14}
          color={isCompleted ? theme.completed : theme.pending}
        />
        <Text style={[styles.statusText, { color: isCompleted ? theme.completed : theme.pending }]}>
          {task.status}
        </Text>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screenWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 18,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 22,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
  },
  progressTrack: {
    width: '100%',
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  searchBox: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 18,
  },
  filterChip: {
    flex: 1,
    height: 42,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipText: {
    fontSize: 15,
    fontWeight: '600',
  },
  taskCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 18,
  },
  taskTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  priorityBadge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  taskTime: {
    fontSize: 13,
    fontWeight: '600',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  taskSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 18,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  
  
});
