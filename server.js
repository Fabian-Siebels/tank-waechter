// tank-waechter

// Temperatur mehr als 600 Min über 13°C
// Temperatur mehr als 360 Min über 16°C
// Temperatur mehr als 300 Min über 28°C
// Netzwerkstörung über 300 Min

// Konstanten fuer die Influx Datenbank
const serverhost = "172.16.0.253";
const dbname = "tankwaechter";
const measurementname = "tempSensor";

const Influx = require("influx");

const influx = new Influx.InfluxDB({
    host: serverhost,
    database: dbname,
    schema: [{
        measurement: measurementname,
        fields: {
            temperatur: Influx.FieldType.FLOAT
        },
        tags: [
            measurementname
        ]
    }]
});


influx.getDatabaseNames()
    .then(names => {
        if (!names.includes(dbname)) {
            return influx.createDatabase(dbname);
        }
    })



// Eingangsvariable
var eingangsTemperatur;

// Zeitkonstante bei 13°C
var zeitkonstante13 = 60000;

// Zeitkonstante bei 16°C
var zeitkonstante16 = 36000;

// Zeitkonstante bei 28°C
var zeitkonstante28 = 30000;

// Letzte Temperatur aus der Influx holen
function getTemp() {
    influx.query(`SELECT last(temperatur) FROM tempSensor`).then(result => {
        eingangsTemperatur = result[0].last;
        return;
    });
}


// Willi und der Zeitgeist
var zeitSpeicher = {
    ueberT600: 0,
    ueberT360: 0,
    ueberT300: 0,
    ueberN300: 0,
    benutzungT600: 0,
    benutzungT360: 0,
    benutzungT300: 0
}

// UeberprüfungsAlgorithmus
function checkTemp() {
    getTemp()
    if (eingangsTemperatur >= 28) {
        console.log("Über 28C")
        if (zeitSpeicher.ueberT300 >= 0 && zeitSpeicher.benutzungT300 == 0) {
            zeitSpeicher.ueberT300 = Date.now() + zeitkonstante28;
            zeitSpeicher.benutzungT600 = 0;
            zeitSpeicher.benutzungT360 = 0;
            zeitSpeicher.benutzungT300 = 1;
        }
        if (Date.now() >= zeitSpeicher.ueberT300) {
            console.log("Zeit voll über 28°C");
            zeitSpeicher.benutzungT300 = 0;
        }
    } else if (eingangsTemperatur >= 16) {
        console.log("Über 16°C")
        if (zeitSpeicher.ueberT360 >= 0 && zeitSpeicher.benutzungT360 == 0) {
            zeitSpeicher.ueberT360 = Date.now() + zeitkonstante16;
            zeitSpeicher.benutzungT600 = 0;
            zeitSpeicher.benutzungT360 = 1;
            zeitSpeicher.benutzungT300 = 0;
        }
        if (Date.now() >= zeitSpeicher.ueberT360) {
            console.log("Zeit Voll über 16°C!")
            zeitSpeicher.benutzungT360 = 0;
        }
    } else if (eingangsTemperatur >= 13) {
        console.log("Über 13°C")
        if (zeitSpeicher.ueberT600 >= 0 && zeitSpeicher.benutzungT600 == 0) {
            zeitSpeicher.ueberT600 = Date.now() + zeitkonstante13;
            zeitSpeicher.benutzungT600 = 1;
            zeitSpeicher.benutzungT360 = 0;
            zeitSpeicher.benutzungT300 = 0;
        }
        if (Date.now() >= zeitSpeicher.ueberT600) {
            console.log("Zeit Voll über 13°C")
            zeitSpeicher.benutzungT600 = 0;
        }
    }
}



setInterval(checkTemp, 1000);