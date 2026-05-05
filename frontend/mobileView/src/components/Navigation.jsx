import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from '../screens/Home';
import DeviceScreen from '../screens/Devices.tsx';
import GraphScreen from '../screens/GraphScreen.jsx';
import Analytics from '../screens/Analytics.tsx';

const ICONS = {
  Home: { active: 'home', inactive: 'home-outline' },
  Analytics: { active: 'chart-bar', inactive: 'chart-bar' },
  Devices: { active: 'devices', inactive: 'devices' },
  Graph: { active: 'graph', inactive: 'graph' },
};

//  Custom tab button
function TabIcon({ route, focused }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <MaterialCommunityIcons
        name={focused ? ICONS[route.name].active : ICONS[route.name].inactive}
        size={22}
        color={focused ? '#00daf3' : '#94a3b8'}
      />
    </View>
  );
}

//  Navigator
const Tab = createBottomTabNavigator();

function Tabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarIcon: ({ focused, color }) => (
          <TabIcon route={route} focused={focused} color={color} />
        ),

        tabBarActiveTintColor: '#00daf3',
        tabBarInactiveTintColor: '#94a3b8',

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          letterSpacing: 0.2,
          marginTop: 2,
        },

        tabBarStyle: {
          backgroundColor: '#101418',
          borderTopWidth: 0.5,
          borderTopColor: 'rgba(0, 218, 243, 0.15)',
          height: 64 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          paddingHorizontal: 8,
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Analytics" component={Analytics} />
      <Tab.Screen name="Devices" component={DeviceScreen} />
      <Tab.Screen name="Graph" component={GraphScreen} />
    </Tab.Navigator>
  );
}

export default function Navigator() {
  return (
    <NavigationContainer>
      <Tabs />
    </NavigationContainer>
  );
}

//  Styles
const styles = StyleSheet.create({
  iconWrap: {
    width: 48,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(0, 218, 243, 0.12)',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 218, 243, 0.25)',
    // Cyan glow
    shadowRadius: 8,
    elevation: 4,
  },
});
