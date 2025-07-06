# ESP32 LED Controller React Native App

A React Native mobile application to control LED strips connected to an ESP32 device via Bluetooth.

## Features

- **Bluetooth Management**: Enable/disable Bluetooth and scan for devices
- **Device Connection**: Connect to your ESP32 device
- **LED Controls**: Toggle LEDs on/off
- **Color Picker**: Real-time color selection with color wheel
- **Preset Colors**: Quick access to common colors
- **Dark Mode Support**: Automatic theme switching
- **Connection Status**: Visual indicator showing connection state

## Setup Instructions

### React Native App

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **iOS Setup:**
   ```bash
   cd ios && pod install && cd ..
   npx react-native run-ios
   ```

3. **Android Setup:**
   ```bash
   npx react-native run-android
   ```

### ESP32 Arduino Code

1. **Required Libraries:**
   - FastLED library
   - BluetoothSerial (built-in with ESP32)

2. **Hardware Setup:**
   - Connect LED strip data pin to ESP32 pin 5 (configurable in code)
   - Connect LED strip power and ground appropriately
   - Ensure ESP32 is powered

3. **Upload Code:**
   - Open `ESP32_LED_Controller.ino` in Arduino IDE
   - Select your ESP32 board
   - Upload the sketch

## Usage

1. **Power on your ESP32**
2. **Open the React Native app**
3. **Enable Bluetooth** if prompted
4. **Scan for devices** and connect to "ESP32_LED_Controller"
5. **Control your LEDs:**
   - Toggle power on/off
   - Select colors using the color picker
   - Use preset color buttons for quick selection

## Bluetooth Protocol

The app sends simple text commands to the ESP32:

- `LED_ON` - Turn LEDs on
- `LED_OFF` - Turn LEDs off
- `COLOR_R_G_B` - Set RGB color (e.g., `COLOR_255_0_0` for red)

## Troubleshooting

### iOS Issues
- Make sure you've run `pod install` in the ios directory
- Try cleaning and rebuilding: `npx react-native run-ios --reset-cache`
- Check iOS simulator is available

### Android Issues
- Ensure Android emulator is running or device is connected
- Check that all Bluetooth permissions are granted
- Location permission is required for Bluetooth scanning on Android

### ESP32 Issues
- Verify the correct ESP32 board is selected in Arduino IDE
- Check serial monitor for debug messages
- Ensure FastLED library is installed
- Verify LED strip wiring and power supply

## Hardware Requirements

- ESP32 development board (ESP-WROOM-32 or similar)
- WS2812B LED strip (or compatible)
- Appropriate power supply for LED strip
- Mobile device with Bluetooth capability

## Customization

You can modify the following in the ESP32 code:
- `NUM_LEDS`: Number of LEDs in your strip
- `LED_PIN`: GPIO pin connected to LED strip
- `BRIGHTNESS`: Default brightness level
- Device name in `SerialBT.begin("ESP32_LED_Controller")`

## License

This project is open source and available under the MIT License.