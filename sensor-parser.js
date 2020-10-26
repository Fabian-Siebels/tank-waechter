// Parser fuer den Tanksensor vom ESP8266 ueber MQTT zur Inlux Datenbank

require('dotenv')

// Import InfluxDB
const Influx = require('influx');

// Variablen für die Datenbank
const serverhost = process.env.SERVERHOST;
const dbname = "tankwaechter";
const measurementname = "tempSensor";

const influx = new Influx.InfluxDB({
    host: serverhost,
    database: dbname,
    schema: [{
        measurement: measurementname,
        fields: {
            temperatur: Influx.FieldType.FLOAT,
            id: Influx.FieldType.INTEGER 
        },
        tags: [
            measurementname
        ]
    }]
});

// Überprüfe ob die Datenbank vorhanden ist, sonnst erstellen
influx.getDatabaseNames()
    .then(names => {
        if (!names.includes(dbname)) {
            return influx.createDatabase(dbname);
        }
    })
    .catch(err => {
        console.error(`Konnte keine Datenbank erstellen!`);
    })


function write2db(eingangsTemp) {
    influx.writePoints([{
        measurement: measurementname,
        fields: {
            temperatur: eingangsTemp,
            id: 12
        },
    }]).catch(err => {
        console.log(`Error beim Einfügen in die DB: ${err.stack}`);
    });
}


write2db(14);