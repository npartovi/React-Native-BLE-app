#include "BLEDevice.h"
#include "BLEServer.h"
#include "BLEUtils.h"
#include "BLE2902.h"
#include <FastLED.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include "Adafruit_LEDBackpack.h"

#define LED_PIN     15
#define NUM_LEDS    40
#define CHIPSET     WS2812B
#define COLOR_ORDER GRB

CRGB leds[NUM_LEDS];

// 8x8 Matrix setup
Adafruit_BicolorMatrix matrix = Adafruit_BicolorMatrix();

BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
BLEService* pService = NULL;
BLEAdvertising* pAdvertising = NULL;
bool deviceConnected = false;
bool oldDeviceConnected = false;

// Animation variables
String currentAnimation = "none";
unsigned long animationTimer = 0;
int animationStep = 0;
uint8_t rainbowHue = 0;
bool ledPowerState = true;

// Animation color variables
CRGB animationColor = CRGB::White;
uint8_t animationHue = 0;

// Color cycle variables
bool colorCycleEnabled = false;
unsigned long colorCycleTimer = 0;
int currentColorIndex = 0;
CRGB cycleColors[] = {
  CRGB::Red, CRGB::Green, CRGB::Blue, CRGB::Yellow, 
  CRGB::Magenta, CRGB::Cyan, CRGB::White, CRGB::Orange
};
int numCycleColors = 8;

// Palette system variables
int currentPaletteIndex = 0;
bool usePalette = false;

// Define gradient palettes (WLED-inspired)
const PROGMEM TProgmemPalette16 palette_landscape = {
  0x000000, 0x02190, 0x0F7305, 0x4FD501,
  0x7ED32F, 0xBCD1F7, 0x90B6CD, 0x3B75FA,
  0x0125C0, 0x000000, 0x000000, 0x000000,
  0x000000, 0x000000, 0x000000, 0x000000
};

const PROGMEM TProgmemPalette16 palette_ocean = {
  0x010607, 0x01636F, 0x90D1FF, 0x004952,
  0x000000, 0x000000, 0x000000, 0x000000,
  0x000000, 0x000000, 0x000000, 0x000000,
  0x000000, 0x000000, 0x000000, 0x000000
};

const PROGMEM TProgmemPalette16 palette_sunset = {
  0x780000, 0xFF6800, 0x640067, 0x200020,
  0x000000, 0x000000, 0x000000, 0x000000,
  0x000000, 0x000000, 0x000000, 0x000000,
  0x000000, 0x000000, 0x000000, 0x000000
};

const PROGMEM TProgmemPalette16 palette_autumn = {
  0x1A0101, 0x430401, 0x760E01, 0x899834,
  0x714101, 0x85953B, 0x899834, 0x714101,
  0x8B9A2E, 0x710D01, 0x370301, 0x110101,
  0x110101, 0x000000, 0x000000, 0x000000
};

const PROGMEM TProgmemPalette16 palette_fire = {
  0x000000, 0x330000, 0x660000, 0x990000,
  0xCC0000, 0xFF0000, 0xFF3300, 0xFF6600,
  0xFF9900, 0xFFCC00, 0xFFFF00, 0xFFFF33,
  0xFFFF66, 0xFFFF99, 0xFFFFCC, 0xFFFFFF
};

const PROGMEM TProgmemPalette16 palette_ice = {
  0x000033, 0x000066, 0x003366, 0x006699,
  0x0099CC, 0x00CCFF, 0x33DDFF, 0x66EEFF,
  0x99FFFF, 0xCCFFFF, 0xFFFFFF, 0xFFFFFF,
  0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF
};

const PROGMEM TProgmemPalette16 palette_neon = {
  0xFF00FF, 0xFF0080, 0xFF0000, 0xFF8000,
  0xFFFF00, 0x80FF00, 0x00FF00, 0x00FF80,
  0x00FFFF, 0x0080FF, 0x0000FF, 0x8000FF,
  0xFF00FF, 0xFF0080, 0xFF0000, 0xFF8000
};

CRGBPalette16 currentPalette;

// Pride2015 animation variables
uint16_t sPseudotime = 0;
uint16_t sLastMillis = 0;
uint16_t sHue16 = 0;

// 8x8 Matrix variables
bool matrixEnabled = false;
uint8_t matrixEyeColor = LED_GREEN;
uint8_t matrixPupilColor = LED_RED;

// Eye animation data
const uint8_t PROGMEM blinkImg[][8] = {
  { B00111100,         // Fully open eye
    B01111110,
    B11111111,
    B11111111,
    B11111111,
    B11111111,
    B01111110,
    B00111100 },
  { B00000000,
    B01111110,
    B11111111,
    B11111111,
    B11111111,
    B11111111,
    B01111110,
    B00111100 },
  { B00000000,
    B00000000,
    B00111100,
    B11111111,
    B11111111,
    B11111111,
    B00111100,
    B00000000 },
  { B00000000,
    B00000000,
    B00000000,
    B00111100,
    B11111111,
    B01111110,
    B00011000,
    B00000000 },
  { B00000000,         // Fully closed eye
    B00000000,
    B00000000,
    B00000000,
    B10000001,
    B01111110,
    B00000000,
    B00000000 }
};

// Eye animation variables
uint8_t blinkIndex[] = { 1, 2, 3, 4, 3, 2, 1 };
uint8_t blinkCountdown = 100;
uint8_t gazeCountdown = 75;
uint8_t gazeFrames = 50;
int8_t eyeX = 3, eyeY = 3;
int8_t newX = 3, newY = 3;
int8_t dX = 0, dY = 0;

#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

void turnOnLEDs();
void turnOffLEDs();
void processColorCommand(String command);
void processBrightnessCommand(String command);
void processAnimationCommand(String command);
void processAnimationColorCommand(String command);
void updateAnimations();
void stopAllAnimations();
void pride();
void sendCurrentState();
void updateMatrixAnimation();
void blinkingAnimation();
void gazingAnimation();
void processMatrixCommand(String command);
void setPalette(int paletteIndex);
CRGB getPaletteColor(uint8_t index);

class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      Serial.println("Device connected");
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      Serial.println("Device disconnected");
    }
};

class MyCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      String rxValue = pCharacteristic->getValue().c_str();

      if (rxValue.length() > 0) {
        Serial.println("*********");
        Serial.print("Received Value: ");
        Serial.print(rxValue);
        Serial.println();
        Serial.println("*********");
        
        // Process LED commands
        String command = rxValue;
        command.trim();
        
        if (command == "LED_ON") {
          turnOnLEDs();
        }
        else if (command == "LED_OFF") {
          turnOffLEDs();
        }
        else if (command == "COLOR_CYCLE_ON") {
          colorCycleEnabled = true;
          colorCycleTimer = millis();
          currentColorIndex = 0;
          animationColor = cycleColors[currentColorIndex];
          
          // Convert to HSV for animations that need hue
          CHSV hsv = rgb2hsv_approximate(animationColor);
          animationHue = hsv.hue;
        }
        else if (command == "COLOR_CYCLE_OFF") {
          colorCycleEnabled = false;
        }
        else if (command.startsWith("COLOR_")) {
          processColorCommand(command);
        }
        else if (command.startsWith("BRIGHTNESS_")) {
          processBrightnessCommand(command);
        }
        else if (command.startsWith("ANIMATION_COLOR_")) {
          processAnimationColorCommand(command);
        }
        else if (command.startsWith("ANIMATION_")) {
          processAnimationCommand(command);
        }
        else if (command == "GET_STATE") {
          sendCurrentState();
        }
        else if (command.startsWith("MATRIX_")) {
          processMatrixCommand(command);
        }
        else if (command.startsWith("PALETTE_")) {
          String paletteNum = command.substring(8);
          int paletteIndex = paletteNum.toInt();
          setPalette(paletteIndex);
        }
        else if (command == "PALETTE_OFF") {
          usePalette = false;
          Serial.println("Palette mode disabled");
        }
        else {
          Serial.println("Unrecognized command");
        }
      }
    }
};

void setup() {
  Serial.begin(9600);
  Serial.println("Starting iOS-compatible BLE LED Controller...");

  // Initialize FastLED
  FastLED.addLeds<CHIPSET, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
  FastLED.setBrightness(84);
  
  // Turn off all LEDs initially
  fill_solid(leds, NUM_LEDS, CRGB::Black);
  FastLED.show();

  // Initialize 8x8 Matrix
  matrix.begin(0x70);
  randomSeed(analogRead(0));

  // Initialize default palette
  setPalette(0);

  // Create the BLE Device with iOS-friendly name
  BLEDevice::init("ESP32 LED Controller");
  
  // Set device appearance as generic remote control for iOS compatibility
  BLEDevice::setCustomGapHandler(nullptr);
  
  // Create the BLE Server
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Create the BLE Service
  pService = pServer->createService(SERVICE_UUID);

  // Create a BLE Characteristic with iOS-compatible properties
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ   |
                      BLECharacteristic::PROPERTY_WRITE  |
                      BLECharacteristic::PROPERTY_WRITE_NR |
                      BLECharacteristic::PROPERTY_NOTIFY
                    );

  pCharacteristic->setCallbacks(new MyCallbacks());
  
  // Add descriptor for notifications (required for iOS)
  pCharacteristic->addDescriptor(new BLE2902());

  // Start the service
  pService->start();

  // Configure advertising for iOS compatibility
  pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
  pAdvertising->setMaxPreferred(0x12);
  
  // Start advertising
  BLEDevice::startAdvertising();
  Serial.println("BLE LED Controller ready for iOS connection!");
  Serial.println("Device name: ESP32 LED Controller");
  Serial.println("Service UUID: " + String(SERVICE_UUID));
}

void loop() {
  // Handle disconnection and restart advertising
  if (!deviceConnected && oldDeviceConnected) {
    delay(500); // Give the bluetooth stack time to get ready
    pServer->startAdvertising(); 
    Serial.println("Device disconnected - restarting advertising");
    oldDeviceConnected = deviceConnected;
  }
  
  // Handle new connection
  if (deviceConnected && !oldDeviceConnected) {
    Serial.println("Device connected successfully!");
    oldDeviceConnected = deviceConnected;
  }
  
  // Update animations continuously
  updateAnimations();
  
  // Handle color cycling
  updateColorCycle();
  
  // Update matrix animation
  updateMatrixAnimation();
  
  delay(10); // Small delay to prevent watchdog issues
}

void updateColorCycle() {
  if (colorCycleEnabled && currentAnimation != "none" && currentAnimation != "rainbow" && currentAnimation != "pride" && currentAnimation != "plasma") {
    if (millis() - colorCycleTimer > 10000) { // 10 seconds
      currentColorIndex = (currentColorIndex + 1) % numCycleColors;
      animationColor = cycleColors[currentColorIndex];
      
      // Convert to HSV for animations that need hue
      CHSV hsv = rgb2hsv_approximate(animationColor);
      animationHue = hsv.hue;
      
      colorCycleTimer = millis();
      
      // Send notification back to app if connected
      if (deviceConnected) {
        String response = "COLOR_CYCLE_" + String(currentColorIndex);
        pCharacteristic->setValue(response.c_str());
        pCharacteristic->notify();
      }
    }
  }
}

void turnOnLEDs() {
  Serial.println("Turning LEDs and Matrix ON");
  ledPowerState = true;
  matrixEnabled = true;
  
  // If no animation is running, show white
  if (currentAnimation == "none") {
    fill_solid(leds, NUM_LEDS, CRGB::White);
    FastLED.show();
  }
  
  // Send confirmation back to app
  if (deviceConnected) {
    pCharacteristic->setValue("LED_ON_OK");
    pCharacteristic->notify();
  }
}

void turnOffLEDs() {
  Serial.println("Turning LEDs and Matrix OFF");
  ledPowerState = false;
  matrixEnabled = false;
  fill_solid(leds, NUM_LEDS, CRGB::Black);
  FastLED.show();
  
  // Turn off matrix
  matrix.clear();
  matrix.writeDisplay();
  
  // Send confirmation back to app
  if (deviceConnected) {
    pCharacteristic->setValue("LED_OFF_OK");
    pCharacteristic->notify();
  }
}

void processColorCommand(String command) {
  // Expected format: COLOR_R_G_B (e.g., COLOR_255_0_0 for red)
  int firstUnderscore = command.indexOf('_', 6); // Start after "COLOR_"
  int secondUnderscore = command.indexOf('_', firstUnderscore + 1);
  
  if (firstUnderscore > 0 && secondUnderscore > 0) {
    int r = command.substring(6, firstUnderscore).toInt();
    int g = command.substring(firstUnderscore + 1, secondUnderscore).toInt();
    int b = command.substring(secondUnderscore + 1).toInt();
    
    // Validate RGB values
    r = constrain(r, 0, 255);
    g = constrain(g, 0, 255);
    b = constrain(b, 0, 255);
    
    Serial.printf("Setting color to R:%d G:%d B:%d\n", r, g, b);
    
    fill_solid(leds, NUM_LEDS, CRGB(r, g, b));
    FastLED.show();
    
    // Send confirmation back to app
    if (deviceConnected) {
      String response = "COLOR_OK_" + String(r) + "_" + String(g) + "_" + String(b);
      pCharacteristic->setValue(response.c_str());
      pCharacteristic->notify();
    }
  } else {
    Serial.println("Invalid color command format");
    if (deviceConnected) {
      pCharacteristic->setValue("COLOR_ERROR");
      pCharacteristic->notify();
    }
  }
}

void processBrightnessCommand(String command) {
  // Expected format: BRIGHTNESS_VALUE (e.g., BRIGHTNESS_128)
  int underscorePos = command.indexOf('_', 10); // Start after "BRIGHTNESS"
  
  if (underscorePos > 0) {
    int brightnessValue = command.substring(11).toInt(); // Start after "BRIGHTNESS_"
    
    // Validate brightness value
    brightnessValue = constrain(brightnessValue, 10, 255);
    
    Serial.printf("Setting brightness to: %d\n", brightnessValue);
    
    FastLED.setBrightness(brightnessValue);
    FastLED.show();
    
    // Send confirmation back to app
    if (deviceConnected) {
      String response = "BRIGHTNESS_OK_" + String(brightnessValue);
      pCharacteristic->setValue(response.c_str());
      pCharacteristic->notify();
    }
  } else {
    Serial.println("Invalid brightness command format");
    if (deviceConnected) {
      pCharacteristic->setValue("BRIGHTNESS_ERROR");
      pCharacteristic->notify();
    }
  }
}

void processAnimationCommand(String command) {
  // Expected format: ANIMATION_TYPE (e.g., ANIMATION_RAINBOW, ANIMATION_STOP)
  String animationType = command.substring(10); // Start after "ANIMATION_"
  animationType.toLowerCase();
  
  Serial.printf("Processing animation command: %s\n", animationType.c_str());
  
  if (animationType == "stop") {
    stopAllAnimations();
  } else {
    currentAnimation = animationType;
    animationTimer = millis();
    animationStep = 0;
    rainbowHue = 0;
    
    Serial.printf("Started animation: %s\n", currentAnimation.c_str());
    
    // Send confirmation back to app
    if (deviceConnected) {
      String response = "ANIMATION_OK_" + animationType;
      pCharacteristic->setValue(response.c_str());
      pCharacteristic->notify();
    }
  }
}

void updateAnimations() {
  if (currentAnimation == "none" || !ledPowerState) return;
  
  unsigned long currentTime = millis();
  
  if (currentAnimation == "rainbow") {
    if (currentTime - animationTimer > 50) { // Update every 50ms
      fill_rainbow(leds, NUM_LEDS, rainbowHue, 7);
      FastLED.show();
      rainbowHue += 3;
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "pride") {
    if (currentTime - animationTimer > 20) { // Update every 20ms for smooth animation
      pride();
      FastLED.show();
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "fade") {
    if (currentTime - animationTimer > 20) { // Update every 20ms
      uint8_t brightness = (sin8(animationStep) / 2) + 128;
      CRGB color = getPaletteColor(animationStep);
      fill_solid(leds, NUM_LEDS, color);
      FastLED.setBrightness(brightness);
      FastLED.show();
      animationStep += 5;
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "strobe") {
    if (currentTime - animationTimer > 100) { // Update every 100ms
      if (animationStep % 2 == 0) {
        CRGB color = getPaletteColor(animationStep * 8);
        fill_solid(leds, NUM_LEDS, color);
      } else {
        fill_solid(leds, NUM_LEDS, CRGB::Black);
      }
      FastLED.show();
      animationStep++;
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "wave") {
    if (currentTime - animationTimer > 50) { // Update every 50ms
      for (int i = 0; i < NUM_LEDS; i++) {
        uint8_t brightness = sin8(((i * 256 / NUM_LEDS) + animationStep) % 256);
        if (usePalette) {
          uint8_t paletteIndex = (i * 256 / NUM_LEDS) + (animationStep / 2);
          leds[i] = getPaletteColor(paletteIndex);
          leds[i].nscale8(brightness);
        } else {
          leds[i] = CHSV(animationHue, 255, brightness);
        }
      }
      FastLED.show();
      animationStep += 8;
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "sparkle") {
    if (currentTime - animationTimer > 100) { // Update every 100ms
      // Fade all LEDs
      fadeToBlackBy(leds, NUM_LEDS, 64);
      
      // Add random sparkles using selected color
      if (random8() < 80) {
        int pos = random16(NUM_LEDS);
        CRGB color = getPaletteColor(random8());
        leds[pos] += color;
      }
      FastLED.show();
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "breathe") {
    if (currentTime - animationTimer > 30) { // Update every 30ms
      uint8_t breath = sin8(animationStep);
      if (usePalette) {
        CRGB color = getPaletteColor(animationStep);
        color.nscale8(breath);
        fill_solid(leds, NUM_LEDS, color);
      } else {
        fill_solid(leds, NUM_LEDS, CHSV(animationHue, 255, breath)); // Use selected color's hue
      }
      FastLED.show();
      animationStep += 3;
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "chase") {
    if (currentTime - animationTimer > 100) { // Update every 100ms
      fill_solid(leds, NUM_LEDS, CRGB::Black);
      for (int i = 0; i < 3; i++) {
        int pos = (animationStep + i) % NUM_LEDS;
        CRGB color = getPaletteColor(pos * 8);
        leds[pos] = color;
      }
      FastLED.show();
      animationStep = (animationStep + 1) % NUM_LEDS;
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "fire") {
    if (currentTime - animationTimer > 50) { // Update every 50ms
      for (int i = 0; i < NUM_LEDS; i++) {
        int heat = random8(0, 255);
        if (heat > 160) {
          leds[i] = CRGB(255, heat - 160, 0); // Red to yellow
        } else if (heat > 80) {
          leds[i] = CRGB(heat * 2, 0, 0); // Black to red
        } else {
          leds[i] = CRGB(heat, 0, 0); // Dim red
        }
      }
      FastLED.show();
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "comet") {
    if (currentTime - animationTimer > 80) { // Update every 80ms
      fadeToBlackBy(leds, NUM_LEDS, 50);
      int pos = animationStep % NUM_LEDS;
      CRGB color = getPaletteColor(pos * 6);
      leds[pos] = color;
      if (pos > 0) leds[pos - 1] = color;
      if (pos > 1) leds[pos - 2] = color;
      FastLED.show();
      animationStep++;
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "twinkle") {
    if (currentTime - animationTimer > 200) { // Update every 200ms
      fadeToBlackBy(leds, NUM_LEDS, 30);
      for (int i = 0; i < 3; i++) {
        if (random8() < 50) {
          int pos = random16(NUM_LEDS);
          CRGB color = getPaletteColor(random8());
          leds[pos] = color;
        }
      }
      FastLED.show();
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "scanner") {
    if (currentTime - animationTimer > 60) { // Update every 60ms
      fill_solid(leds, NUM_LEDS, CRGB::Black);
      int pos;
      if (animationStep < NUM_LEDS) {
        pos = animationStep;
      } else {
        pos = (NUM_LEDS * 2) - animationStep - 1;
      }
      CRGB color = getPaletteColor(pos * 4);
      leds[pos] = color;
      if (pos > 0) leds[pos - 1] = color;
      if (pos > 1) leds[pos - 2] = color;
      FastLED.show();
      animationStep++;
      if (animationStep >= NUM_LEDS * 2) animationStep = 0;
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "pulse") {
    if (currentTime - animationTimer > 30) { // Update every 30ms
      uint8_t brightness = beatsin8(60, 50, 255); // 60 BPM pulse
      for (int i = 0; i < NUM_LEDS; i++) {
        CRGB color = getPaletteColor(i * 8);
        leds[i] = color;
        leds[i].nscale8(brightness);
      }
      FastLED.show();
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "meteor") {
    if (currentTime - animationTimer > 60) { // Update every 60ms
      fadeToBlackBy(leds, NUM_LEDS, 64);
      for (int i = 0; i < 5; i++) { // 5 meteors
        int pos = (animationStep + (i * NUM_LEDS / 5)) % NUM_LEDS;
        CRGB color = getPaletteColor(pos * 5 + i * 50);
        leds[pos] = color;
        if (pos > 0) leds[pos - 1] = color;
        if (pos > 1) leds[pos - 2] = color;
      }
      FastLED.show();
      animationStep = (animationStep + 1) % NUM_LEDS;
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "theater") {
    if (currentTime - animationTimer > 150) { // Update every 150ms
      for (int i = 0; i < NUM_LEDS; i++) {
        if ((i + animationStep) % 3 == 0) {
          CRGB color = getPaletteColor(i * 6);
          leds[i] = color;
        } else {
          leds[i] = CRGB::Black;
        }
      }
      FastLED.show();
      animationStep = (animationStep + 1) % 3;
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "plasma") {
    if (currentTime - animationTimer > 40) { // Update every 40ms
      for (int i = 0; i < NUM_LEDS; i++) {
        if (usePalette) {
          uint8_t paletteIndex = sin8((i * 16) + animationStep) + sin8((i * 8) + (animationStep / 2));
          leds[i] = getPaletteColor(paletteIndex);
        } else {
          uint8_t hue = sin8((i * 16) + animationStep) + sin8((i * 8) + (animationStep / 2));
          leds[i] = CHSV(hue, 255, 255);
        }
      }
      FastLED.show();
      animationStep += 2;
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "gradient") {
    if (currentTime - animationTimer > 50) { // Update every 50ms
      if (usePalette) {
        for (int i = 0; i < NUM_LEDS; i++) {
          uint8_t paletteIndex = ((i * 255) / NUM_LEDS) + animationStep;
          leds[i] = getPaletteColor(paletteIndex);
        }
      } else {
        CHSV startColor = rgb2hsv_approximate(animationColor);
        for (int i = 0; i < NUM_LEDS; i++) {
          uint8_t hue = startColor.hue + ((i * 255) / NUM_LEDS) + animationStep;
          leds[i] = CHSV(hue, 255, 255);
        }
      }
      FastLED.show();
      animationStep += 1;
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "aurora") {
    if (currentTime - animationTimer > 30) { // Update every 30ms
      for (int i = 0; i < NUM_LEDS; i++) {
        // Create multiple overlapping sine waves for aurora effect
        uint8_t wave1 = sin8((i * 16) + animationStep);
        uint8_t wave2 = sin8((i * 23) + (animationStep * 2));
        uint8_t wave3 = sin8((i * 11) + (animationStep / 2));
        
        uint8_t brightness = (wave1 + wave2 + wave3) / 3;
        
        if (usePalette) {
          uint8_t paletteIndex = (i * 8) + (animationStep / 3);
          leds[i] = getPaletteColor(paletteIndex);
          leds[i].nscale8(brightness);
        } else {
          CHSV baseColor = rgb2hsv_approximate(animationColor);
          uint8_t hue = baseColor.hue + sin8((i * 8) + animationStep / 3);
          leds[i] = CHSV(hue, 200, brightness);
        }
      }
      FastLED.show();
      animationStep += 3;
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "ripple") {
    if (currentTime - animationTimer > 40) { // Update every 40ms
      int center = NUM_LEDS / 2;
      
      for (int i = 0; i < NUM_LEDS; i++) {
        int distance = abs(i - center);
        uint8_t ripple = sin8(((distance * 32) - animationStep) % 256);
        uint8_t brightness = scale8(ripple, 200);
        
        if (usePalette) {
          CRGB color = getPaletteColor(distance * 8 + animationStep / 4);
          color.nscale8(brightness);
          leds[i] = color;
        } else {
          CHSV baseColor = rgb2hsv_approximate(animationColor);
          leds[i] = CHSV(baseColor.hue, 255, brightness);
        }
      }
      FastLED.show();
      animationStep += 8;
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "sine") {
    if (currentTime - animationTimer > 25) { // Update every 25ms
      for (int i = 0; i < NUM_LEDS; i++) {
        // Pure sine wave across all LEDs
        uint8_t sineValue = sin8(((i * 256 / NUM_LEDS) + animationStep) % 256);
        uint8_t brightness = scale8(sineValue, 255);
        
        if (usePalette) {
          CRGB color = getPaletteColor((i * 256 / NUM_LEDS) + animationStep / 4);
          color.nscale8(brightness);
          leds[i] = color;
        } else {
          CHSV baseColor = rgb2hsv_approximate(animationColor);
          leds[i] = CHSV(baseColor.hue, 255, brightness);
        }
      }
      FastLED.show();
      animationStep += 6;
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "spiral") {
    if (currentTime - animationTimer > 35) { // Update every 35ms
      CHSV baseColor = rgb2hsv_approximate(animationColor);
      
      for (int i = 0; i < NUM_LEDS; i++) {
        // Create spiral pattern with overlapping phases
        uint8_t phase1 = sin8(((i * 20) + animationStep) % 256);
        uint8_t phase2 = cos8(((i * 15) + (animationStep * 2)) % 256);
        uint8_t brightness = (phase1 + phase2) / 2;
        uint8_t hue = baseColor.hue + (i * 8) + (animationStep / 4);
        
        leds[i] = CHSV(hue, 255, brightness);
      }
      FastLED.show();
      animationStep += 4;
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "kaleidoscope") {
    if (currentTime - animationTimer > 45) { // Update every 45ms
      CHSV baseColor = rgb2hsv_approximate(animationColor);
      
      for (int i = 0; i < NUM_LEDS; i++) {
        // Complex mathematical pattern
        uint8_t pattern1 = sin8((i * 32) + animationStep);
        uint8_t pattern2 = cos8((i * 21) + (animationStep * 3));
        uint8_t pattern3 = sin8((i * 13) + (animationStep / 2));
        
        uint8_t brightness = (pattern1 + pattern2 + pattern3) / 3;
        uint8_t hue = baseColor.hue + pattern1 / 4 + pattern2 / 6;
        uint8_t saturation = 200 + (pattern3 / 8);
        
        leds[i] = CHSV(hue, saturation, brightness);
      }
      FastLED.show();
      animationStep += 5;
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "ocean") {
    if (currentTime - animationTimer > 60) { // Update every 60ms for slower, deeper effect
      CHSV baseColor = rgb2hsv_approximate(animationColor);
      
      for (int i = 0; i < NUM_LEDS; i++) {
        // Simulate ocean waves with multiple layers
        uint8_t wave1 = sin8(((i * 12) + animationStep) % 256);
        uint8_t wave2 = sin8(((i * 18) + (animationStep + animationStep/2)) % 256);
        uint8_t wave3 = sin8(((i * 25) + (animationStep / 3)) % 256);
        
        // Combine waves for depth effect
        uint8_t depth = (wave1 / 3) + (wave2 / 3) + (wave3 / 3);
        uint8_t brightness = 80 + depth; // Darker base with wave highlights
        uint8_t hue = baseColor.hue + sin8((i * 6) + animationStep / 4) / 8;
        
        leds[i] = CHSV(hue, 255, brightness);
      }
      FastLED.show();
      animationStep += 2;
      animationTimer = currentTime;
    }
  }
}

void stopAllAnimations() {
  currentAnimation = "none";
  animationStep = 0;
  rainbowHue = 0;
  
  // Reset Pride2015 variables
  sPseudotime = 0;
  sLastMillis = 0;
  sHue16 = 0;
  
  Serial.println("All animations stopped");
  
  // Send confirmation back to app
  if (deviceConnected) {
    pCharacteristic->setValue("ANIMATION_STOPPED");
    pCharacteristic->notify();
  }
}


void processAnimationColorCommand(String command) {
  // Expected format: ANIMATION_COLOR_R_G_B (e.g., ANIMATION_COLOR_255_0_0)
  int firstUnderscore = command.indexOf('_', 16); // Start after "ANIMATION_COLOR_"
  int secondUnderscore = command.indexOf('_', firstUnderscore + 1);
  
  if (firstUnderscore > 0 && secondUnderscore > 0) {
    int r = command.substring(16, firstUnderscore).toInt();
    int g = command.substring(firstUnderscore + 1, secondUnderscore).toInt();
    int b = command.substring(secondUnderscore + 1).toInt();
    
    // Validate RGB values
    r = constrain(r, 0, 255);
    g = constrain(g, 0, 255);
    b = constrain(b, 0, 255);
    
    // Store the animation color
    animationColor = CRGB(r, g, b);
    
    // Convert to HSV for animations that need hue
    CHSV hsv = rgb2hsv_approximate(animationColor);
    animationHue = hsv.hue;
    
    Serial.printf("Animation color set to R:%d G:%d B:%d (Hue:%d)\n", r, g, b, animationHue);
    
    // Send confirmation back to app
    if (deviceConnected) {
      String response = "ANIMATION_COLOR_OK_" + String(r) + "_" + String(g) + "_" + String(b);
      pCharacteristic->setValue(response.c_str());
      pCharacteristic->notify();
    }
  } else {
    Serial.println("Invalid animation color command format");
    if (deviceConnected) {
      pCharacteristic->setValue("ANIMATION_COLOR_ERROR");
      pCharacteristic->notify();
    }
  }
}

// Pride2015 - Animated, ever-changing rainbows by Mark Kriegsman
// This function draws rainbows with an ever-changing, widely-varying set of parameters.
void pride() 
{
  uint8_t sat8 = beatsin88( 87, 220, 250);
  uint8_t brightdepth = beatsin88( 341, 96, 224);
  uint16_t brightnessthetainc16 = beatsin88( 203, (25 * 256), (40 * 256));
  uint8_t msmultiplier = beatsin88(147, 23, 60);

  uint16_t hue16 = sHue16;
  uint16_t hueinc16 = beatsin88(113, 1, 3000);
  
  uint16_t ms = millis();
  uint16_t deltams = ms - sLastMillis;
  sLastMillis = ms;
  sPseudotime += deltams * msmultiplier;
  sHue16 += deltams * beatsin88( 400, 5, 9);
  uint16_t brightnesstheta16 = sPseudotime;
  
  for( uint16_t i = 0 ; i < NUM_LEDS; i++) {
    hue16 += hueinc16;
    uint8_t hue8 = hue16 / 256;

    brightnesstheta16 += brightnessthetainc16;
    uint16_t b16 = sin16( brightnesstheta16 ) + 32768;

    uint16_t bri16 = (uint32_t)((uint32_t)b16 * (uint32_t)b16) / 65536;
    uint8_t bri8 = (uint32_t)(((uint32_t)bri16) * brightdepth) / 65536;
    bri8 += (255 - brightdepth);
    
    CRGB newcolor = CHSV( hue8, sat8, bri8);
    
    uint16_t pixelnumber = i;
    pixelnumber = (NUM_LEDS-1) - pixelnumber;
    
    nblend( leds[pixelnumber], newcolor, 64);
  }
}

void sendCurrentState() {
  if (!deviceConnected) return;
  
  // Send LED power state
  String powerState = ledPowerState ? "STATE_LED_ON" : "STATE_LED_OFF";
  pCharacteristic->setValue(powerState.c_str());
  pCharacteristic->notify();
  
  delay(100); // Small delay between notifications
  
  // Send current animation if any
  if (currentAnimation != "none") {
    String animState = "STATE_ANIMATION_" + currentAnimation;
    animState.toUpperCase();
    pCharacteristic->setValue(animState.c_str());
    pCharacteristic->notify();
    
    delay(100);
    
    // Send color cycle state
    if (colorCycleEnabled) {
      pCharacteristic->setValue("STATE_COLOR_CYCLE_ON");
      pCharacteristic->notify();
    }
  }
  
  Serial.println("Current state sent to app");
}

void processMatrixCommand(String command) {
  Serial.printf("Processing matrix command: %s\n", command.c_str());
  
  // Handle eye color commands
  if (command == "MATRIX_EYE_GREEN") {
    matrixEyeColor = LED_GREEN;
    Serial.println("Matrix eye color: Green");
  }
  else if (command == "MATRIX_EYE_YELLOW") {
    matrixEyeColor = LED_YELLOW;
    Serial.println("Matrix eye color: Yellow");
  }
  else if (command == "MATRIX_EYE_RED") {
    matrixEyeColor = LED_RED;
    Serial.println("Matrix eye color: Red");
  }
  // Handle pupil color commands
  else if (command == "MATRIX_PUPIL_GREEN") {
    matrixPupilColor = LED_GREEN;
    Serial.println("Matrix pupil color: Green");
  }
  else if (command == "MATRIX_PUPIL_YELLOW") {
    matrixPupilColor = LED_YELLOW;
    Serial.println("Matrix pupil color: Yellow");
  }
  else if (command == "MATRIX_PUPIL_RED") {
    matrixPupilColor = LED_RED;
    Serial.println("Matrix pupil color: Red");
  }
  
  // Send confirmation back to app
  if (deviceConnected) {
    String response = "MATRIX_OK_" + command.substring(7); // Remove "MATRIX_"
    pCharacteristic->setValue(response.c_str());
    pCharacteristic->notify();
  }
}

void updateMatrixAnimation() {
  if (!matrixEnabled) return;
  
  matrix.clear();
  blinkingAnimation();
  gazingAnimation();
  matrix.writeDisplay();
}

void blinkingAnimation() {
  matrix.drawBitmap(0, 0,
    blinkImg[
      (blinkCountdown < sizeof(blinkIndex)) ? // Currently blinking?
      blinkIndex[blinkCountdown] :            // Yes, look up bitmap #
      0                                       // No, show bitmap 0
    ], 8, 8, matrixEyeColor);
  
  // Decrement blink counter. At end, set random time for next blink.
  if(--blinkCountdown == 0) blinkCountdown = random(5, 180);
}

void gazingAnimation() {
  // Check if eye and pupil colors are the same - if so, make pupil transparent
  uint8_t pupilDrawColor = (matrixEyeColor == matrixPupilColor) ? LED_OFF : matrixPupilColor;
  
  if(--gazeCountdown <= gazeFrames) {
    // Eyes are in motion - draw pupil at interim position (or transparent if same color)
    matrix.fillRect(
      newX - (dX * gazeCountdown / gazeFrames),
      newY - (dY * gazeCountdown / gazeFrames),
      2, 2, pupilDrawColor);
    if(gazeCountdown == 0) {    // Last frame?
      eyeX = newX; eyeY = newY; // Yes. What's new is old, then...
      do { // Pick random positions until one is within the eye circle
        newX = random(7); newY = random(7);
        dX   = newX - 3;  dY   = newY - 3;
      } while((dX * dX + dY * dY) >= 10);      // Thank you Pythagoras
      dX            = newX - eyeX;             // Horizontal distance to move
      dY            = newY - eyeY;             // Vertical distance to move
      gazeFrames    = random(3, 15);           // Duration of eye movement
      gazeCountdown = random(gazeFrames, 120); // Count to end of next movement
    }
  } else {
    // Not in motion yet -- draw pupil at current static position (or transparent if same color)
    matrix.fillRect(eyeX, eyeY, 2, 2, pupilDrawColor);
  }
}

void setPalette(int paletteIndex) {
  currentPaletteIndex = paletteIndex;
  usePalette = true;
  
  switch(paletteIndex) {
    case 0:
      currentPalette = palette_landscape;
      Serial.println("Palette: Landscape");
      break;
    case 1:
      currentPalette = palette_ocean;
      Serial.println("Palette: Ocean");
      break;
    case 2:
      currentPalette = palette_sunset;
      Serial.println("Palette: Sunset");
      break;
    case 3:
      currentPalette = palette_autumn;
      Serial.println("Palette: Autumn");
      break;
    case 4:
      currentPalette = palette_fire;
      Serial.println("Palette: Fire");
      break;
    case 5:
      currentPalette = palette_ice;
      Serial.println("Palette: Ice");
      break;
    case 6:
      currentPalette = palette_neon;
      Serial.println("Palette: Neon");
      break;
    default:
      currentPalette = palette_landscape;
      Serial.println("Palette: Default (Landscape)");
      break;
  }
  
  // Send confirmation back to app
  if (deviceConnected) {
    String response = "PALETTE_OK_" + String(paletteIndex);
    pCharacteristic->setValue(response.c_str());
    pCharacteristic->notify();
  }
}

CRGB getPaletteColor(uint8_t index) {
  if (usePalette) {
    return ColorFromPalette(currentPalette, index, 255, LINEARBLEND);
  } else {
    return animationColor;
  }
}