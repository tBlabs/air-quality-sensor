import { byteOrString } from './../../types/byteOrString';
import { byte } from "../../types/byte";

enum Frame
{
    Header = 0,
    Command = 0,
    PM25LowByte,
    PM25HighByte,
    PM10LowByte,
    PM10HighByte,
    IdByte1,
    IdByte2,
    Checksum,
    Tail
}


interface AirSensor
{
    pm25L: byte;
    pm25H: byte;
}

type Matrix = byteOrString[];

const airSensorMatrix: Matrix = [0xAA, 0xCC, 'pm25L', 'pm25H', 'pm10L', 'pm10H', 'id1', 'id2', 'checksum', 0xAB];

class FrameMatrix
{
    private pointer: number = 0;

    constructor(private matrix: Matrix)
    { }

    public Reset(): void
    {
        this.pointer = 0;
    }

    public Next() 
    {
        this.pointer += 1;
    }

    public get IsVar(): boolean
    {
        return (typeof this.matrix[this.pointer] === 'string');
    }
    
    public get VarName(): string
    {
        return <string>this.matrix[this.pointer];
    }
    
    public get Value(): byte
    {
        return <byte>this.matrix[this.pointer];
    }

    public get IsLast(): boolean
    {
        return this.pointer === (this.matrix.length - 1);
    }
} 

SensorFrameToSensorDataConverter
{
    CalculatePM25(pm25H, pm25L): number
    {

    }

    Convert(RawSensor): Sensor
    {
        
    }
}

interface RawSensor
{
    pm25L
    pm25H
    pm10L
    pm10H
}

class Sensor
{
    public pm25: number;
    public pm10: number;
}


export class Parser<T extends object>
{
    constructor(private matrix: FrameMatrix)
    { }

    private out: ParserOutput<T> = new ParserOutput<T>();

    public Parse(b: byte): ParserOutput<T> | null
    {
        if (this.matrix.IsVar)
        {
            this.out.Store(this.matrix.VarName, b);
            this.matrix.Next();
        }
        else
        {
            if (b === this.matrix.Value)
            {
                this.matrix.Next();
                
            }
            else 
            {
                this.matrix.Reset();
                this.out.Reset();
            }
        }

        if (this.matrix.IsLast)
        {
            const out = this.out;
            this.out.Reset();
            return out;
        }

        return null;
    }
}