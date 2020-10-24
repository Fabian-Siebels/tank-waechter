// Parser fuer den Tanksensor vom ESP8266 ueber MQTT zur Inlux Datenbank

// Import InfluxDB
const Influx = require('influx');

// Variablen für die Datenbank
const serverhost = "172.16.0.253";
const dbname = "tankwaechter";
const measurementname = "tempSensor";

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

// Überprüfe ob die Datenbank vorhanden ist, sonnst erstellen
influx.getDatabaseNames()
  .then(names => {
    if (!names.includes(dbname)) {
      return influx.createDatabase(dbname);
    }
  })


function write2db(eingangsTemp) {
    influx.writePoints([{
        measurement: measurementname,
        fields: {
            temperatur: eingangsTemp
        },
    }]).catch(err => {
        console.log(`Error beim Einfügen in die DB: ${err.stack}`);
    });
}


write2db(14);