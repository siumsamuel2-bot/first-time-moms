import { Card, CardContent } from '@/components/ui/card';
import { useThemeMode } from '@/context/ThemeModeContext';
import { formatNightClock } from '@/lib/threeAM';
import { LifeBuoy, Mic } from 'lucide-react';

export type QuickLogKind = 'feed' | 'diaper' | 'slept' | 'skip';
export type NightMood = 'ok' | 'low' | 'hard';

interface ThreeAMHomeProps {
  now?: Date;
  onQuickLog?: (kind: QuickLogKind) => void;
  onCheckIn?: (mood: NightMood) => void;
  onCrisis?: () => void;
  onVoice?: () => void;
}

const QUICK_LOGS: ReadonlyArray<{ kind: QuickLogKind; emoji: string; label: string }> = [
  { kind: 'feed', emoji: '🍼', label: 'Feed' },
  { kind: 'diaper', emoji: '🧷', label: 'Diaper' },
  { kind: 'slept', emoji: '😴', label: 'Slept' },
  { kind: 'skip', emoji: '✓', label: 'Skip tonight' },
];

const MOODS: ReadonlyArray<{ mood: NightMood; emoji: string; label: string }> = [
  { mood: 'ok', emoji: '😊', label: 'Good' },
  { mood: 'low', emoji: '😐', label: 'Okay' },
  { mood: 'hard', emoji: '😔', label: 'Hard' },
];

/**
 * The 3 AM home screen (spec §3). Single-tap interactions only, 96px
 * quick-action tiles, no sliders / progress bars / badges / urgency colors,
 * and a crisis entry point that is always reachable but never glows.
 */
export function ThreeAMHome({
  now = new Date(),
  onQuickLog,
  onCheckIn,
  onCrisis,
  onVoice,
}: ThreeAMHomeProps) {
  const { isNight } = useThemeMode();
  if (!isNight) return null;

  return (
    <div className="space-y-6" data-testid="three-am-home">
      <div>
        <p className="text-lg font-medium">It&apos;s {formatNightClock(now)}.</p>
        <p className="text-sm text-muted-foreground">Awake is normal right now.</p>
      </div>

      <Card className="theme-night-card">
        <CardContent className="p-5 space-y-4">
          <p className="text-sm font-medium">⚡ Quick log</p>
          <div className="grid grid-cols-2" style={{ gap: 'var(--three-am-gap)' }}>
            {QUICK_LOGS.map((item) => (
              <button
                key={item.kind}
                type="button"
                onClick={() => onQuickLog?.(item.kind)}
                className="night-quick-tile flex flex-col items-center justify-center"
              >
                <span className="text-2xl" aria-hidden="true">
                  {item.emoji}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="theme-night-card night-glow-calm">
        <CardContent className="p-5 space-y-4">
          <p className="text-sm font-medium">Tonight&apos;s check-in</p>
          <p className="text-base">How are you feeling?</p>
          <div className="grid grid-cols-3" style={{ gap: 'var(--three-am-gap)' }}>
            {MOODS.map((item) => (
              <button
                key={item.mood}
                type="button"
                onClick={() => onCheckIn?.(item.mood)}
                aria-label={item.label}
                className="night-touch flex flex-col items-center justify-center rounded-xl border"
              >
                <span className="text-3xl" aria-hidden="true">
                  {item.emoji}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <button
        type="button"
        onClick={onVoice}
        className="night-touch flex items-center justify-center gap-2 text-sm text-muted-foreground"
      >
        <Mic className="h-5 w-5" aria-hidden="true" />
        tell me
      </button>

      <button
        type="button"
        onClick={onCrisis}
        className="night-touch flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--three-am-border-strong)] text-sm font-medium"
        data-testid="crisis-entry-point"
      >
        <LifeBuoy className="h-5 w-5" aria-hidden="true" />I need help right now
      </button>
    </div>
  );
}
