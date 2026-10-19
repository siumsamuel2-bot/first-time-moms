import {
  MANUAL_THEME_CHOICE_KEY,
  type ManualThemeChoice,
  type ThemeMode,
  resolveThemeMode,
} from '@/lib/threeAM';
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface ThemeModeContextValue {
  mode: ThemeMode;
  isNight: boolean;
  /** True when the mode came from a fresh manual override, not the clock. */
  isManual: boolean;
  /** One-tap moon/sun toggle (3 AM spec §2). */
  toggle: () => void;
  setManualChoice: (mode: ThemeMode) => void;
  clearManualChoice: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined);

function readStoredChoice(): ManualThemeChoice | null {
  try {
    const raw = window.localStorage.getItem(MANUAL_THEME_CHOICE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ManualThemeChoice>;
    if ((parsed.mode === 'day' || parsed.mode === 'night') && typeof parsed.chosenAt === 'number') {
      return { mode: parsed.mode, chosenAt: parsed.chosenAt };
    }
    return null;
  } catch {
    return null;
  }
}

function prefersDark(): boolean {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

function computeMode(manualChoice: ManualThemeChoice | null): ThemeMode {
  return resolveThemeMode({ now: new Date(), manualChoice, prefersDark: prefersDark() });
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [manualChoice, setManualChoiceState] = useState<ManualThemeChoice | null>(() =>
    typeof window === 'undefined' ? null : readStoredChoice()
  );
  const [mode, setMode] = useState<ThemeMode>(() => computeMode(readStoredChoiceSafe()));

  const recompute = useCallback(() => {
    setMode(computeMode(readStoredChoice()));
  }, []);

  /* Re-evaluate on app-state transitions (spec §8), not on a ticking timer. */
  useEffect(() => {
    recompute();
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') recompute();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [recompute]);

  /* Reflect the resolved theme onto <html> so CSS custom properties switch. */
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = mode;
    root.style.colorScheme = mode;
  }, [mode]);

  const setManualChoice = useCallback((next: ThemeMode) => {
    const choice: ManualThemeChoice = { mode: next, chosenAt: Date.now() };
    setManualChoiceState(choice);
    try {
      window.localStorage.setItem(MANUAL_THEME_CHOICE_KEY, JSON.stringify(choice));
    } catch {
      /* storage unavailable (private mode) — keep the in-memory choice */
    }
    setMode(next);
  }, []);

  const clearManualChoice = useCallback(() => {
    setManualChoiceState(null);
    try {
      window.localStorage.removeItem(MANUAL_THEME_CHOICE_KEY);
    } catch {
      /* ignore */
    }
    recompute();
  }, [recompute]);

  const isManual = useMemo(
    () => manualChoice !== null && manualChoice.mode === mode,
    [manualChoice, mode]
  );

  const toggle = useCallback(() => {
    setManualChoice(mode === 'night' ? 'day' : 'night');
  }, [mode, setManualChoice]);

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      isNight: mode === 'night',
      isManual,
      toggle,
      setManualChoice,
      clearManualChoice,
    }),
    [mode, isManual, toggle, setManualChoice, clearManualChoice]
  );

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

function readStoredChoiceSafe(): ManualThemeChoice | null {
  return typeof window === 'undefined' ? null : readStoredChoice();
}

export function useThemeMode(): ThemeModeContextValue {
  const context = useContext(ThemeModeContext);
  if (!context) throw new Error('useThemeMode must be used within ThemeModeProvider');
  return context;
}
