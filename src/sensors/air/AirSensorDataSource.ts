import { injectable } from 'inversify';
import 'reflect-metadata';
import * as Rx from 'rxjs';
import { AirSensorDataSourceConfig } from './AirSensorDataSourceConfig';
import * as SerialPort from 'serialport';


enum SensorDataSourceConnectionStatus
{
    Disconnected,
    Connected
}

@injectable()
export class AirSensorDataSource
{
    private connectionStatus$: Rx.Subject<SensorDataSourceConnectionStatus> = new Rx.Subject();
    private data$: Rx.Subject<Buffer> = new Rx.Subject();

    public get Status$(): Rx.Subject<SensorDataSourceConnectionStatus>
    {
        return this.connectionStatus$;
    }

    private set Status(status: SensorDataSourceConnectionStatus)
    {
        console.log(status);
        this.connectionStatus$.next(status);
    }

    public get Data$(): Rx.Subject<Buffer>
    {
        return this.data$;
    }

    private set Data(data: Buffer)
    {
        // console.log(data );
        this.data$.next(data);
    }

    constructor(_config: AirSensorDataSourceConfig)
    {
        const serial = new SerialPort(_config.Port, { baudRate: 9600 });

        serial.on('open', () =>
        {
            this.Status = SensorDataSourceConnectionStatus.Connected;
        });

        serial.on('data', (data: Buffer) =>
        {
            this.Data = data;
        });

        serial.on('error', () =>
        {
            this.Status = SensorDataSourceConnectionStatus.Disconnected;
        });
    }
}
   
