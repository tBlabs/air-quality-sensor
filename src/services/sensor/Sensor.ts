enum Frame
{
    Header = 0,
    Command,
    PM25LowByte,
    PM25HighByte,
    PM10LowByte,
    PM10HighByte,
    IdByte1,
    IdByte2,
    Checksum,
    Tail
}

class SensorOutput
{
    pm25: number;
    pm10: number;
}

export class SensorFrameParser
{
    private frame: Frame;
    private pm25temp: number;
    private pm10temp: number;

    public Parse(data: Buffer)
    {
        data.forEach(d =>
        {
            switch (this.frame)
            {
                case Frame.Header: if (d === 0xAA) this.frame = Frame.Command;
                    break;
                case Frame.Header: if (d === 0xC0) 
                {
                    this.pm10temp = 0;
                    this.pm25temp = 0;
                    this.frame = Frame.PM25LowByte;
                }
                else this.frame = Frame.Header;
                    break;
                case Frame.Header: this.pm25temp = d;
                    this.frame = Frame.PM25HighByte;
                    break;
                case Frame.Header: this.pm25temp += d*256;
                    this.frame = Frame.PM10LowByte;
                    break;
            }
        })
    }
}