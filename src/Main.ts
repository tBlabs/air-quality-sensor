import { AirSensorData } from './sensors/air/AirSensorData';
import { AirSensor } from './sensors/air/AirSensor';
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
import delay from 'async-delay';
import * as Rx from 'rxjs';
import { FluentParser } from './utils/fluentParser/FluentParser';
import { byte } from './types/byte';



@injectable()
export class Main
{
    constructor(
        @inject(Types.ILogger) private _log: ILogger,
        @inject(Types.IEnvironment) private _env: IEnvironment,
        @inject(Types.IAirSensor) private _sensor: AirSensor)

    { }

    public async Run(): Promise<void>
    {
        this._log.Info('Main.Run', 'Starting in "' + this._env.ValueOf('MODE') + '" mode');

        //  shell.exec(`sudo usermod -a -G dialout $USER`);
        const devs = shell.ls('/dev');
        const usbs = devs.filter(d => d.toString().match(/ttyUSB\d+/i));
        console.log('Available ports:', usbs.join(', '));

        this._sensor.Data$.subscribe((data: AirSensorData) =>
        {
            const msg: string = 'pm25: ' + data.pm25.toFixed(1) + ' ug/m3 | pm10: ' + data.pm10.toFixed(1) + ' ug/m3 @ ' + (new Date()).toLocaleTimeString();
            console.log(msg);
        });
        // const serial = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });

        // _sensor.Use('/dev/ttyUSB0').Output.subscribe((data: AirSensorData)=>{


        // const parser = new FluentParser<AirSensorValueBytes>();

        // serial.on('data', (data: byte[]) =>
        // {
        //     data.forEach((b: byte) =>
        //     {
        //         parser.Parse(b)
        //             .Is(0xAA).Is(0xC0)
        //             .Get('pm25L').Get('pm25H')
        //             .Get('pm10L').Get('pm10H')
        //             .Drop(3)
        //             .Is(0xAB)
        //             .Complete(({ pm25L, pm25H, pm10L, pm10H }) =>
        //             {
        //                 const pm25: number = ((pm25H << 8) + pm25L) / 10;
        //                 const pm10: number = ((pm10H << 8) + pm10L) / 10;
        //                 const msg: string = 'pm25: ' + pm25.toFixed(1) + ' ug/m3 | pm10: ' + pm10.toFixed(1) + ' ug/m3 @ ' + (new Date()).toLocaleTimeString();
        //                 console.log(msg);
        //             });
        //     });
        // });

        // serial.on('error', (err) =>
        // {
        //     console.log('serial error:', err);
        // });

        // serial.on('open', () =>
        // {
        //     console.log('serial open');
        // });

        // process.once('SIGUSR2', async () =>
        // {
        //     console.log('SIGUSR2 \n\n\n');
        //     serial.close((e) =>
        //     {
        //         console.log('errrrr:', e);
        //     });
        //     console.log('serial should be closed now  ');
        //     // if (serial.open)
        //     // await delay(3090);
        //     console.log('... ');
        //     process.kill(process.pid, 'SIGUSR2');
        // });

    }
}
