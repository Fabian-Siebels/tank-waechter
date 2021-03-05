#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#define ONE_WIRE_BUS 2

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

HTTPClient sender;

// WLAN-Daten
const char* ssid = "Fritz";
const char* password = "77027122846784678608";

//Messintervall in Sekunden
int wait = 10 * 60;

//Temperatur
float temperature;


void push(){

  //Hier wird der Wert an die Smarthome-Umgebung übertragen
  
  if (sender.begin("http://172.16.0.253:43000/api/aussenTemp/setTemp/" + String(temperature))){

    // HTTP-Code der Response speichern
    int httpCode = sender.GET();
   

    if (httpCode > 0) {
      
      // Anfrage wurde gesendet und Server hat geantwortet
      // Info: Der HTTP-Code für 'OK' ist 200
      if (httpCode == HTTP_CODE_OK) {

        // Hier wurden die Daten vom Server empfangen

        // String vom Webseiteninhalt speichern
        String payload = sender.getString();

        // Hier kann mit dem Wert weitergearbeitet werden
         // ist aber nicht unbedingt notwendig
        Serial.println(payload);
        
        
        
      }
      
    }else{
      // Falls HTTP-Error
      Serial.printf("HTTP-Error: ", sender.errorToString(httpCode).c_str());
    }

    // Wenn alles abgeschlossen ist, wird die Verbindung wieder beendet
    sender.end();
    
  }else {
    Serial.printf("HTTP-Verbindung konnte nicht hergestellt werden!");
  }

}


void setup() {
  Serial.begin(115200);
  
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(200);
    Serial.print(".");
  }

  Serial.println("Verbunden!");
  wait = wait * 1000;
  sensors.begin();
  
}


void loop() {
  
  sensors.requestTemperatures();
  Serial.print(sensors.getTempCByIndex(0));
  Serial.println(" °C");
  
  temperature = sensors.getTempCByIndex(0);
  push();
  delay(wait);

}
