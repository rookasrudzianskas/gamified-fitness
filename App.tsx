// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [redParts, setRedParts] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    // Generate random indices for red parts
    const randomIndices = [];
    while (randomIndices.length < 3) {
      const randomIndex = Math.floor(Math.random() * 9); // Assuming a 3x3 grid
      if (!randomIndices.includes(randomIndex)) {
        randomIndices.push(randomIndex);
      }
    }
    setRedParts(randomIndices);
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type}>
        <View style={styles.container}>
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <View style={styles.cameraSection} key={i}>
                {Array(3)
                  .fill(0)
                  .map((_, j) => (
                    <View
                      style={[
                        styles.column,
                        redParts.includes(i * 3 + j) && styles.redColumn,
                      ]}
                      key={j}
                    ></View>
                  ))}
              </View>
            ))}
        </View>
      </Camera>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <Text style={styles.text}>Flip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', // To create columns
    backgroundColor: 'transparent',
  },
  cameraSection: {
    flex: 1,
    flexDirection: 'row', // To create lines
  },
  column: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'red',
  },
  redColumn: {
    backgroundColor: 'red',
  },
  buttonContainer: {
    flex: 0.1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
