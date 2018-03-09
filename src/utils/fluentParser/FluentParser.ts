import { byte } from '../../types/byte';

export class FluentParser<T extends object>
{
    private quantum: byte = 0;
    private temp: T = <T>{};
    private functionIndex = 0;
    private functionToRun = 0;
    private execute = false;
    private dropping: number = 0;

    public Parse(quantum: byte): this
    {
        if (quantum === undefined) 
        {
            this.execute = false;
        }
        else
        {
            this.quantum = quantum;
            this.functionIndex = 0;
            this.execute = true;

            if (this.dropping)
            {
                this.dropping--;
                this.execute = false;
            }
        }

        return this;
    }

    public Drop(count: number): this
    {
        if (count > 0)
        {
            this.CanRun(() =>
            {
                this.dropping = count - 1;
            });
        }

        return this;
    }

    public Get(name: keyof T): this
    {
        this.CanRun(() =>
        {
            this.temp[name] = this.quantum;
        });

        return this;
    }
    
    public Is(toCompare: byte): this
    {
        this.CanRun(() =>
        {
            if (this.quantum !== toCompare)
            {
                this.Reset();
            }
        });
        
        return this;
    }
    
    public Any(): this
    {
        this.CanRun();
        
        return this;
    }
    
    public Complete(callback?: (T) => void): boolean
    {
        if (this.functionToRun === this.functionIndex)
        {
            if (callback)
            {
                callback(this.temp);
            }
            
            this.functionToRun = 0;
            this.temp = <T>{};
            
            return true;
        }
        
        return false;
    }
    
    private Reset(): void
    {
        this.functionToRun = (-1);
    }

    private CanRun(callback?: () => void): void
    {
        if (this.execute && (this.functionIndex === this.functionToRun))
        {
            if (callback)
            {
                callback();
            }
            
            this.execute = false;
            this.functionToRun++;
        }

        this.functionIndex++;
    }
}
