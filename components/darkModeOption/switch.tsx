import { useColorScheme } from 'nativewind';

import { Switch } from '../ui/switch';

const DarkModeSwitch = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isOn = colorScheme === 'dark';

  return <Switch checked={isOn} onCheckedChange={toggleColorScheme} />;
};

export default DarkModeSwitch;
