const LCD = require('raspberrypi-liquid-crystal');
const lcd = new LCD( 1, 0x27, 16, 2 );

lcd.clearSync();
lcd.printSync( 'Hello' );
lcd.setCursorSync(0, 1);
lcd.printSync( 'World' );