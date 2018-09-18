import { AirSensorConnectionStatus } from './SensorDataSourceConnectionStatus';
import { injectable } from 'inversify';
import 'reflect-metadata';
import * as Rx from 'rxjs';
import { AirSensorDataSourceConfig } from './AirSensorDataSourceConfig';
import * as SerialPort from 'serialport';

@injectable()
export class AirSensorDataSource
{
    private serial: SerialPort;
    private connectionStatus$: Rx.Subject<AirSensorConnectionStatus> = new Rx.Subject();
    private data$: Rx.Subject<Buffer> = new Rx.Subject();

    public get Status$(): Rx.Subject<AirSensorConnectionStatus>
    {
        return this.connectionStatus$;
    }

    private set Status(status: AirSensorConnectionStatus)
    {
        this.connectionStatus$.next(status);
    }

    public get Data$(): Rx.Subject<Buffer>
    {
        return this.data$;
    }

    private set Data(data: Buffer)
    {
        this.data$.next(data);
    }

    constructor(_config: AirSensorDataSourceConfig)
    {
<<<<<<< HEAD
        this.serial = new SerialPort(_config.Port, { baudRate: 9600 });

        this.serial.on('data', (data: Buffer) =>
        {
            this.Data = data;
        });

        this.serial.on('open', () =>
=======
        const serial = new SerialPort(_config.Port, { baudRate: 9600 });

        serial.on('open', () =>
>>>>>>> 33111f863be1b3593cd3c79709b663c1f6b05bbe
        {
            this.Status = AirSensorConnectionStatus.Connected;
        });

        this.serial.on('error', (err) =>
        {
            this.Status = AirSensorConnectionStatus.Disconnected;
        });
    }

    public async Detach(): Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            this.serial.close((e: Error) =>
            {
                if (e !== null) reject(e);
                else resolve();
            });
        });
    }
}
<<<<<<< HEAD
=======
   
>>>>>>> 33111f863be1b3593cd3c79709b663c1f6b05bbe
