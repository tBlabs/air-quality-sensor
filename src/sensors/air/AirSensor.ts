import { AirSensorData } from './AirSensorData';
import { injectable } from 'inversify';
import 'reflect-metadata';
import * as Rx from 'rxjs';
import { FluentParser } from './../../utils/fluentParser/FluentParser';
import { byte } from "../../types/byte";
import { AirSensorDataSource } from './AirSensorDataSource';

type parser_output = { pm25: number, pm10: number };

interface AirSensorValueBytes
{
    pm25L: byte;
    pm25H: byte;
    pm10L: byte;
    pm10H: byte;
}

@injectable()
export class AirSensor
{
    private sensorData: AirSensorData = new AirSensorData();
    public Data$: Rx.BehaviorSubject<AirSensorData> = new Rx.BehaviorSubject(this.sensorData);

    private parser = new FluentParser<AirSensorValueBytes>();

    constructor(private _data: AirSensorDataSource)
    {
        _data.Data$.subscribe((data: Buffer) =>
        {
            this.Parse(data, (result: parser_output) =>
            {
                this.sensorData.pm25 = result.pm25;
                this.sensorData.pm10 = result.pm10;

                this.Data$.next(this.sensorData);
            });
        });
    }

    public async Dispose()
    {
        await this._data.Detach();
    }

    private Parse(data: Buffer, onCompleteCallback: (parser_output) => void): void
    {
        data.forEach((b: byte) =>
        {
            this.parser.Parse(b)
                .Is(0xAA).Is(0xC0)
                .Get('pm25L').Get('pm25H')
                .Get('pm10L').Get('pm10H')
                .Drop(3)
                .Is(0xAB)
                .Complete(({ pm25L, pm25H, pm10L, pm10H }) =>
                {
                    const pm25: number = ((pm25H << 8) + pm25L) / 10;
                    const pm10: number = ((pm10H << 8) + pm10L) / 10;
                    onCompleteCallback({ pm25, pm10 });
                });
        });
    }
}
