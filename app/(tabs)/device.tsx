import { View, FlatList, Text, StyleSheet } from 'react-native';
import * as Device from 'expo-device';

export default function DeviceScreen() {

  const DATA = [
    { id: 1, text: 'Branch', value: Device.brand },
    { id: 2, text: 'Device Name', value: Device.deviceName },
    { id: 3, text: 'OS', value: Device.osName },
    { id: 4, text: 'Model Name', value: Device.modelName },
    { id: 5, text: 'Model ID', value: Device.modelId },
    { id: 6, text: 'Version', value: Device.osVersion },
    { id: 7, text: 'Memory', value: Device.totalMemory },
  ];

  const renderItem = ({ item }) => (
    <View key={item.id} style={styles.item}>
      <Text style={styles.title}>{item.text}</Text>
      <Text style={styles.id}>{item.value}</Text>
    </View>
  );

  const ListScreen = () => {
    return (
      <View style={styles.container}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
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
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    title: {
      fontSize: 18,
    },
    id: {
      fontSize: 18,
      color: '#888', // Optional: add color to differentiate the id
    },
  });

  // return (
  //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //     <ThemedText>
  //       Branch: {Device.brand}
  //     </ThemedText>
  //     <ThemedText>
  //       Device Name: {Device.deviceName}
  //     </ThemedText>
  //     <ThemedText>
  //       OS: {Device.osName}
  //     </ThemedText>
  //     <ThemedText>
  //       Model Name: {Device.modelName}
  //     </ThemedText>
  //     <ThemedText>
  //       Model ID: {Device.modelId}
  //     </ThemedText>
  //     <ThemedText>
  //       Version: {Device.osVersion}
  //     </ThemedText>
  //     <ThemedText>
  //       Memory: {Device.totalMemory}
  //     </ThemedText>
  //   </View>
  // );
  return <ListScreen />;
}
