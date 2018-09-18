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
import { AirSensorDataSourceConfig } from './sensors/air/AirSensorDataSourceConfig';

@injectable()
export class Main
{
    constructor( 
        private _airSensor: AirSensor,
        private _sensorConfig: AirSensorDataSourceConfig)
    { }

    public async Run(): Promise<void>
    {
        //  shell.exec(`sudo usermod -a -G dialout $USER`);
        const devs = shell.ls('/dev');
        const usbs = devs.filter(d => d.toString().match(/ttyUSB\d+/i));
        console.log('Available ports:', usbs.length ? usbs.join(', ') : 'none');
        console.log('AirSensor should be at '+this._sensorConfig.Port+' (set in .env file)');

        this._airSensor.Data$.subscribe((data: AirSensorData) =>
        {
            const time: string = (new Date()).toLocaleTimeString();

            console.log(`${ data.ToString() } @ ${ time }`);
        });

        process.once('SIGINT', async () =>
        {
            await this._airSensor.Dispose();

            console.log('Exit');

            process.kill(process.pid, 'SIGINT');
        });
    }
}
