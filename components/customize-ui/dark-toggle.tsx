import { MoonStar } from '../../lib/icons/MoonStar';
import { Sun } from '../../lib/icons/Sun';
import { Toggle, ToggleIcon } from '../ui/toggle';

import { useColorScheme } from '~/lib/useColorScheme';
import { cn } from '~/lib/utils';

export const DarkToggle = ({ className }: { className?: string }) => {
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Toggle
      className={cn('bg-transparent', className)}
      pressed={isDarkColorScheme}
      onPressedChange={toggleColorScheme}
      aria-label="Toggle bold"
      variant="default">
      <ToggleIcon icon={isDarkColorScheme ? MoonStar : Sun} size={18} />
    </Toggle>
  );
};
