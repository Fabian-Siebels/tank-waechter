#include <OneWire.h>
#include <DallasTemperature.h>
#include <LiquidCrystal_I2C.h>

// Der PIN D2 (GPIO 4) wird als BUS-Pin verwendet
#define ONE_WIRE_BUS 4

int incomingByte = 0; // Für eingehende serielle Daten

LiquidCrystal_I2C lcd(0x27,16,2);

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature DS18B20(&oneWire);

// In dieser Variable wird die Temperatur gespeichert
float temperatur;

// 0 = 600min ueber 13 Grad
// 1 = 360min ueber 16 Grad
// 2 = 300min ueber 28 Grad
// 3 = Ist ueber 600 min 13 Grad
// 4 = Ist ueber 360 min 26 Grad
// 5 = Ist ueber 300 min 28 Grad 
// 6 = 300 min Netzwerk weg
// 7 = Ist ueber 300 min Netzwerk weg
// 8 = Ist ausgeloest
unsigned long zeitSpeicher[] = {0,0,0,0,0,0,0,0,0};
unsigned long timer = 0;
unsigned long warteButton = 0;
int fehlerAnzeige = 0;

int quittButtonZaehler = 0;
int reiniugungsButtonZaehler = 0;
int motorButtonZaehler = 0;

void setup(){
  Serial.begin(115200);

  // QuitButton
  pinMode(A0, INPUT);
  // DS18B20 initialisieren
  DS18B20.begin();
  // LCD-Display initialisieren
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0,0);
  lcd.print("    Starte...");
  lcd.setCursor(0,1);
  lcd.print("  Tankwaechter");
}



void leseTemp() {
  DS18B20.requestTemperatures();
  temperatur = DS18B20.getTempCByIndex(0);
  checkTemp();
  // Ausgabe im seriellen Monitor
  Serial.println(String(temperatur) + " °C");
  lcd.setCursor(1,0);
  lcd.print("Temp: " + String(temperatur) + " \337C"); 
  switch (fehlerAnzeige){
    case 0:
      lcd.setCursor(0,1);
      lcd.print("  Abholbereit!");
      break;
    case 1:
      lcd.setCursor(0,1);
      lcd.print(" Nicht Laden!!!");
      break;
  }
}

// Check Temperatur nach Zeit
void checkTemp() {
  if (temperatur >= 28){
    Serial.println("Ueber 28 Grad");
    if (zeitSpeicher[2] >= 0 && zeitSpeicher[5] == 0) {
      zeitSpeicher[2] = millis(); 
      zeitSpeicher[3] = 0;
      zeitSpeicher[4] = 0;
      zeitSpeicher[5] = 1;
    }
    if (millis() >= zeitSpeicher[2] + (300*60000)){
      Serial.println("Ausgeloest! Temperatur ueber 28 Grad fuer 300 Minuten!");
      zeitSpeicher[5] = 0;
      fehlerAnzeige = 1;
    }
  }
  else if (temperatur >= 16){
    Serial.println("Ueber 16 Grad");
    if (zeitSpeicher[1] >= 0 && zeitSpeicher[4] == 0) {
      zeitSpeicher[1] = millis(); 
      zeitSpeicher[3] = 0;
      zeitSpeicher[4] = 1;
      zeitSpeicher[5] = 0;
    }
    if (millis() >= zeitSpeicher[1] + (1*60000)){
      Serial.println("Ausgeloest! Temperatur ueber 16 Grad fuer 360 Minuten!");
      zeitSpeicher[4] = 0;
      fehlerAnzeige = 1; 
    }
  }
  else if (temperatur >= 13) {
    Serial.println("Ueber 13 Grad");
    if (zeitSpeicher[0] >= 0 && zeitSpeicher[3] == 0) {
      zeitSpeicher[0] = millis(); 
      zeitSpeicher[3] = 1;
      zeitSpeicher[4] = 0;
      zeitSpeicher[5] = 0;
    }
    if (millis() >= zeitSpeicher[0] + (1*60000)){
      Serial.println("Ausgeloest! Temperatur ueber 13 Grad fuer 600 Minuten!");
      zeitSpeicher[3] = 0; 
      fehlerAnzeige = 1;
    }
  }
}

void quittieren() {
  if (quittButtonZaehler >= 1 && fehlerAnzeige != 0) {
    lcd.setCursor(0,1);
    lcd.print("   Quittiert!  ");
    Serial.println("Quittiert: Summer");
  } 
  else if (quittButtonZaehler >= 5 && fehlerAnzeige != 0) {
    fehlerAnzeige = 0;
    lcd.setCursor(0,1);
    lcd.print("   Quittiert!  ");
    Serial.println("Quittiert: Fehler");
  }
}



void loop(){

  if (Serial.available() > 0) {
    // Lies das eingehende Byte:
    incomingByte = Serial.read();

    // Ausgeben:
    Serial.print("I received: ");
    Serial.println(incomingByte, DEC);

    switch (incomingByte) {
    case 10:
      if (fehlerAnzeige != 0) {
        lcd.setCursor(0,1);
        lcd.print("   Quittiert!  ");
        Serial.println("Quittiert: Summer");
      }
      break;
    case 11:
      if (fehlerAnzeige =! 0) {
        fehlerAnzeige = 0;
        lcd.setCursor(0,1);
        lcd.print("   Quittiert!  ");
        Serial.println("Quittiert: Fehler");
      }
      break;
  }
  }
  
  if (millis() >= (30*1000) + timer){
    timer = millis();
    leseTemp();
  }

}
