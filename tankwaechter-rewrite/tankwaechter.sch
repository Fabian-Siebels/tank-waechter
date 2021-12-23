EESchema Schematic File Version 4
EELAYER 30 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 1 1
Title ""
Date ""
Rev ""
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L MCU_Module:WeMos_D1_mini U?
U 1 1 60965FCA
P 2250 2250
F 0 "U?" H 2250 1361 50  0000 C CNN
F 1 "WeMos_D1_mini" H 2250 1270 50  0000 C CNN
F 2 "Module:WEMOS_D1_mini_light" H 2250 1100 50  0001 C CNN
F 3 "https://wiki.wemos.cc/products:d1:d1_mini#documentation" H 400 1100 50  0001 C CNN
	1    2250 2250
	1    0    0    -1  
$EndComp
$Comp
L Device:Buzzer BZ?
U 1 1 60967ABC
P 3850 2300
F 0 "BZ?" H 4002 2329 50  0000 L CNN
F 1 "Summer" H 4002 2238 50  0000 L CNN
F 2 "" V 3825 2400 50  0001 C CNN
F 3 "~" V 3825 2400 50  0001 C CNN
	1    3850 2300
	1    0    0    -1  
$EndComp
$Comp
L Interface_Expansion:MCP23017_SO U?
U 1 1 609691CD
P 6750 2550
F 0 "U?" H 6750 3831 50  0000 C CNN
F 1 "MCP23017_SO" H 6750 3740 50  0000 C CNN
F 2 "Package_SO:SOIC-28W_7.5x17.9mm_P1.27mm" H 6950 1550 50  0001 L CNN
F 3 "http://ww1.microchip.com/downloads/en/DeviceDoc/20001952C.pdf" H 6950 1450 50  0001 L CNN
	1    6750 2550
	1    0    0    -1  
$EndComp
$Comp
L Connector:Screw_Terminal_01x03 J?
U 1 1 6096AAE4
P 1800 4900
F 0 "J?" H 1880 4942 50  0000 L CNN
F 1 "Milchtank DS18B20" H 1880 4851 50  0000 L CNN
F 2 "" H 1800 4900 50  0001 C CNN
F 3 "~" H 1800 4900 50  0001 C CNN
	1    1800 4900
	1    0    0    -1  
$EndComp
$Comp
L Connector:Screw_Terminal_01x03 J?
U 1 1 6096BBCF
P 1800 5250
F 0 "J?" H 1880 5292 50  0000 L CNN
F 1 "Check Spuehlen" H 1880 5201 50  0000 L CNN
F 2 "" H 1800 5250 50  0001 C CNN
F 3 "~" H 1800 5250 50  0001 C CNN
	1    1800 5250
	1    0    0    -1  
$EndComp
$Comp
L Connector:Screw_Terminal_01x03 J?
U 1 1 6096CD6C
P 1800 5650
F 0 "J?" H 1880 5692 50  0000 L CNN
F 1 "Check Kuehlen" H 1880 5601 50  0000 L CNN
F 2 "" H 1800 5650 50  0001 C CNN
F 3 "~" H 1800 5650 50  0001 C CNN
	1    1800 5650
	1    0    0    -1  
$EndComp
$Comp
L Connector:Conn_01x04_Male J?
U 1 1 6097020E
P 6550 5050
F 0 "J?" H 6658 5331 50  0000 C CNN
F 1 "Display" H 6658 5240 50  0000 C CNN
F 2 "" H 6550 5050 50  0001 C CNN
F 3 "~" H 6550 5050 50  0001 C CNN
	1    6550 5050
	1    0    0    -1  
$EndComp
$Comp
L Sensor_Temperature:DS18B20 U?
U 1 1 60972586
P 4000 4050
F 0 "U?" H 3770 4096 50  0000 R CNN
F 1 "DS18B20" H 3770 4005 50  0000 R CNN
F 2 "Package_TO_SOT_THT:TO-92_Inline" H 3000 3800 50  0001 C CNN
F 3 "http://datasheets.maximintegrated.com/en/ds/DS18B20.pdf" H 3850 4300 50  0001 C CNN
	1    4000 4050
	1    0    0    -1  
$EndComp
$Comp
L Connector:Conn_01x03_Male J?
U 1 1 60973BAF
P 6550 5750
F 0 "J?" H 6658 6031 50  0000 C CNN
F 1 "Spannungsmessung" H 6658 5940 50  0000 C CNN
F 2 "" H 6550 5750 50  0001 C CNN
F 3 "~" H 6550 5750 50  0001 C CNN
	1    6550 5750
	1    0    0    -1  
$EndComp
Wire Wire Line
	2650 1750 4900 1750
Wire Wire Line
	4900 1750 4900 5650
Wire Wire Line
	4900 5650 6750 5650
Wire Wire Line
	6750 5750 4850 5750
Wire Wire Line
	2150 1350 2150 1450
Wire Wire Line
	2150 1350 4850 1350
Wire Wire Line
	6750 5850 4800 5850
Wire Wire Line
	4800 5850 4800 4950
Wire Wire Line
	6750 4950 4800 4950
Connection ~ 4800 4950
Wire Wire Line
	4800 4950 4800 3050
Wire Wire Line
	6750 5050 4850 5050
Wire Wire Line
	4850 1350 4850 5050
Connection ~ 4850 5050
Wire Wire Line
	4850 5050 4850 5750
Wire Wire Line
	6750 5150 3200 5150
Wire Wire Line
	3200 5150 3200 4100
Wire Wire Line
	3200 2050 2650 2050
Wire Wire Line
	6750 5250 3100 5250
Wire Wire Line
	3100 5250 3100 1950
Wire Wire Line
	3100 1950 2650 1950
Text Label 6300 5250 0    50   ~ 0
SCL
Text Label 6300 5150 0    50   ~ 0
SDA
Text Label 6300 5050 0    50   ~ 0
5V
Text Label 6300 4950 0    50   ~ 0
GND
Text Label 6300 5650 0    50   ~ 0
A0
Text Label 6300 5750 0    50   ~ 0
5V
Text Label 6300 5850 0    50   ~ 0
GND
Wire Wire Line
	1600 5150 1100 5150
Wire Wire Line
	1100 5150 1100 3600
Wire Wire Line
	1100 3600 2950 3600
Wire Wire Line
	2950 3600 2950 2250
Wire Wire Line
	2950 2250 2650 2250
Wire Wire Line
	1600 5550 1050 5550
Wire Wire Line
	1050 5550 1050 3550
Wire Wire Line
	1050 3550 2850 3550
Wire Wire Line
	2850 3550 2850 2150
Wire Wire Line
	2850 2150 2650 2150
Wire Wire Line
	1600 5250 1400 5250
Wire Wire Line
	1400 5250 1400 5650
Wire Wire Line
	1400 5850 4800 5850
Connection ~ 4800 5850
Wire Wire Line
	1600 5650 1400 5650
Connection ~ 1400 5650
Wire Wire Line
	1400 5650 1400 5850
Wire Wire Line
	800  5350 800  5000
Wire Wire Line
	2350 1200 2350 1450
Wire Wire Line
	800  5350 1600 5350
Wire Wire Line
	1600 5750 800  5750
Wire Wire Line
	800  5750 800  5350
Connection ~ 800  5350
Text Label 1450 5750 0    50   ~ 0
3,3V
Text Label 1450 5350 0    50   ~ 0
3,3V
Text Label 1450 5250 0    50   ~ 0
GND
Text Label 1450 5650 0    50   ~ 0
GND
Text Label 1450 5150 0    50   ~ 0
D4
Text Label 1450 5550 0    50   ~ 0
D3
Wire Wire Line
	2650 1850 3750 1850
Wire Wire Line
	3750 1850 3750 2200
Wire Wire Line
	3750 2400 3750 3050
Connection ~ 3750 3050
Wire Wire Line
	3750 3050 3400 3050
Wire Wire Line
	4000 4350 3400 4350
Wire Wire Line
	3400 4350 3400 4200
Connection ~ 3400 3050
Wire Wire Line
	3400 3050 2250 3050
Wire Wire Line
	4300 4050 4300 3850
Wire Wire Line
	4300 3550 3200 3550
Connection ~ 3200 3550
Wire Wire Line
	3200 3550 3200 2050
Wire Wire Line
	4000 3750 4000 3700
Connection ~ 800  3700
Wire Wire Line
	800  3700 800  1200
Wire Wire Line
	1600 4800 1600 4200
Wire Wire Line
	1600 4200 3400 4200
Connection ~ 3400 4200
Wire Wire Line
	3400 4200 3400 3050
Wire Wire Line
	1600 4900 1500 4900
Wire Wire Line
	1500 4900 1500 4100
Wire Wire Line
	1500 4100 3200 4100
Connection ~ 3200 4100
Wire Wire Line
	3200 4100 3200 3550
Connection ~ 800  5000
$Comp
L Device:R R2
U 1 1 60992E43
P 2150 4550
F 0 "R2" H 2220 4596 50  0000 L CNN
F 1 "4,7k" H 2220 4505 50  0000 L CNN
F 2 "" V 2080 4550 50  0001 C CNN
F 3 "~" H 2150 4550 50  0001 C CNN
	1    2150 4550
	1    0    0    -1  
$EndComp
$Comp
L Device:R R1
U 1 1 6099491E
P 3600 4650
F 0 "R1" H 3670 4696 50  0000 L CNN
F 1 "4,7k" H 3670 4605 50  0000 L CNN
F 2 "" V 3530 4650 50  0001 C CNN
F 3 "~" H 3600 4650 50  0001 C CNN
	1    3600 4650
	1    0    0    -1  
$EndComp
Wire Wire Line
	4000 3700 800  3700
Wire Wire Line
	1600 5000 800  5000
Wire Wire Line
	800  5000 800  4700
Wire Wire Line
	800  4700 2150 4700
Connection ~ 800  4700
Wire Wire Line
	800  4700 800  3700
Wire Wire Line
	2150 4400 1350 4400
Wire Wire Line
	1350 4400 1350 4900
Wire Wire Line
	1350 4900 1500 4900
Connection ~ 1500 4900
Wire Wire Line
	2150 4700 3450 4700
Wire Wire Line
	3450 4700 3450 4800
Wire Wire Line
	3450 4800 3600 4800
Connection ~ 2150 4700
Wire Wire Line
	3600 4500 4400 4500
Wire Wire Line
	4400 4500 4400 3850
Wire Wire Line
	4400 3850 4300 3850
Connection ~ 4300 3850
Wire Wire Line
	4300 3850 4300 3550
Wire Wire Line
	3100 1950 6050 1950
Wire Wire Line
	6050 1950 6050 1850
Connection ~ 3100 1950
Wire Wire Line
	3200 2050 5900 2050
Wire Wire Line
	5900 2050 5900 1750
Wire Wire Line
	5900 1750 6050 1750
Connection ~ 3200 2050
$Comp
L Device:R R?
U 1 1 609A854D
P 5550 2650
F 0 "R?" V 5343 2650 50  0000 C CNN
F 1 "R" V 5434 2650 50  0000 C CNN
F 2 "" V 5480 2650 50  0001 C CNN
F 3 "~" H 5550 2650 50  0001 C CNN
	1    5550 2650
	0    1    1    0   
$EndComp
Wire Wire Line
	800  1200 2350 1200
Connection ~ 2350 1200
Wire Wire Line
	2350 1200 5400 1200
Wire Wire Line
	5700 2650 6050 2650
Wire Wire Line
	5400 1450 6750 1450
Wire Wire Line
	5400 1200 5400 1450
Connection ~ 5400 1450
Wire Wire Line
	5400 1450 5400 2650
Wire Wire Line
	5700 3050 5700 3150
Wire Wire Line
	5700 3650 6750 3650
Wire Wire Line
	3750 3050 4800 3050
Connection ~ 4800 3050
Wire Wire Line
	4800 3050 5200 3050
Wire Wire Line
	5700 3150 6050 3150
Connection ~ 5700 3150
Wire Wire Line
	5700 3150 5700 3250
Wire Wire Line
	5700 3250 6050 3250
Connection ~ 5700 3250
Wire Wire Line
	5700 3250 5700 3350
Wire Wire Line
	5700 3350 6050 3350
Connection ~ 5700 3350
Wire Wire Line
	5700 3350 5700 3650
$Comp
L Connector:Screw_Terminal_01x02 J?
U 1 1 609BFF4D
P 8250 1300
F 0 "J?" H 8330 1292 50  0000 L CNN
F 1 "Screw_Terminal_01x02" H 8330 1201 50  0000 L CNN
F 2 "" H 8250 1300 50  0001 C CNN
F 3 "~" H 8250 1300 50  0001 C CNN
	1    8250 1300
	1    0    0    -1  
$EndComp
$Comp
L Connector:Conn_01x15_Male J?
U 1 1 609C6D20
P 7700 2550
F 0 "J?" H 7808 3431 50  0000 C CNN
F 1 "Conn_01x15_Male" H 7808 3340 50  0000 C CNN
F 2 "" H 7700 2550 50  0001 C CNN
F 3 "~" H 7700 2550 50  0001 C CNN
	1    7700 2550
	1    0    0    -1  
$EndComp
Wire Wire Line
	8050 1300 7450 1300
Wire Wire Line
	7450 1300 7450 1750
Wire Wire Line
	8050 1400 5200 1400
Wire Wire Line
	5200 1400 5200 3050
Connection ~ 5200 3050
Wire Wire Line
	5200 3050 5700 3050
Wire Wire Line
	7450 1850 7900 1850
Wire Wire Line
	7450 1950 7900 1950
Wire Wire Line
	7450 2050 7900 2050
Wire Wire Line
	7450 2150 7900 2150
Wire Wire Line
	7450 2250 7900 2250
Wire Wire Line
	7450 2350 7900 2350
Wire Wire Line
	7450 2450 7900 2450
Wire Wire Line
	7450 2650 7450 2550
Wire Wire Line
	7450 2550 7900 2550
Wire Wire Line
	7450 2750 7450 2700
Wire Wire Line
	7450 2700 7500 2700
Wire Wire Line
	7500 2700 7500 2650
Wire Wire Line
	7500 2650 7900 2650
Wire Wire Line
	7450 2850 7450 2800
Wire Wire Line
	7450 2800 7500 2800
Wire Wire Line
	7500 2800 7500 2750
Wire Wire Line
	7500 2750 7900 2750
Wire Wire Line
	7450 2950 7450 2900
Wire Wire Line
	7450 2900 7500 2900
Wire Wire Line
	7500 2900 7500 2850
Wire Wire Line
	7500 2850 7900 2850
Wire Wire Line
	7450 3050 7450 3000
Wire Wire Line
	7450 3000 7500 3000
Wire Wire Line
	7500 3000 7500 2950
Wire Wire Line
	7500 2950 7900 2950
Wire Wire Line
	7450 3150 7500 3150
Wire Wire Line
	7500 3150 7500 3050
Wire Wire Line
	7500 3050 7900 3050
Wire Wire Line
	7450 3250 7550 3250
Wire Wire Line
	7550 3250 7550 3150
Wire Wire Line
	7550 3150 7900 3150
Wire Wire Line
	7450 3350 7600 3350
Wire Wire Line
	7600 3350 7600 3250
Wire Wire Line
	7600 3250 7900 3250
$EndSCHEMATC
