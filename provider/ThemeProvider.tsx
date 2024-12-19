import '~/global.css';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeProvider as RNThemeProvider } from '@react-navigation/native';
import { SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform } from 'react-native';

import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
  fonts: {
    regular: {
      fontFamily: '',
      fontWeight: 'bold'
    },
    medium: {
      fontFamily: '',
      fontWeight: 'bold'
    },
    bold: {
      fontFamily: '',
      fontWeight: 'bold'
    },
    heavy: {
      fontFamily: '',
      fontWeight: 'bold'
    }
  }
};

const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
  fonts: {
    regular: {
      fontFamily: '',
      fontWeight: 'bold'
    },
    medium: {
      fontFamily: '',
      fontWeight: 'bold'
    },
    bold: {
      fontFamily: '',
      fontWeight: 'bold'
    },
    heavy: {
      fontFamily: '',
      fontWeight: 'bold'
    }
  }
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

interface Props {
  children: React.ReactNode;
}

const ThemeProvider = (props: Props) => {
  const { setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  // Load theme from AsyncStorage on app start
  React.useEffect(() => {
    (async () => {
      const storedTheme = await AsyncStorage.getItem('theme');
      if (Platform.OS === 'web') {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add('bg-background');
      }

      if (storedTheme) {
        setColorScheme(storedTheme === 'dark' ? 'dark' : 'light');
      }

      setIsColorSchemeLoaded(true);
    })();
  }, []);

  // Save theme to AsyncStorage whenever it changes
  React.useEffect(() => {
    AsyncStorage.setItem('theme', isDarkColorScheme ? 'dark' : 'light');
  }, [isDarkColorScheme]);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <RNThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      {props.children}
    </RNThemeProvider>
  );
};

export { ThemeProvider };
