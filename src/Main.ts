import { byte } from './types/byte';
import { FluentParser } from './utils/fluentParser/FluentParser';
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

interface SDS018Sensor
{
    pm25L: byte;
    pm25H: byte;
    pm10L: byte;
    pm10H: byte;
}

@injectable()
export class Main
{
    constructor(
        @inject(Types.ILogger) private _log: ILogger,
        @inject(Types.IEnvironment) private _env: IEnvironment)
    { }

    // public ParseSensorFrame(data): number
    // {
    //     if (data.length === 10)
    //     {
    //         if ((data[0] === 0xAA) && (data[1] === 0xC0) && (data[9] === 0xAB))
    //         {
    //             const pm25 = (data[3] * 256 + data[2]) / 10;
    //             const pm10 = (data[5] * 256 + data[4]) / 10;
    //             const out = 'pm25: ' + pm25.toFixed(1) + ', pm10: ' + pm10.toFixed(1) + ' (ug/m3) @ ' + (new Date()).toLocaleTimeString();
    //             // process.stdout.write(out + '           \r');
    //             console.log(out);
    //             return pm25;
    //         }
    //     }
    //     return 0;
    // }

    public async Run(): Promise<void>
    {
        this._log.Info('Main.Run', 'Starting in "' + this._env.ValueOf('MODE') + '" mode');

        //  shell.exec(`sudo usermod -a -G dialout $USER`);
        const devs = shell.ls('/dev');
        const usbs = devs.filter(d => d.toString().match(/ttyUSB\d+/i));
        console.log('Available ports:', usbs.join(', '));

        const port = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });

        const parser: FluentParser<SDS018Sensor> = new FluentParser<SDS018Sensor>();

        port.on('data', (data) =>
        {
            data.forEach(b =>
            {
                parser.Parse(b).Is(0xAA).Is(0xC0)
                    .Get('pm25L').Get('pm25H')
                    .Get('pm10L').Get('pm10H')
                    .Any().Any().Any()
                    .Is(0xAB)
                    // .Complete((temp: SDS018Sensor) =>
                    .Complete(({ pm25L, pm25H, pm10L, pm10H }) =>
                    {
                        // const pm25 = (temp.pm25H * 256 + temp.pm25L) / 10;
                        // const pm10 = (temp.pm10H * 256 + temp.pm10L) / 10;
                        const pm25 = (pm25H * 256 + pm25L) / 10;
                        const pm10 = (pm10H * 256 + pm10L) / 10;
                        const out = 'pm25: ' + pm25.toFixed(1) + ', pm10: ' + pm10.toFixed(1) + ' (ug/m3) @ ' + (new Date()).toLocaleTimeString();
                        console.log(out);
                    });
            });
        });

        port.on('error', (err) =>
        {
            console.log('serial err:', err);
        });

        port.on('open', () =>
        {
            console.log('open');
        });
    }
}
