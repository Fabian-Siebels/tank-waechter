const LCD = require('raspberrypi-liquid-crystal');
const lcd = new LCD( 1, 0x27, 16, 2 );

try {
    lcd.beginSync();
  } catch (e) {
    console.log(e);
  }

lcd.clearSync();
lcd.printSync( '    Siebels    ' );
lcd.setCursorSync(0, 1);
lcd.printSync( '  Tankwaechter  ' );