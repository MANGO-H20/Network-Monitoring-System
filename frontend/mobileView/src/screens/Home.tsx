import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useNetwork } from '../NetworkContext';
import WarningsScreen from '../components/Home/HomeWarnings.jsx';
import {
  NewDevicesCard,
  ActiveDevicesCard,
} from '../components/Home/HomeDevices.jsx';
import { common, colours } from '../../assets/Theme.jsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Home() {
  const { devices, warnings, connected, new_devices } = useNetwork();
  const insets = useSafeAreaInsets();
  return (
    <>
      <ScrollView
        style={common.screen}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          gap: 10,
        }}
      >
        {connected ? (
          <Text style={[common.dataLabel, { color: colours.success }]}>
            CONNECTED
          </Text>
        ) : (
          <Text style={[common.dataLabel, { color: colours.alert }]}>
            NO CONNECTION
          </Text>
        )}
        <WarningsScreen warnings={warnings}></WarningsScreen>
        <ActiveDevicesCard devices={devices}></ActiveDevicesCard>
        <NewDevicesCard new_devices={new_devices}></NewDevicesCard>
      </ScrollView>
    </>
  );
}
