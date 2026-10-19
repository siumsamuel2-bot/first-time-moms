import { useThemeMode } from '@/context/ThemeModeContext';
import { useCallback, useEffect, useState } from 'react';

function inWindow(now = new Date()): boolean {
  const minutes = now.getHours() * 60 + now.getMinutes();
  const start = 22 * 60;
  const end = 6 * 60;
  return minutes >= start || minutes < end;
}

/**
 * One-tap moon/sun override, "always visible in the header during the window,
 * doesn't nag" (spec §2). Outside the window it renders nothing until the user
 * has an active manual choice to undo.
 */
export function ThemeToggle() {
  const { mode, isManual, toggle, clearManualChoice } = useThemeMode();
  const [windowActive, setWindowActive] = useState(() => inWindow());

  const refresh = useCallback(() => setWindowActive(inWindow()), []);

  useEffect(() => {
    document.addEventListener('visibilitychange', refresh);
    return () => document.removeEventListener('visibilitychange', refresh);
  }, [refresh]);

  if (!windowActive && !isManual) return null;

  const goingTo = mode === 'night' ? 'day' : 'night';
  const label = mode === 'night' ? 'Switch to day view' : 'Switch to 3 AM mode';

  return (
    <button
      type="button"
      onClick={isManual ? clearManualChoice : toggle}
      aria-label={label}
      title={label}
      className="night-touch flex h-10 w-10 items-center justify-center rounded-full text-lg"
      data-testid="theme-toggle"
      data-mode={mode}
      data-target={goingTo}
    >
      <span aria-hidden="true">{mode === 'night' ? '☀︎' : '🌙'}</span>
    </button>
  );
}
