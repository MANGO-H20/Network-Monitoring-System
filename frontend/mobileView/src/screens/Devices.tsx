import NetworkHealth from '../components/Devices/NetworkHealth.jsx';
import DeviceList from '../components/Devices/DeviceList.jsx';
import { common } from '../../assets/Theme.jsx';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetwork } from '../NetworkContext';

export default function DeviceScreen() {
  const insets = useSafeAreaInsets();
  const { devices } = useNetwork();
  return (
    <ScrollView
      style={common.screen}
      contentContainerStyle={{
        gap: 10,
        paddingTop: insets.top + 16,
        paddingHorizontal: 16,
      }}
    >
      <NetworkHealth devices={devices}></NetworkHealth>
      <DeviceList devices={devices}></DeviceList>
    </ScrollView>
  );
}
