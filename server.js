// tank-waechter

// Temperatur mehr als 600 Min über 13°C
// Temperatur mehr als 360 Min über 16°C
// Temperatur mehr als 300 Min über 28°C
// Netzwerkstörung über 300 Min

// Env laden
require("dotenv").config();

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

// Telegram schnick schnack
const TeleBot = require('telebot');
var bot = new TeleBot({
    token: process.env.TOKEN
});

bot.on([/^\/pin (.+)$/], (msg, props) => {
    const text = props.match[1];
    if (text == process.env.PIN) {
        let erfolg = "Erfolgreich!";
        return bot.sendMessage(msg.from.id, erfolg);
    } else {
        let fehler = "Fehler!";
        return bot.sendMessage(msg.from.id, fehler);
    }
});

bot.on(['/start'], (msg) => {
    console.log(msg.from.id);
    let nachricht = "🖐 Moin, gebe bitte deinen PIN per folgenden Befehl ein: /pin <deinepin> \n \n *Bitte auf Kleinschreibung achten!*";
    return bot.sendMessage(msg.from.id, nachricht, {parseMode: 'Markdown'});
});

bot.on(['/stop'], (msg) => {
    console.log(msg.from.id);
    let nachricht = "🖐 Moin, du wurdest aus dem System entfernt!";
    return bot.sendMessage(msg.from.id, nachricht, {parseMode: 'Markdown'});
});

function warning2telegram(uegrad, uezeit) {
    let message = "*⚠️ Alarmmeldung:* \n *Die Milch ist seit " + uezeit + " Minuten über " + uegrad + " C°!*"
    bot.sendMessage(process.env.CHATID, message, {parseMode: 'Markdown'});
};



// Eingangsvariable
var eingangsTemperatur;

// Zeitkonstante bei 13°C
var zeitkonstante13 = 15000;

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
            warning2telegram(28, 300);
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
            warning2telegram(16, 360);
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
            warning2telegram(13, 600);
            zeitSpeicher.benutzungT600 = 0;
        }
    }
}


bot.start();
setInterval(checkTemp, 1000);