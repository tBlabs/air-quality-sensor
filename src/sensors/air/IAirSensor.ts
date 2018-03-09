import { AirSensorData } from "./AirSensorData";
import * as Rx from 'rxjs';

export interface IAirSensor
{
    Data$: Rx.BehaviorSubject<AirSensorData>;
}