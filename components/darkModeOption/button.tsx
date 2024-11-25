import { useColorScheme } from 'nativewind';
import { View } from 'react-native';

import { Button } from '../ui/button';

import { Moon, Sun } from '@/lib/icons/IconList';

const DarkModeButton = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button onPress={toggleColorScheme} className="rounded-full" size="icon" variant="secondary">
      <View>
        {colorScheme === 'dark' ? (
          <Moon className="text-zinc-800 dark:text-zinc-200" />
        ) : (
          <Sun className="text-zinc-800 dark:text-zinc-200" />
        )}
      </View>
    </Button>
  );
};

export default DarkModeButton;
