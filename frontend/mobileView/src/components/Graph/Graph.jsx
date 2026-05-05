import VisNetwork from 'react-native-vis-network';
import { common } from '../../../assets/Theme.jsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const options = {
  nodes: {
    shape: 'image',
    size: 16,
    font: {
      color: '#00daf3',
      size: 10,
      face: 'monospace',
      vadjust: 0,
    },
    borderWidth: 2,
    color: {
      border: '#2a3540',
      highlight: { border: '#00daf3' },
    },
  },
};

function addImage(data) {
  data.nodes.forEach(node => {
    let file_path = 'file:///android_asset/';
    node.shape = 'image';
    node.image = file_path + node.type + '.png';
    delete node.type;
  });
  data.nodes = data.nodes.filter(d => !d.label.includes('10.'));
  data.edges = data.edges.filter(d => !d.to.includes('10.') && !d.from.includes('10.'));
  return data;
}

export default function Graph({ data }) {
  const insets = useSafeAreaInsets();
  const new_data = addImage(data);

  {
    /*
        {
            'nodes': [
                { 'id': ip,
                'label':  name ,
                'type' : device_type
                'image': file_path
                'shape': image} 
              ]
            'edges': [
                { 'to':src ,'from': dest } 
            ]
        }
    */
  }

  return (
    <>
      <VisNetwork
        style={[common.graph, { marginTop: insets.top + 16 }]}
        data={new_data}
        options={options}
      />
    </>
  );
}
