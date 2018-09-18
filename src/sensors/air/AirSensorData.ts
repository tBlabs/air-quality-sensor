export class AirSensorData
{
    public pm25: number = 0;
    public pm10: number = 0;

    public ToString(): string
    {
        const pm25percentage = (this.pm25 / 25) * 100;
        const pm10percentage = (this.pm10 / 40) * 100;
        
        return `pm25: ${ this.pm25.toFixed(1) } ug/m3 (${pm25percentage.toFixed(0)}%) | pm10: ${ this.pm10.toFixed(1) } ug/m3 (${pm10percentage.toFixed(0)}%)`;  
    }
}
