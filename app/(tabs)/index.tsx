// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { Dimensions } from 'react-native';

export default function TabOneScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [redParts, setRedParts] = useState([]);
  const [isFaceInRedPart, setIsFaceInRedPart] = useState(
    Array(9).fill(true) // Initialize to true for all cells
  );

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
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
    console.log('Red Parts Indices:', randomIndices); // Check the generated indices
    setRedParts(randomIndices);
  }, []);


  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // Check if a point (x, y) is inside the grid cell with index cellIndex
  const isInsideGrid = (cellIndex, x, y) => {
    // Calculate the cell's position based on cellIndex (assuming a 3x3 grid)
    const cellRow = Math.floor(cellIndex / 3);
    const cellCol = cellIndex % 3;
    const cellWidth = screenWidth / 3; // Assuming the screen is divided into 3 columns
    const cellHeight = screenHeight / 3; // Assuming the screen is divided into 3 rows

    // Calculate the boundaries of the cell
    const cellLeft = cellCol * cellWidth;
    const cellRight = (cellCol + 1) * cellWidth;
    const cellTop = cellRow * cellHeight;
    const cellBottom = (cellRow + 1) * cellHeight;

    // Check if the point (x, y) is within the cell boundaries
    return x >= cellLeft && x < cellRight && y >= cellTop && y < cellBottom;
  };


  const handleFacesDetected = ({ faces }) => {
    // Initialize a copy of isFaceInRedPart to true for all cells
    const updatedIsFaceInRedPart = [...isFaceInRedPart];

    // Iterate through grid cells and check if the face is within the red parts
    for (let i = 0; i < 9; i++) {
      updatedIsFaceInRedPart[i] = true; // Assume the face is not in the red part

      faces.forEach((face) => {
        const { origin } = face.bounds;

        if (isInsideGrid(i, origin.x, origin.y) && redParts.includes(i)) {
          // Face is inside a red part, mark it as false
          updatedIsFaceInRedPart[i] = false;
        }
      });
    }

    // Update the state with the updated values
    setIsFaceInRedPart(updatedIsFaceInRedPart);
  };



  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={type}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
          minDetectionInterval: 100,
          tracking: true,
        }}
      >
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
                        !isFaceInRedPart[i * 3 + j] && styles.greenColumn,
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
  greenColumn: {
    backgroundColor: 'green',
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
