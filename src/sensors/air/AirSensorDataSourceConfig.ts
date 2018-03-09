import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { Types } from '../../IoC/Types';
import { IEnvironment } from '../../services/environment/IEnvironment';

@injectable()
export class AirSensorDataSourceConfig
{
    constructor( @inject(Types.IEnvironment) private _env: IEnvironment)
    { }

    public get Port(): string
    {
        return this._env.ValueOf('SENSOR_SERIAL');
    }
}