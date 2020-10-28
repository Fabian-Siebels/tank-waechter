var fs = require('fs');

var w1datei = '/sys/bus/w1/devices/w1_bus_master1/w1_master_slaves';

function parseDec(data) {
        var arr = data.split('\n');

        if (arr[0].indexOf('YES') > -1) {
                var output = data.match(/t=(-?(\d+))/);
                console.log("Erg: ", Math.round(output[1] / 100) / 10);
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