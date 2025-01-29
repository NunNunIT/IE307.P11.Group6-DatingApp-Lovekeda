import { useColorScheme } from 'nativewind';
import { Pressable, Text } from 'react-native';

const DarkModeText = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Pressable
      onPress={toggleColorScheme}
      className="mr-2 h-6 flex-1 items-center justify-center bg-transparent">
      <Text selectable={false} className="text-black dark:text-white">
        {colorScheme === 'dark' ? 'Dark Mode!🌙' : 'Light Mode!🌞'}
      </Text>
    </Pressable>
  );
};

export default DarkModeText;