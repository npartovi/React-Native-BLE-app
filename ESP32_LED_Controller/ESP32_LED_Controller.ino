#include "BLEDevice.h"
#include "BLEServer.h"
#include "BLEUtils.h"
#include "BLE2902.h"
#include <FastLED.h>

#define LED_PIN     15
#define NUM_LEDS    40
#define CHIPSET     WS2812B
#define COLOR_ORDER GRB

CRGB leds[NUM_LEDS];

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

// Pride2015 animation variables
uint16_t sPseudotime = 0;
uint16_t sLastMillis = 0;
uint16_t sHue16 = 0;

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
  Serial.println("Turning LEDs ON");
  fill_solid(leds, NUM_LEDS, CRGB::White);
  FastLED.show();
  
  // Send confirmation back to app
  if (deviceConnected) {
    pCharacteristic->setValue("LED_ON_OK");
    pCharacteristic->notify();
  }
}

void turnOffLEDs() {
  Serial.println("Turning LEDs OFF");
  fill_solid(leds, NUM_LEDS, CRGB::Black);
  FastLED.show();
  
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
  if (currentAnimation == "none") return;
  
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
      fill_solid(leds, NUM_LEDS, animationColor);
      FastLED.setBrightness(brightness);
      FastLED.show();
      animationStep += 5;
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "strobe") {
    if (currentTime - animationTimer > 100) { // Update every 100ms
      if (animationStep % 2 == 0) {
        fill_solid(leds, NUM_LEDS, animationColor);
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
        leds[i] = CHSV(animationHue, 255, brightness); // Use selected color's hue
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
        leds[random16(NUM_LEDS)] += animationColor;
      }
      FastLED.show();
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "breathe") {
    if (currentTime - animationTimer > 30) { // Update every 30ms
      uint8_t breath = sin8(animationStep);
      fill_solid(leds, NUM_LEDS, CHSV(animationHue, 255, breath)); // Use selected color's hue
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
        leds[pos] = animationColor;
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
      leds[pos] = animationColor;
      if (pos > 0) leds[pos - 1] = animationColor;
      if (pos > 1) leds[pos - 2] = animationColor;
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
          leds[pos] = animationColor;
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
      leds[pos] = animationColor;
      if (pos > 0) leds[pos - 1] = animationColor;
      if (pos > 1) leds[pos - 2] = animationColor;
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
        leds[i] = animationColor;
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
        leds[pos] = animationColor;
        if (pos > 0) leds[pos - 1] = animationColor;
        if (pos > 1) leds[pos - 2] = animationColor;
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
          leds[i] = animationColor;
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
        uint8_t hue = sin8((i * 16) + animationStep) + sin8((i * 8) + (animationStep / 2));
        leds[i] = CHSV(hue, 255, 255);
      }
      FastLED.show();
      animationStep += 2;
      animationTimer = currentTime;
    }
  }
  
  else if (currentAnimation == "gradient") {
    if (currentTime - animationTimer > 50) { // Update every 50ms
      CHSV startColor = rgb2hsv_approximate(animationColor);
      for (int i = 0; i < NUM_LEDS; i++) {
        uint8_t hue = startColor.hue + ((i * 255) / NUM_LEDS) + animationStep;
        leds[i] = CHSV(hue, 255, 255);
      }
      FastLED.show();
      animationStep += 1;
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