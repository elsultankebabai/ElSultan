import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Locale } from '../data/menu';
import { soundManager } from '../utils/sound';

interface AudioControlProps {
  locale: Locale;
  variant?: 'floating' | 'inline';
  className?: string;
}

export const AudioControl: React.FC<AudioControlProps> = ({
  locale,
  variant = 'floating',
  className = '',
}) => {
  const [muted, setMuted] = useState(() => soundManager.isMuted());

  useEffect(() => {
    return soundManager.subscribe(setMuted);
  }, []);

  const label =
    locale === 'ru'
      ? muted
        ? 'Звук выкл'
        : 'Звук вкл'
      : locale === 'lt'
      ? muted
        ? 'Garsas išj.'
        : 'Garsas įj.'
      : muted
      ? 'Sound off'
      : 'Sound on';

  const ariaLabel =
    locale === 'ru'
      ? muted
        ? 'Включить звуковые эффекты интерфейса'
        : 'Отключить звуковые эффекты интерфейса'
      : locale === 'lt'
      ? muted
        ? 'Įjungti svetainės garsus'
        : 'Išjungti svetainės garsus'
      : muted
      ? 'Unmute interface and scroll sounds'
      : 'Mute interface and scroll sounds';

  const variantClasses =
    variant === 'floating'
      ? 'hidden lg:inline-flex fixed bottom-6 right-6 z-30 h-9 px-4 bg-[#191B1A]/88 backdrop-blur-md text-[#F3EADA] border border-[#F3EADA]/20 hover:border-[#C98B54] hover:text-[#C98B54] active:scale-[0.97]'
      : 'inline-flex h-9 px-4 bg-[#F3EADA]/[0.06] backdrop-blur-md text-[#F3EADA]/85 border border-[#F3EADA]/22 hover:border-[#C98B54] hover:text-[#C98B54] active:scale-[0.97]';

  return (
    <button
      type="button"
      onClick={() => soundManager.toggle()}
      aria-pressed={!muted}
      aria-label={ariaLabel}
      data-sound-control="true"
      className={`${variantClasses} rounded-full transition-all items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C98B54] ${className}`.trim()}
    >
      {muted ? (
        <VolumeX className="w-3.5 h-3.5 text-[#F3EADA]/65" aria-hidden="true" />
      ) : (
        <Volume2 className="w-3.5 h-3.5 text-[#C98B54]" aria-hidden="true" />
      )}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
};
