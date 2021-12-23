// long button press variables
unsigned long longButtonTimeout_ms = 2000; // two second button timeout
bool previousButtonState;
bool listeningForLongButtonPress;
unsigned long lastUpdate_ms;

// debounce variables
int buttonState;
int lastButtonState = LOW;
long lastDebounceTime = 0;  // the last time the output pin was toggled
long debounceDelay = 50;    // the debounce time; increase if the output flickers

const int quittButton = 3; // Pin fuers Quittieren
const int spuelen = 5;
const int motor = 4;
const int kuehlen = 6;


int quittButtonState = 0;
int spuelenStateLast = 1;
int motorState = 0;
int kuehlenState = 1;


void setup() {
  Serial.begin(115200);
  pinMode(quittButton, INPUT);
  pinMode(spuelen, INPUT);
  pinMode(motor, INPUT);
  pinMode(kuehlen, INPUT);
}

void loop() {
  unsigned long currentTime_ms = millis();
  bool buttonPressed = false;

  int reading = digitalRead(quittButton);
  // If the switch changed, due to noise or pressing:
  if (reading != lastButtonState) {
    // reset the debouncing timer
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    // whatever the reading is at, it's been there for longer
    // than the debounce delay, so take it as the actual current state:

    // if the button state has changed:
    if (reading != buttonState) {
      buttonState = reading;

      // only toggle the LED if the new button state is HIGH
      if (buttonState == HIGH) {
        buttonPressed = true;
      } else {
        buttonPressed = false;
    }
  }


  // check for a long button press
  if (buttonPressed) {
    // if we are already within a button press
    if (listeningForLongButtonPress) {
      // and the button has been pressed for a long enough time
      if (currentTime_ms > (lastUpdate_ms + longButtonTimeout_ms)) {
        // we have a long button press
        Serial.write(11);
        // stop listening for a button press
        listeningForLongButtonPress = false;
      }
    } else {
      // otherwise, this is a new button press... begin listening for a long buttonpress
      listeningForLongButtonPress = true;
      Serial.write(10);
    }
  } else {
    // button released?  Stop listening for a long button press
    listeningForLongButtonPress = false;;
  }
}
}
