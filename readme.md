# tank-waechter
#### by Fabian Siebels | 10.2020

### Anforderungen

Überwachung folgender Funktionen:
- Überwachung der Milchtemperatur mit Alarmierung für den Michlerzeuger
- Überwachung des Rührwerks mit Alarmierung für den Milcherzeuger
- Überwachung der Mindest-Reinigungstemperatur
- Speicherung von Fehlermeldungen für mind. 30 Tage
- "Nicht laden"-Funktion

Sobald die Milch die in der Milchlieferung beschriebenden Qualitätsanforderungen nicht mehr erfüllt, muss der Tankwächter ein eindeutig wahrnehmbares optisches oder akustisches Signal abgeben ("Nicht laden" Funktion).

Die "Nicht laden" Funktion ist wie folgt definiert:
- Milchtemperatur mehr als 600 Minuten über 13 °C
- Milchtemperatur mehr als 360 Minuten über 16 °C
- Milchtemperatur mehr als 300 Minuten über 28 °C
- Netzwerkstörung mehr als 300 Minuten

## Installation

1.  1Wire aktivieren

```
sudo modprobe wire
sudo modprobe w1-gpio
sudo modprobe w1-therm
```

2. Für immer aktivieren
```
sudo nano /boot/config.txt

# 1-Wire Temperatursensor, Daten an Pin 4
dtoverlay=w1-gpio
gpiopin=4
```


#### Display

i2C aktivieren
sudo apt-get install python-smbus
sudo apt-get install i2c-tool
i2cdetect -y 1      <--- x27

