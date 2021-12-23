#include <OneWire.h>
#include <DallasTemperature.h>
#include <LiquidCrystal_I2C.h>
#include <SD.h>
#include <NTPClient.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <WiFiUdp.h>
#include <UniversalTelegramBot.h>
#include <ArduinoJson.h>
#include <Adafruit_MCP23017.h>


const char *ssid     = "Fritz";
const char *password = "";

#define BOT_TOKEN ""

#define tid ""

X509List cert(TELEGRAM_CERTIFICATE_ROOT);
WiFiClientSecure secured_client;
UniversalTelegramBot bot(BOT_TOKEN, secured_client);

int Bot_mtbs = 1000; //mean time between scan messages
long Bot_lasttime;   //last time messages' scan has been done

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

// MCP Portexpander intealisieren
Adafruit_MCP23017 mcp;

// SD Karte
const int chipSelect = D8;
File myFile;

// Der PIN D2 (GPIO 4) wird als BUS-Pin verwendet
#define ONE_WIRE_BUS 4

LiquidCrystal_I2C lcd(0x27,16,2);

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature DS18B20(&oneWire);
int sensorAnzahl = 0;

// Quittieren per Taster
int quittTasterState = 0;

// Summerpin Alarmsummer
int summer = 16;
unsigned long timerAlarm;

// In dieser Variable wird die Temperatur gespeichert
String temperatur;
float raumTemperatur;

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
//Timer fuer Delay leseTemp()
unsigned long timer = 0;
//Timer fuer Delay leseSpuehlen und leseKuehlen
unsigned long timerSpuelenKuehlen = 0;
unsigned long warteButton = 0;
int fehlerAnzeige = 0;

int statusSpuelen = 0;
int statusKuehlen = 0;

void setup(){
  Serial.begin(9600);
  mcp.begin();

  pinMode(summer, OUTPUT);
  // QuittTaster auf MCP
  mcp.pinMode(1, INPUT);

  WiFi.begin(ssid, password);
  secured_client.setTrustAnchors(&cert);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Ich verbinde mich mit dem Internet...");
  }
  
  Serial.println("Ich bin mit dem Internet verbunden!");

  timeClient.begin();

  bot.sendMessage(tid, "Tankwächter ist hochgefahren");
    
  // DS18B20 initialisieren
  //DS18B20.begin();
  DS18B20.begin();
  sensorAnzahl = DS18B20.getDeviceCount();
  Serial.println(sensorAnzahl, DEC);
  // LCD-Display initialisieren
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0,0);
  lcd.print("    Starte...");
  lcd.setCursor(0,1);
  lcd.print("  Tankwaechter");
  delay(1000);
  leseTemp();
}

void handleNewMessages(int numNewMessages) {
  for(int i=0; i<numNewMessages; i++) {
    String chat_id = String(bot.messages[i].chat_id);
    String text = bot.messages[i].text;
    if (text == "/status") {
      bot.sendMessage(chat_id, "Temperatur: " + String(temperatur) + " °C", "");
    }
    if (text == "/quitt") {
      bot.sendMessage(chat_id, "System wird Quittiert!", "");
      if (fehlerAnzeige != 0) {
      fehlerAnzeige = 0;
      digitalWrite(summer, LOW);
      lcd.setCursor(0,1);
      lcd.print("   Quittiert!  ");
  } 
    }
    if (text == "/start") {
      String from_name = bot.messages[i].from_name;
      if (from_name == "") from_name = "Anonymous";

      String welcome = "Moin, " + from_name + "! \xF0\x9F\x90\xAE\n\n";
      welcome = welcome + "Mit folgenden Komandos kannst du mich fernsteuern: \xF0\x9F\x8E\xAE\n"; 
      welcome = welcome + "/status : Prüfe die Temperatur \xF0\x9F\x8C\xA1\n"; 
      welcome = welcome + "/quitt : Setze die Übertemperatur zurück \xE2\x9C\x94\n";
      bot.sendMessage(chat_id, welcome, "Markdown");
    }
  }
}


void leseTemp() {
  DS18B20.requestTemperatures();
  raumTemperatur = DS18B20.getTempCByIndex(0);
  temperatur = DS18B20.getTempCByIndex(1); 
  checkTemp();
  lcd.setCursor(1,0);
  lcd.print("Temp: " + temperatur + " \337C"); 
  switch (fehlerAnzeige){
    case 0:
      lcd.setCursor(0,1);
      if (statusSpuelen == 1){
        lcd.print("S Abholbereit!");
      } else if (statusKuehlen == 1){
        lcd.print("K Abholbereit!");
      }
      lcd.print("  Abholbereit!");
      break;
    case 1:
      lcd.setCursor(0,1);
      lcd.print(" Nicht Laden!!!");
      alarmSummer();
      break;
  }
  if (!SD.begin(chipSelect)) {
    Serial.println("Kann SD Karte nicht finden!");
    // TODO Fehlermeldung auf Display
    bot.sendMessage(tid, "Fehler: Kann die SD Karte nicht finden!", "");
    return;
  }

  //Alarm Summer alle 3 Sek an
  void alarmSummer() {
    if (fehlerAnzeige = 1) {
      if (millis() >= (3*1000) + timerAlarm){
      timerAlarm = millis();
      digitalWrite(summer, !digitalRead(summer));
      }
    }
  }

  // open the file. note that only one file can be open at a time,
  // so you have to close this one before opening another.
  myFile = SD.open("data.txt", FILE_WRITE);
  timeClient.update();
  
  // if the file opened okay, write to it:
  if (myFile) {
    String jsonString = "{\"zeit\":";
    jsonString += timeClient.getEpochTime();
    jsonString += ",\"temperatur\":";
    jsonString += temperatur;
    jsonString += ",\"raumTemperatur\":";
    jsonString += raumTemperatur;
    jsonString += ",\"spuehlen\":";
    jsonString += statusSpuelen;
    jsonString += ",\"kuehlen\":";
    jsonString += statusKuehlen;
    jsonString += ",\"alarm\":";
    jsonString += fehlerAnzeige;
    jsonString += "}";
    Serial.println(jsonString);
    myFile.println(jsonString);
    // close the file:
    myFile.close();
  } else {
    // if the file didn't open, print an error:
    Serial.println("Error, kann Datei nicht laden!");
    bot.sendMessage(tid, "Fehler: Kann die Log-Datei nicht laden", "");
  }
}

// Check Temperatur nach Zeit
void checkTemp() {
  if (statusSpuelen == 0 || statusKuehlen == 0 || statusKuehlen == 1){
    if (temperatur >= "28"){
    if (zeitSpeicher[2] >= 0 && zeitSpeicher[5] == 0) {
      zeitSpeicher[2] = millis(); 
      zeitSpeicher[3] = 0;
      zeitSpeicher[4] = 0;
      zeitSpeicher[5] = 1;
    }
    if (millis() >= zeitSpeicher[2] + (300*60000)){
      zeitSpeicher[5] = 0;
      fehlerAnzeige = 1;
      String warnung = "Die Temperatur der Milch ist seit 300 Minuten über 28 °C!\n\n";
      warnung += "Möchtest du die Warnung Quittieren?\n -> /quitt <- ";
      bot.sendMessage(tid, warnung, "Markdown");
    }
  }
  else if (temperatur >= "16"){
    if (zeitSpeicher[1] >= 0 && zeitSpeicher[4] == 0) {
      zeitSpeicher[1] = millis(); 
      zeitSpeicher[3] = 0;
      zeitSpeicher[4] = 1;
      zeitSpeicher[5] = 0;
    }
    if (millis() >= zeitSpeicher[1] + (2*60000)){
      zeitSpeicher[4] = 0;
      fehlerAnzeige = 1;
      String warnung = "Die Temperatur der Milch ist seit 360 Minuten über 16 °C!\n\n";
      warnung += "Möchtest du die Warnung Quittieren?\n -> /quitt <- ";
      bot.sendMessage(tid, warnung, "Markdown"); 
    }
  }
  else if (temperatur >= "13") {
    if (zeitSpeicher[0] >= 0 && zeitSpeicher[3] == 0) {
      zeitSpeicher[0] = millis(); 
      zeitSpeicher[3] = 1;
      zeitSpeicher[4] = 0;
      zeitSpeicher[5] = 0;
    }
    if (millis() >= zeitSpeicher[0] + (1*60000)){
      zeitSpeicher[3] = 0; 
      fehlerAnzeige = 1;
      
      String warnung = "Die Temperatur der Milch ist seit 600 Minuten über 13 °C!\n\n";
      warnung += "Möchtest du die Warnung Quittieren?\n -> /quitt <- ";
      bot.sendMessage(tid, warnung, "Markdown");
    }
  }
  }
}

void loop(){  
  if (millis() >= (30*1000) + timer){
    timer = millis();
    leseTemp();
  }

  if (millis() >= (5*1000) + timerSpuelenKuehlen) {
    timerSpuelenKuehlen = millis();
    int leseStatusSpuelen = digitalRead(0);
    if (leseStatusSpuelen == LOW) {
      Serial.println("Spuelen aktiv");
      statusSpuelen = 1;
    } else {
      statusSpuelen = 0;
    }
    int leseStatusKuehlen = digitalRead(2);
    if (leseStatusKuehlen == LOW) {
      Serial.println("Kuehlen aktiv");
      statusKuehlen = 1;
    } else {
      statusKuehlen = 0;
    }
  }
  
  if (millis() > Bot_lasttime + Bot_mtbs)  {
    int numNewMessages = bot.getUpdates(bot.last_message_received + 1);
    while(numNewMessages) {
      handleNewMessages(numNewMessages);
      numNewMessages = bot.getUpdates(bot.last_message_received + 1);
    }
    Bot_lasttime = millis();
  }

// Hardware Quittiertaster abfragen
  if (mcp.digitalRead(quittTaster)==HIGH) {
    switch(quittTasterState){
      case 0;
        // Hochzaehlen
        quittTasterState = 1;
        break;
      case 1;
        // Meldung erhalten
        quittTasterState = 2;
        break;
      case 2;
        // Meldung entfernen
        quittTasterState = 0;
        fehlerAnzeige = 0;
        digitalWrite(summer, LOW);
    }
  }
}
