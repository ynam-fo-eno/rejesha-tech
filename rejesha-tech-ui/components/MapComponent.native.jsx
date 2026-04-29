import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

export default function MapComponent() {
  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -1.4483,
          longitude: 36.9613,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={{ latitude: -1.4483, longitude: 36.9613 }} title="Rejesha Main Workshop" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: { height: 200, borderRadius: 15, overflow: 'hidden', marginBottom: 30 },
  map: { width: '100%', height: '100%' },
});