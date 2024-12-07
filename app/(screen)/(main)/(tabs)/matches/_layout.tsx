import type {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme, type ParamListBase, type TabNavigationState } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
import { Dimensions } from 'react-native';

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function CategoriesLayoutScreen() {
  const { colors } = useTheme();
  const width = Dimensions.get('window').width;
  const TAB_COUNT = 3;

  return (
    <MaterialTopTabs
      className="flex-1"
      tabBarPosition="top"
      screenOptions={{
        tabBarStyle: { width, maxWidth: width, minWidth: width },
        tabBarActiveTintColor: '#fe183c',
        tabBarInactiveTintColor: 'grey',
        tabBarIndicatorStyle: {
          minWidth: width / 2 ,
          backgroundColor: '#fe183c',
        },
        tabBarScrollEnabled: true,
        tabBarLabelStyle: {
          fontSize: 14,
          alignItems: 'center',
          justifyContent: 'center',
          textTransform: 'capitalize',
          fontWeight: 'bold',
        },
        tabBarItemStyle: { width: width / 2 },
      }}>
      <MaterialTopTabs.Screen name="index" options={{ title: 'Lượt Match' }} />
      <MaterialTopTabs.Screen name="like" options={{ title: 'Ai thích bạn' }} />
    </MaterialTopTabs>
  );
}
