// Parser fuer den Tanksensor vom ESP8266 ueber MQTT zur Inlux Datenbank

require('dotenv')
var fs = require('fs');

// CRONTAB
var CronJob = require('cron').CronJob;
var job = new CronJob('*/10 * * * *', function() {
    getid()
}, null, true, 'Europe/Berlin');
job.start();

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
            temperatur: Influx.FieldType.FLOAT,
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
        },
    }]).catch(err => {
        console.log(`Error beim Einfügen in die DB: ${err.stack}`);
    });
}


var w1datei = '/sys/bus/w1/devices/w1_bus_master1/w1_master_slaves';

function parseDec(data) {
        var arr = data.split('\n');
        if (arr[0].indexOf('YES') > -1) {
                var output = data.match(/t=(-?(\d+))/);
                console.log("Erg: ", Math.round(output[1] / 100) / 10);
                write2db(Math.round(output[1] / 100) / 10);
        }
}

function getid() {
    fs.readFile(w1datei, 'utf8', function (err, data) {
        if (err) {
            console.log("Error!");
        }
        let teile = data.split('\n');
        teile.pop();
        readSensor(teile[0]);
    })
}

function readSensor(sensorID) {
    fs.readFile('/sys/bus/w1/devices/' + sensorID + '/w1_slave', 'utf8', function(err, data) {
        if (err) {
            console.log(err);
        }
        parseDec(data);
    })
}
