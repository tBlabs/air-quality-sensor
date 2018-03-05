import { IRunMode } from './services/runMode/IRunMode';
import { RunMode } from './services/runMode/RunMode';
import { IEnvironment } from './services/environment/IEnvironment';
import { ILogger } from './services/logger/ILogger';
import { Logger } from './services/logger/Logger';
import { injectable, inject } from 'inversify';
import { Environment } from './services/environment/Environment';
import { Types } from './IoC/Types';
import * as SerialPort from 'serialport';
import * as shell from 'shelljs';

@injectable()
export class Main
{
    constructor(
        @inject(Types.ILogger) private _log: ILogger,
        @inject(Types.IEnvironment) private _env: IEnvironment)
    { }

    public ParseSensorFrame(data): number
    {
        if (data.length === 10)
        {
             if ((data[0] === 0xAA) && (data[1] === 0xC0) && (data[9] === 0xAB))
            {
                const pm25 = (data[3] * 256 + data[2]) / 10;
                const pm10 = (data[5] * 256 + data[4]) / 10;
                const out = 'pm25: ' + pm25.toFixed(1) + ', pm10: ' + pm10.toFixed(1) + ' (ug/m3) @ ' + (new Date()).toLocaleTimeString();
                // process.stdout.write(out + '           \r');
                console.log(out);  
                return pm25;
            }    
        }
        return 0;
    }



    public async Run(): Promise<void>
    {
        this._log.Info('Main.Run', 'Starting in "' + this._env.ValueOf('MODE') + '" mode');

        //  shell.exec(`sudo usermod -a -G dialout $USER`);
        // const usbs = shell.grep(/ttyUSB/i, '/dev');
        const devs = shell.ls('/dev');
        const usbs = devs.filter(d => d.toString().match(/ttyUSB\d+/i));
        console.log('Available ports:', usbs.join(', '));
        const port = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });
        let buffer: Buffer = Buffer.alloc(100);
        port.on('data', (data: Buffer) =>
        {
            // console.log(data);
            //  if (data.length<10)
            //  {
            //     buffer = Buffer.concat([buffer, data]);
            //     console.log(buffer);
            //  }
                 const pm25 = this.ParseSensorFrame(data);
            // data.forEach(d=>console.log(d));
        });
        // port.close();
        // console.log(port);
        port.on('error', (err) =>
        {
            console.log('serial err:', err);
        });

        port.on('open', () =>
        {
            console.log('open');
        });

        port.write('abc');

        //while(1); 
    }
}
