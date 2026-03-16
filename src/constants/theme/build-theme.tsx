import { ThemeMode } from '../../types/theme-mode';

export const buildTheme = (mode: ThemeMode) => {
  const dark = mode === 'dark';

  return {
    mode,
    background: dark ? '#081225' : '#F3F5F9',
    card: dark ? '#16243B' : '#ECEFF5',
    cardBorder: dark ? '#294061' : '#C7D4EB',
    textPrimary: dark ? '#F7F9FC' : '#1B2432',
    textSecondary: dark ? '#96A3BA' : '#8C98AE',
    blue: '#2563EB',
    progressTrack: dark ? '#1C2940' : '#1F2A44',
    inputBg: dark ? '#182741' : '#F5F6F8',
    inputBorder: dark ? '#233552' : '#D4DAE4',
    chipBg: dark ? '#16243B' : '#FFFFFF',
    chipBorder: dark ? '#3A4B69' : '#8E99AA',
    tabBarBg: dark ? '#081225' : '#F3F5F9',
    tabBarBorder: dark ? '#16243B' : '#CFD6E4',
    fabShadow: '#2563EB',
    iconMuted: dark ? '#7D8CA7' : '#71809A',
    pending: '#F59E0B',
    completed: '#14C9A2',
    highBg: '#F6C5C7',
    highText: '#D6505D',
    mediumBg: '#F8E6B2',
    mediumText: '#B8870F',
    normalBg: '#41516F',
    normalText: '#D7E1F3',
    successChip: dark ? '#0B2D33' : '#E3F5F1',
    avatarRing: dark ? '#8EB0FF' : '#9AB5E6',
  };
};
