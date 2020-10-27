var fs = require('fs');

var name = "TEST4";
var id = "10"
var delindex;


function lese() {
    fs.readFile('user.txt', 'utf8', function(err, data) {
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
    fs.readFile('user.txt', 'utf8', function(err, data) {
        if (!data) {
            fs.writeFile('user.txt', `{"telegramname":"${telegramuser}", "telegramid":"${telegramid}"}`, function (err, file) {
                if (err) throw err;
                console.log("Hinzugefügt")
            });
        } else {
            fs.writeFile('user.txt', `${data}, {"telegramname":"${telegramuser}", "telegramid":"${telegramid}"}`, function (err, file) {
                if (err) throw err;
                console.log("Eingefügt")
            });
        }
    })
}


function deleteUser(telegramid) {
    fs.readFile('user.txt', 'utf8', function(err, data) {
        if (!data) {
            console.log("Keine Daten in der Datei!")
        } else {
            let zwischenspeicher = "[" + data + "]";
            let userobjekt = JSON.parse(zwischenspeicher);
            for (let i = userobjekt.length -1; i >= 0; --i) {
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

// schreibeUser(name, id);
// lese();
deleteUser(id)
