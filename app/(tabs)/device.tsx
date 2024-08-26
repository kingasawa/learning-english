import { View, FlatList, Text, StyleSheet } from 'react-native';
import * as Device from 'expo-device';

export default function DeviceScreen() {

  interface ItemTypes {
    id: number;
    title: string;
    value: string;
  }

  const DATA: ItemTypes[] = [
    { id: 1, title: 'Branch', value: Device.brand },
    { id: 2, title: 'Device Name', value: Device.deviceName },
    { id: 3, title: 'OS', value: Device.osName },
    { id: 4, title: 'Model Name', value: Device.modelName },
    { id: 5, title: 'Model ID', value: Device.modelId },
    { id: 6, title: 'Version', value: Device.osVersion },
    { id: 7, title: 'Memory', value: Device.totalMemory },
  ];

  const renderItem = ({ item }: { item: ItemTypes }) => (
    <View key={item.id} style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.id}>{item.value}</Text>
    </View>
  );

  const ListScreen = () => {
    return (
      <View style={styles.container}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    );
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ededed',
    },
    title: {
      fontSize: 18,
    },
    id: {
      fontSize: 18,
      color: '#888', // Optional: add color to differentiate the id
    },
  });
  return <ListScreen />;
}
