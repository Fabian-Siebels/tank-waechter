// tank-waechter

// Temperatur mehr als 600 Min über 13°C
// Temperatur mehr als 360 Min über 16°C
// Temperatur mehr als 300 Min über 28°C
// Netzwerkstörung über 300 Min


// Eingangsvariable
// var eingangsTemperatur = 10;

// Willi und der Zeitgeist
var zeitSpeicher = {
    ueberT600: 0,
    ueberT360: 0,
    ueberT300: 0,
    ueberN300: 0
}

// UeberprüfungsAlgorithmus
function checkTemp(eingangsTemperatur) {
    console.log(eingangsTemperatur)
    if (eingangsTemperatur >= 13) {
        console.log("Über 13°C")
    } else if (eingangsTemperatur >= 16) {
        console.log("Über 16°C")
    } else if (eingangsTemperatur >= 28) {
        console.log("Über 28°C")
    }
}

checkTemp(17);