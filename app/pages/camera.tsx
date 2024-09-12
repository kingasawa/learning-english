import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [frameColor, setFrameColor] = useState('red');
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const isInFrame = (bounds: any) => {
    const frameSize = width;
    const frameMargin = 0.1 * width; // Khoảng cách từ cạnh khung

    // Lấy các điểm của mã QR
    const { origin, size } = bounds;
    const qrLeft = origin.x;
    const qrTop = origin.y;
    const qrRight = origin.x + size.width;
    const qrBottom = origin.y + size.height;

    // Tính toán các điểm của khung
    const frameLeft = frameMargin;
    const frameTop = frameMargin;
    const frameRight = 400;
    const frameBottom = 550;
    // Kiểm tra xem mã QR có nằm trong khung không
    return (
      qrLeft >= frameLeft &&
      qrTop >= frameTop &&
      qrRight <= frameRight &&
      qrBottom <= frameBottom
    );
  };

  const handleBarCodeScanned = (data: any) => {
    console.log('data', data);
    if (isInFrame(data.bounds)) {
      setFrameColor('green');
      alert(`Bar code with type ${data.type} and data ${data.data} has been scanned!`);
    } else {
      setFrameColor('red');
    }
    setScanned(true);
  };

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  function handleScannedAgain() {
    setScanned(false);
    setFrameColor('red');
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={ scanned ? undefined : handleBarCodeScanned }
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      <View style={[styles.qrCodeFrame, { borderColor: frameColor }]} />
      {scanned && <Button title={'Tap to Scan Again'} onPress={handleScannedAgain} />}
    </View>
  );
}

const { width } = Dimensions.get('window');
const qrSize = width * 0.7; // Kích thước của khung QR

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  qrCodeFrame: {
    position: 'absolute',
    width: qrSize,
    height: qrSize,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 10,
    borderStyle: 'dashed',
    left: '15%'
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
