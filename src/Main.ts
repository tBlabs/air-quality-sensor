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
            data.forEach((b: byte) =>
            {
                parser.Parse(b)
                    .Is(0xAA).Is(0xC0)
                    .Get('pm25L').Get('pm25H')
                    .Get('pm10L').Get('pm10H')
                    .Drop(3) // or .Any().Any().Any()
                    .Is(0xAB)
                    .Complete(({ pm25L, pm25H, pm10L, pm10H }) =>
                    {
                        const pm25: number = (pm25H * 256 + pm25L) / 10;
                        const pm10: number = (pm10H * 256 + pm10L) / 10;
                        const out: string = 'pm25: ' + pm25.toFixed(1) + ' ug/m3 | pm10: ' + pm10.toFixed(1) + ' ug/m3 @ ' + (new Date()).toLocaleTimeString();
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
