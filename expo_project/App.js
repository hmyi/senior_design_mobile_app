import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Button, Image, TextInput} from 'react-native';
import {Camera} from 'expo-camera';

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(null);

  const [iteration, setIteration] = useState(10);
  const [wait, setWait] = useState(250);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  const delay = async (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))

  async function takePicture() {
    for (let i = 0; i < iteration; i += 1) {
      if (camera) {
        const data = await camera.takePictureAsync(null);
        setImage(data.uri);
      }
      await delay(wait)
    }
  }

  if (hasCameraPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera 
          ref={ref => setCamera(ref)}
          style={styles.fixedRatio} 
          type={type}
          ratio={'1:1'}
        />
      </View>

      <Text>Enter number of pictures:</Text>

      <TextInput
        style={styles.input}
        value={iteration}
        onChangeText={(value) => setIteration(value)}
      />

      <Text>Enter wait time between pictures (in ms):</Text>

      <TextInput
        style={styles.input}
        value={wait}
        onChangeText={(value) => setWait(value)}
      />

      {/* <Button
        title = "Flip Camera"
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}>
      </Button> */}

      <Button
        title="Start Taking Pictures"
        onPress={() => takePicture()}
      />

      <Image
        source={{uri: image}}
        style={{flex: 1}}
      />

      {/* <StatusBar style="auto" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 40
  },
  input: {
    borderColor: "gray",
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  }
})
