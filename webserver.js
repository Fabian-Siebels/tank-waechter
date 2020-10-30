var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = 3000;
var cors = require('cors');
app.use(cors());

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

app.get('/api/v1',(req, res) => {
    influx.query(`SELECT * FROM tempSensor`).then(result => {
        return res.send(result)
    }).catch(err => {
        console.log('Keine Daten gefunden!');
    })
})

app.get('/api/v1/temp',(req, res) => {
    influx.query(`SELECT last(temperatur) AS temperatur FROM tempSensor`).then(result => {
        return res.send(result)
    }).catch(err => {
        console.log('Keine Daten gefunden!');
    })
})


server.listen(port, function () {
console.log('Webserver läuft und hört auf Port %d', port);
});



app.use(express.static(__dirname + '/webserver'));