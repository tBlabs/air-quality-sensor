import { AirSensorStatus } from './AirSensorStatus';

export class AirSensorData
{
    public status: AirSensorStatus = AirSensorStatus.Offline;
    public pm25: number = (-1);
    public pm10: number = (-1);

    constructor(pm25?: number, pm10?: number)
    {
        this.pm25 = pm25 ? pm25 : (-1);
        this.pm10 = pm10 ? pm10 : (-1);
    }
}