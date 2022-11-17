// import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Button, Image, TextInput, Keyboard, TouchableWithoutFeedback} from 'react-native';
import {Camera} from 'expo-camera';

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);

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
          type={cameraType}
          ratio={'1:1'}
          style={styles.fixedRatio}
        />
      </View>

      <Text style={styles.text}>Number of photos:</Text>

      <TextInput
        value={iteration}
        onChangeText={(value) => setIteration(value)}
        keyboardType="numeric"
        returnKeyType="done"
        style={styles.textInput}
      />

      <Text style={styles.text}>Time between photos in ms:</Text>

      <TextInput
        value={wait}
        onChangeText={(value) => setWait(value)}
        keyboardType="numeric"
        returnKeyType="done"
        style={styles.textInput}
      />

      {/* <Button
        title = "Flip Camera"
        onPress={() => {
          setCameraType(
            cameraType === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}>
      </Button> */}

      <Button
        title='Start Taking Photos'
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
  cameraContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black'
  },
  textInput: {
    borderColor: 'gray',
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 5
  },
  // button: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   paddingVertical: 12,
  //   paddingHorizontal: 32,
  //   borderRadius: 4,
  //   elevation: 3,
  //   backgroundColor: 'black',
  // },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  }
})
