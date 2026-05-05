import Graph from '../components/Graph/Graph.jsx';
import { useNetwork } from '../NetworkContext.jsx';
import { common } from '../../assets/Theme.jsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';

export default function GraphScreen() {
  const { node_graph } = useNetwork();
  const insets = useSafeAreaInsets();
  return (
    <>
      <View
        style={common.screen}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
        }}
      >
        <Graph data={node_graph}></Graph>
      </View>
    </>
  );
}
