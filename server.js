// tank-waechter

// Temperatur mehr als 600 Min über 13°C
// Temperatur mehr als 360 Min über 16°C
// Temperatur mehr als 300 Min über 28°C
// Netzwerkstörung über 300 Min


// Env laden
require("dotenv").config();

// Datumskonstanten
const optionen = { year: 'numeric', month: 'numeric', day: 'numeric' }

// Konstanten fuer die Influx Datenbank
const serverhost = process.env.SERVERHOST;
const dbname = "tankwaechter";
const measurementname = "tempSensor";
const pindb = "pindb";

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
    .catch(err => {
        console.error(`Konnte keine Datenbank erstellen!`);
    })

// Letzte Temperatur aus der Influx holen
function getTemp() {
    influx.query(`SELECT last(temperatur) FROM tempSensor`).then(result => {
        eingangsTemperatur = result[0].last;
        // return eingangsTemperatur;
    }).catch(err => {
        console.log('Keine Daten gefunden!');
    })
}

// Telegram schnick schnack
const TeleBot = require('telebot');
var bot = new TeleBot({
    token: process.env.TOKEN
});

var fs = require('fs');

function lese() {
    fs.readFile('user.txt', 'utf8', function (err, data) {
        // console.log(data);
        if (!data) {
            console.log("Keine Daten in der Datei!")
        } else {
            let zwischenspeicher = "[" + data + "]";
            let userobjekt = JSON.parse(zwischenspeicher);
            for (let i = 0; i < userobjekt.length; i++) {
                console.log("I=" + i + "ID=" + userobjekt[i].telegramid);
            }
        }
    })
}

function schreibeUser(telegramuser, telegramid) {
    fs.readFile('user.txt', 'utf8', function (err, data) {
        let zwischenspeicher = "[" + data + "]";
        let userobjekt = JSON.parse(zwischenspeicher);
        if (telegramid.toString().includes("-")) {
            botsendmsg("⚠️ *Diese Software ist nicht für Gruppen geeignet!*", telegramid)
        } else {
            if (!data) {
                fs.writeFile('user.txt', `{"telegramname":"${telegramuser}", "telegramid":"${telegramid}"}`, function (err, file) {
                    if (err) throw err;
                    botsendmsg("Jetzt erhälst du Nachrichten von deinem Tankwächter!", telegramid)
                });
            } else {
                for (let i = 0; i < userobjekt.length; i++) {
                    if (userobjekt[i].telegramid == telegramid) {
                        botsendmsg("Du bist bereits angemeldet!", telegramid);
                    } else {
                        fs.writeFile('user.txt', `${data}, {"telegramname":"${telegramuser}", "telegramid":"${telegramid}"}`, function (err, file) {
                            if (err) throw err;
                            botsendmsg("Ab jetzt erhälst du Nachrichten von deinem Tankwächter!", telegramid)
                        });
                    }
                }
            }
        }
    })
}

function deleteUser(telegramid) {
    fs.readFile('user.txt', 'utf8', function (err, data) {
        if (!data) {
            console.log("Keine Daten in der Datei!")
        } else {
            let zwischenspeicher = "[" + data + "]";
            let userobjekt = JSON.parse(zwischenspeicher);
            for (let i = userobjekt.length - 1; i >= 0; --i) {
                if (userobjekt[i].telegramid == telegramid) {
                    userobjekt.splice(i, 1);
                }
            }
            fs.writeFile('user.txt', JSON.stringify(userobjekt).split('[').join('').split(']').join(''), function (err, file) {
                if (err) throw err;
                console.log(`ERROR:`);
            })
        }
    })
}

function botsendmsg(message, id) {
    bot.sendMessage(id, message, {
        parseMode: 'Markdown'
    });
}

bot.on(['/temp'], (msg) => {
    influx.query(`SELECT last(temperatur) FROM tempSensor`).then(result => {
        let parsedTime = new Date(result[0].time._nanoISO);
        let zeit = parsedTime.toLocaleTimeString('de-DE');
        let datum = parsedTime.getDate() + "." + (parsedTime.getMonth() + 1) + "." + parsedTime.getFullYear();
        let tempmsg = "Aktuelle Temperatur: " + result[0].last + " °C \nGemessen am: " + datum + " um " + zeit + " Uhr";
        return bot.sendMessage(msg.chat.id, tempmsg, {
            parseMode: 'Markdown'
        });
    }).catch(err => {
        console.log('Keine Daten gefunden!');
    })
})

bot.on([/^\/pin (.+)$/], (msg, props) => {
    const text = props.match[1];
    if (text == process.env.PIN) {
        let erfolg = "Erfolgreich!";
        schreibeUser(msg.from.username, msg.chat.id)
    } else {
        let fehler = "⚠️ Dein Pin ist Falsch!";
        return bot.sendMessage(msg.chat.id, fehler);
    }
});

bot.on(['/start'], (msg) => {
    console.log(msg.from.id);
    let nachricht = "🖐 Moin, gebe bitte deinen PIN per folgenden Befehl ein: /pin <deinepin> \n \n *Bitte auf Kleinschreibung achten!*";
    return bot.sendMessage(msg.chat.id, nachricht, {
        parseMode: 'Markdown'
    });
});

bot.on(['/stop'], (msg) => {
    deleteUser(msg.chat.id)
    let nachricht = "🖐 Moin, du wurdest aus dem System entfernt!";
    return bot.sendMessage(msg.chat.id, nachricht, {
        parseMode: 'Markdown'
    });
});

function warning2telegram(uegrad, uezeit) {
    let msg = "*⚠️ Alarmmeldung:* \n *Die Milch ist seit " + uezeit + " Minuten über " + uegrad + " C°!*";
    fs.readFile('user.txt', 'utf8', function (err, data) {
        if (!data) {
            console.log("Keine Daten in der Datei!")
        } else {
            let zwischenspeicher = "[" + data + "]";
            let userobjekt = JSON.parse(zwischenspeicher);
            for (let i = 0; i < userobjekt.length; i++) {
                bot.sendMessage(userobjekt[i].telegramid, msg, {
                    parseMode: 'Markdown'
                });
            }
        }
    })
}

bot.on(['/tag'], (msg) => {
    influx.query(`SELECT MAX(temperatur) FROM tempSensor WHERE time > now() - 1h;SELECT MIN(temperatur) FROM tempSensor WHERE time > now() - 1h`).then(ergebnis => {
        let parsedTimeMax = new Date(ergebnis[0][0].time._nanoISO);
        let zeitMax = parsedTimeMax.toLocaleTimeString('de-DE');
        let datumMax = parsedTimeMax.getDate() + "." + (parsedTimeMax.getMonth() + 1) + "." + parsedTimeMax.getFullYear();
        let parsedTimeMin = new Date(ergebnis[1][0].time._nanoISO);
        let zeitMin = parsedTimeMin.toLocaleTimeString('de-DE');
        let datumMin = parsedTimeMin.getDate() + "." + (parsedTimeMin.getMonth() + 1) + "." + parsedTimeMin.getFullYear();
        let tempmsg = "Min/Max Temperaturen der letzten 24h\n\nMinimale Temperatur: " + ergebnis[1][0].min + " °C \n" + datumMin + " um " + zeitMin + " Uhr\n\nMaximale Temperatur: " + ergebnis[0][0].max + " °C \n" + datumMax + " um " + zeitMax + " Uhr";
        return bot.sendMessage(msg.chat.id, tempmsg, {
            parseMode: 'Markdown'
        });
    }).catch(err => {
        console.log(err);
    })
})


// Eingangsvariable GLOBAL
var eingangsTemperatur;

// Zeitkonstante bei 13°C
var zeitkonstante13 = 15000;

// Zeitkonstante bei 16°C
var zeitkonstante16 = 36000;

// Zeitkonstante bei 28°C
var zeitkonstante28 = 30000;


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
// setInterval(checkTemp, 1000);