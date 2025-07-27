import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SectionHeader } from './ui';
import { theme } from '../styles/theme';

interface MatrixControlsProps {
  matrixEyeColor: string;
  matrixPupilColor: string;
  matrixHeartMode: boolean;
  matrixVisualizerMode: boolean;
  matrixClockMode: boolean;
  matrixClockColor: string;
  matrixHeartColor1: string;
  matrixHeartColor2: string;
  onMatrixEyeColorChange: (color: string) => void;
  onMatrixPupilColorChange: (color: string) => void;
  onMatrixHeartModeToggle: () => void;
  onMatrixVisualizerModeToggle: () => void;
  onMatrixClockModeToggle: () => void;
  onMatrixClockColorChange: (color: string) => void;
  onMatrixHeartColor1Change: (color: string) => void;
  onMatrixHeartColor2Change: (color: string) => void;
}

const MATRIX_COLORS = [
  { id: 'GREEN', color: theme.colors.success },
  { id: 'YELLOW', color: theme.colors.warning },
  { id: 'RED', color: theme.colors.error },
];


const EyeVisualization: React.FC<{
  eyeColor: string;
  pupilColor: string;
}> = ({ eyeColor, pupilColor }) => {
  const getActualColor = (colorId: string) => {
    const colorMap: { [key: string]: string } = {
      'GREEN': theme.colors.success,
      'YELLOW': theme.colors.warning,
      'RED': theme.colors.error,
    };
    return colorMap[colorId] || theme.colors.success;
  };

  const actualEyeColor = getActualColor(eyeColor);
  const actualPupilColor = getActualColor(pupilColor);
  const isPupilTransparent = eyeColor === pupilColor;

  // 8x8 pixel art eye pattern (based on Arduino blinkImg[0])
  const eyePattern = [
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,0,0]
  ];

  // Pupil position (centered, 2x2)
  const pupilX = 3;
  const pupilY = 3;

  const renderPixelEye = () => {
    const pixels = [];
    const pixelSize = 5;
    const gap = 1;

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (eyePattern[y][x] === 1) {
          // Check if this pixel is part of the pupil area
          const isPupilArea = x >= pupilX && x < pupilX + 2 && 
            y >= pupilY && y < pupilY + 2;
          
          // Only render non-pupil pixels when colors match (transparent pupil)
          if (isPupilTransparent && isPupilArea) {
            continue; // Skip rendering this pixel to make pupil transparent
          }
          
          pixels.push(
            <View
              key={`${x}-${y}`}
              style={[
                styles.pixel,
                {
                  backgroundColor: isPupilArea ? actualPupilColor : actualEyeColor,
                  left: x * (pixelSize + gap),
                  top: y * (pixelSize + gap),
                  width: pixelSize,
                  height: pixelSize,
                }
              ]}
            />
          );
        }
      }
    }
    return pixels;
  };

  return (
    <View style={styles.eyeContainer}>
      <View style={styles.pixelEye}>
        {renderPixelEye()}
      </View>
      <View style={styles.pixelEye}>
        {renderPixelEye()}
      </View>
    </View>
  );
};

const HeartVisualization: React.FC<{
  heartColor1: string;
  heartColor2: string;
}> = ({ heartColor1, heartColor2 }) => {
  const getActualColor = (colorId: string) => {
    const colorMap: { [key: string]: string } = {
      'GREEN': theme.colors.success,
      'YELLOW': theme.colors.warning,
      'RED': theme.colors.error,
    };
    return colorMap[colorId] || theme.colors.error;
  };

  const actualColor1 = getActualColor(heartColor1);
  const actualColor2 = getActualColor(heartColor2);
  const isDualColor = heartColor1 !== heartColor2;

  // 8x8 pixel art heart pattern (Frame 3 - Large heart from Arduino)
  const heartFillPattern = [
    [0,1,1,0,0,1,1,0],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,1,1,0,0,0]
  ];

  // Heart outline pattern (for dual color effect)
  const heartOutlinePattern = [
    [0,1,1,0,0,1,1,0],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [0,1,0,0,0,0,1,0],
    [0,0,1,0,0,1,0,0],
    [0,0,0,1,1,0,0,0]
  ];

  const renderPixelHeart = () => {
    const pixels = [];
    const pixelSize = 5;
    const gap = 1;

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        // For dual color mode, check if pixel is outline or fill
        if (isDualColor) {
          if (heartOutlinePattern[y][x] === 1) {
            // Outline pixel
            pixels.push(
              <View
                key={`${x}-${y}`}
                style={[
                  styles.pixel,
                  {
                    backgroundColor: actualColor2,
                    left: x * (pixelSize + gap),
                    top: y * (pixelSize + gap),
                    width: pixelSize,
                    height: pixelSize,
                  }
                ]}
              />
            );
          } else if (heartFillPattern[y][x] === 1) {
            // Fill pixel (inside the outline)
            pixels.push(
              <View
                key={`${x}-${y}`}
                style={[
                  styles.pixel,
                  {
                    backgroundColor: actualColor1,
                    left: x * (pixelSize + gap),
                    top: y * (pixelSize + gap),
                    width: pixelSize,
                    height: pixelSize,
                  }
                ]}
              />
            );
          }
        } else {
          // Single color mode - just use the fill pattern
          if (heartFillPattern[y][x] === 1) {
            pixels.push(
              <View
                key={`${x}-${y}`}
                style={[
                  styles.pixel,
                  {
                    backgroundColor: actualColor1,
                    left: x * (pixelSize + gap),
                    top: y * (pixelSize + gap),
                    width: pixelSize,
                    height: pixelSize,
                  }
                ]}
              />
            );
          }
        }
      }
    }
    return pixels;
  };

  return (
    <View style={styles.heartContainer}>
      <View style={styles.pixelHeart}>
        {renderPixelHeart()}
      </View>
    </View>
  );
};


const HeartEyeVisualization: React.FC<{
  heartColor: string;
  pupilColor: string;
}> = ({ heartColor, pupilColor }) => {
  const getActualColor = (colorId: string) => {
    const colorMap: { [key: string]: string } = {
      'GREEN': theme.colors.success,
      'YELLOW': theme.colors.warning,
      'RED': theme.colors.error,
    };
    return colorMap[colorId] || theme.colors.error;
  };

  const actualHeartColor = getActualColor(heartColor);
  const actualPupilColor = getActualColor(pupilColor);
  const isPupilTransparent = heartColor === pupilColor;

  // 8x8 pixel art heart pattern (large heart from Arduino)
  const heartPattern = [
    [0,1,1,0,0,1,1,0],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,1,1,0,0,0]
  ];

  // Pupil position (2x2 area within heart)
  const pupilX = 3;
  const pupilY = 4;

  const renderPixelHeartEye = () => {
    const pixels = [];
    const pixelSize = 5;
    const gap = 1;

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (heartPattern[y][x] === 1) {
          // Check if this pixel is part of the pupil area
          const isPupilArea = x >= pupilX && x < pupilX + 2 && 
            y >= pupilY && y < pupilY + 2;
          
          // Only render non-pupil pixels when colors match (transparent pupil)
          if (isPupilTransparent && isPupilArea) {
            continue; // Skip rendering this pixel to make pupil transparent
          }
          
          pixels.push(
            <View
              key={`${x}-${y}`}
              style={[
                styles.pixel,
                {
                  backgroundColor: isPupilArea ? actualPupilColor : actualHeartColor,
                  left: x * (pixelSize + gap),
                  top: y * (pixelSize + gap),
                  width: pixelSize,
                  height: pixelSize,
                }
              ]}
            />
          );
        }
      }
    }
    return pixels;
  };

  return (
    <View style={styles.heartEyeContainer}>
      <View style={styles.pixelHeartEye}>
        {renderPixelHeartEye()}
      </View>
    </View>
  );
};

const ClockVisualization: React.FC<{
  clockColor: string;
}> = ({ clockColor }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every second for live preview
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Get current time for visualization
  let hour = currentTime.getHours();
  const minute = currentTime.getMinutes();
  
  // Convert to 12-hour format
  if (hour === 0) hour = 12;
  else if (hour > 12) hour = hour - 12;
  
  // Extract digits (always show leading zeros)
  const hourTens = Math.floor(hour / 10);
  const hourOnes = hour % 10;
  const minuteTens = Math.floor(minute / 10);
  const minuteOnes = minute % 10;
  
  // Exact 4x8 digit patterns matching Arduino code
  const digitPatterns: { [key: number]: number[][] } = {
    0: [
      [0,1,1,0], [1,0,0,1], [1,0,0,1], [1,0,0,1],
      [1,0,0,1], [1,0,0,1], [1,0,0,1], [0,1,1,0]
    ],
    1: [
      [0,1,0,0], [1,1,0,0], [0,1,0,0], [0,1,0,0],
      [0,1,0,0], [0,1,0,0], [0,1,0,0], [1,1,1,1]
    ],
    2: [
      [0,1,1,0], [1,0,0,1], [0,0,0,1], [0,0,1,0],
      [0,1,0,0], [1,0,0,0], [1,0,0,0], [1,1,1,1]
    ],
    3: [
      [0,1,1,0], [1,0,0,1], [0,0,0,1], [0,1,1,0],
      [0,0,0,1], [0,0,0,1], [1,0,0,1], [0,1,1,0]
    ],
    4: [
      [1,0,0,1], [1,0,0,1], [1,0,0,1], [1,1,1,1],
      [0,0,0,1], [0,0,0,1], [0,0,0,1], [0,0,0,1]
    ],
    5: [
      [1,1,1,1], [1,0,0,0], [1,0,0,0], [1,1,1,0],
      [0,0,0,1], [0,0,0,1], [1,0,0,1], [0,1,1,0]
    ],
    6: [
      [0,1,1,0], [1,0,0,1], [1,0,0,0], [1,1,1,0],
      [1,0,0,1], [1,0,0,1], [1,0,0,1], [0,1,1,0]
    ],
    7: [
      [1,1,1,1], [0,0,0,1], [0,0,0,1], [0,0,1,0],
      [0,0,1,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]
    ],
    8: [
      [0,1,1,0], [1,0,0,1], [1,0,0,1], [0,1,1,0],
      [1,0,0,1], [1,0,0,1], [1,0,0,1], [0,1,1,0]
    ],
    9: [
      [0,1,1,0], [1,0,0,1], [1,0,0,1], [1,0,0,1],
      [0,1,1,1], [0,0,0,1], [1,0,0,1], [0,1,1,0]
    ]
  };
  
  const renderMatrix = (leftDigit: number, rightDigit: number, label: string) => {
    const pixels = [];
    const pixelSize = 4;
    const gap = 1;
    
    // Render 8x8 matrix
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        let isOn = false;
        
        if (x < 4) {
          // Left digit (columns 0-3)
          isOn = digitPatterns[leftDigit][y][x] === 1;
        } else {
          // Right digit (columns 4-7)
          isOn = digitPatterns[rightDigit][y][x - 4] === 1;
        }
        
        // Get the actual colors for display
        const getDisplayColor = (colorId: string) => {
          const colorMap: { [key: string]: string } = {
            'GREEN': theme.colors.success,
            'YELLOW': theme.colors.warning,
            'RED': theme.colors.error,
          };
          return colorMap[colorId] || theme.colors.success;
        };

        const onColor = getDisplayColor(clockColor);
        const offColor = 'transparent';

        pixels.push(
          <View
            key={`${x}-${y}`}
            style={[
              styles.matrixPixel,
              {
                backgroundColor: isOn ? onColor : offColor,
                left: x * (pixelSize + gap),
                top: y * (pixelSize + gap),
                width: pixelSize,
                height: pixelSize,
                borderWidth: !isOn ? 1 : 0,
                borderColor: theme.colors.border,
              }
            ]}
          />
        );
      }
    }
    
    return (
      <View style={styles.clockMatrixContainer}>
        <View style={styles.pixelMatrix}>
          {pixels}
        </View>
        <Text style={styles.clockLabel}>{label}</Text>
      </View>
    );
  };
  
  // Format time display
  const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  const ampm = currentTime.getHours() >= 12 ? 'PM' : 'AM';
  
  return (
    <View style={styles.clockContainer}>
      <Text style={styles.clockTime}>{timeString} {ampm}</Text>
      <View style={styles.clockMatrices}>
        {renderMatrix(hourTens, hourOnes, 'HOURS')}
        {renderMatrix(minuteTens, minuteOnes, 'MINUTES')}
      </View>
    </View>
  );
};

export const MatrixControls: React.FC<MatrixControlsProps> = ({
  matrixEyeColor,
  matrixPupilColor,
  matrixHeartMode,
  matrixVisualizerMode,
  matrixClockMode,
  matrixClockColor,
  matrixHeartColor1,
  matrixHeartColor2,
  onMatrixEyeColorChange,
  onMatrixPupilColorChange,
  onMatrixHeartModeToggle,
  onMatrixVisualizerModeToggle,
  onMatrixClockModeToggle,
  onMatrixClockColorChange,
  onMatrixHeartColor1Change,
  onMatrixHeartColor2Change,
}) => {
  return (
    <View style={styles.container}>
      <SectionHeader 
        title="Matrix Eyes" 
        icon="👁️"
        color={theme.colors.matrix}
      />

      {/* Animation Mode Toggle */}
      <View style={styles.modeToggleContainer}>
        <TouchableOpacity
          style={[
            styles.modeToggleButton4,
            !matrixHeartMode && !matrixVisualizerMode && !matrixClockMode && styles.activeModeButton
          ]}
          onPress={() => {
            if (matrixHeartMode) onMatrixHeartModeToggle();
            if (matrixVisualizerMode) onMatrixVisualizerModeToggle();
            if (matrixClockMode) onMatrixClockModeToggle();
          }}
        >
          <Text style={styles.modeToggleIcon}>👁️</Text>
          <Text style={[
            styles.modeToggleText,
            !matrixHeartMode && !matrixVisualizerMode && !matrixClockMode && styles.activeModeText
          ]}>Eyes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.modeToggleButton4,
            matrixHeartMode && styles.activeModeButton
          ]}
          onPress={() => {
            if (!matrixHeartMode) onMatrixHeartModeToggle();
            if (matrixVisualizerMode) onMatrixVisualizerModeToggle();
            if (matrixClockMode) onMatrixClockModeToggle();
          }}
        >
          <Text style={styles.modeToggleIcon}>💖</Text>
          <Text style={[
            styles.modeToggleText,
            matrixHeartMode && styles.activeModeText
          ]}>Hearts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeToggleButton4,
            matrixVisualizerMode && styles.activeModeButton
          ]}
          onPress={() => {
            if (!matrixVisualizerMode) onMatrixVisualizerModeToggle();
            if (matrixHeartMode) onMatrixHeartModeToggle();
            if (matrixClockMode) onMatrixClockModeToggle();
          }}
        >
          <Text style={styles.modeToggleIcon}>💘</Text>
          <Text style={[
            styles.modeToggleText,
            matrixVisualizerMode && styles.activeModeText
          ]}>💘Eye</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeToggleButton4,
            matrixClockMode && styles.activeModeButton
          ]}
          onPress={() => {
            if (!matrixClockMode) onMatrixClockModeToggle();
            if (matrixHeartMode) onMatrixHeartModeToggle();
            if (matrixVisualizerMode) onMatrixVisualizerModeToggle();
          }}
        >
          <Text style={styles.modeToggleIcon}>🕐</Text>
          <Text style={[
            styles.modeToggleText,
            matrixClockMode && styles.activeModeText
          ]}>Clock</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContainer}>
        {/* Matrix Visualization */}
        {matrixClockMode ? (
          <ClockVisualization 
            clockColor={matrixClockColor}
          />
        ) : matrixVisualizerMode ? (
          <HeartEyeVisualization
            heartColor={matrixHeartColor1}
            pupilColor={matrixPupilColor}
          />
        ) : !matrixHeartMode ? (
          <EyeVisualization 
            eyeColor={matrixEyeColor}
            pupilColor={matrixPupilColor}
          />
        ) : (
          <HeartVisualization
            heartColor1={matrixHeartColor1}
            heartColor2={matrixHeartColor2}
          />
        )}

        {/* Color Selection */}
        <View style={styles.colorControls}>
          {matrixClockMode ? (
            <>
              {/* Clock Color Selection */}
              <View style={styles.colorRow}>
                <Text style={styles.colorLabel}>Color</Text>
                <View style={styles.colorOptions}>
                  {MATRIX_COLORS.map(color => (
                    <TouchableOpacity
                      key={color.id}
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: color.color },
                        matrixClockColor === color.id && styles.selectedSwatch,
                      ]}
                      onPress={() => onMatrixClockColorChange(color.id)}
                    />
                  ))}
                </View>
              </View>
            </>
          ) : matrixVisualizerMode ? (
            <>
              {/* Heart-Eye Color Selection */}
              <View style={styles.colorRow}>
                <Text style={styles.colorLabel}>Heart</Text>
                <View style={styles.colorOptions}>
                  {MATRIX_COLORS.map(color => (
                    <TouchableOpacity
                      key={color.id}
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: color.color },
                        matrixHeartColor1 === color.id && styles.selectedSwatch,
                      ]}
                      onPress={() => onMatrixHeartColor1Change(color.id)}
                    />
                  ))}
                </View>
              </View>

              {/* Pupil Color Selection */}
              <View style={styles.colorRow}>
                <Text style={styles.colorLabel}>Pupil</Text>
                <View style={styles.colorOptions}>
                  {MATRIX_COLORS.map(color => (
                    <TouchableOpacity
                      key={color.id}
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: color.color },
                        matrixPupilColor === color.id && styles.selectedSwatch,
                      ]}
                      onPress={() => onMatrixPupilColorChange(color.id)}
                    />
                  ))}
                </View>
              </View>
            </>
          ) : !matrixHeartMode ? (
            <>
              {/* Eye Color Selection */}
              <View style={styles.colorRow}>
                <Text style={styles.colorLabel}>Eye</Text>
                <View style={styles.colorOptions}>
                  {MATRIX_COLORS.map(color => (
                    <TouchableOpacity
                      key={color.id}
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: color.color },
                        matrixEyeColor === color.id && styles.selectedSwatch,
                      ]}
                      onPress={() => onMatrixEyeColorChange(color.id)}
                    />
                  ))}
                </View>
              </View>

              {/* Pupil Color Selection */}
              <View style={styles.colorRow}>
                <Text style={styles.colorLabel}>Pupil</Text>
                <View style={styles.colorOptions}>
                  {MATRIX_COLORS.map(color => (
                    <TouchableOpacity
                      key={color.id}
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: color.color },
                        matrixPupilColor === color.id && styles.selectedSwatch,
                      ]}
                      onPress={() => onMatrixPupilColorChange(color.id)}
                    />
                  ))}
                </View>
              </View>
            </>
          ) : (
            <>
              {/* Heart Color 1 Selection */}
              <View style={styles.colorRow}>
                <Text style={styles.colorLabel}>Fill</Text>
                <View style={styles.colorOptions}>
                  {MATRIX_COLORS.map(color => (
                    <TouchableOpacity
                      key={color.id}
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: color.color },
                        matrixHeartColor1 === color.id && styles.selectedSwatch,
                      ]}
                      onPress={() => onMatrixHeartColor1Change(color.id)}
                    />
                  ))}
                </View>
              </View>

              {/* Heart Color 2 Selection */}
              <View style={styles.colorRow}>
                <Text style={styles.colorLabel}>Edge</Text>
                <View style={styles.colorOptions}>
                  {MATRIX_COLORS.map(color => (
                    <TouchableOpacity
                      key={color.id}
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: color.color },
                        matrixHeartColor2 === color.id && styles.selectedSwatch,
                      ]}
                      onPress={() => onMatrixHeartColor2Change(color.id)}
                    />
                  ))}
                </View>
              </View>
            </>
            )}
          </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
    marginHorizontal: theme.spacing.sm,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: 4,
  },
  modeToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    gap: theme.spacing.xs,
  },
  modeToggleButton3: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    gap: 2,
  },
  modeToggleButton4: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: 2,
    borderRadius: theme.borderRadius.sm,
    gap: 1,
  },
  activeModeButton: {
    backgroundColor: theme.colors.primary,
  },
  modeToggleIcon: {
    fontSize: 16,
  },
  modeToggleText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  activeModeText: {
    color: theme.colors.textInverse,
  },
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  pixelEye: {
    width: 48,
    height: 48,
    position: 'relative',
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    ...theme.shadows.sm,
  },
  pixel: {
    position: 'absolute',
    borderRadius: 1,
  },
  heartContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  pixelHeart: {
    width: 48,
    height: 48,
    position: 'relative',
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    ...theme.shadows.sm,
  },
  heartEyeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  pixelHeartEye: {
    width: 48,
    height: 48,
    position: 'relative',
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    ...theme.shadows.sm,
  },
  colorControls: {
    flex: 1.2,
    marginLeft: theme.spacing.md,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  colorLabel: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    width: 40,
    fontSize: 12,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    flex: 1,
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  selectedSwatch: {
    borderColor: theme.colors.textPrimary,
    borderWidth: 3,
    transform: [{ scale: 1.1 }],
  },
  clockContainer: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: theme.spacing.sm,
  },
  clockTime: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  clockMatrices: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  clockMatrixContainer: {
    alignItems: 'center',
  },
  clockLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontSize: 9,
    marginTop: 4,
    fontWeight: '500',
  },
  pixelMatrix: {
    width: 40,
    height: 40,
    position: 'relative',
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    ...theme.shadows.sm,
  },
  matrixPixel: {
    position: 'absolute',
    borderRadius: 0.5,
  },
});