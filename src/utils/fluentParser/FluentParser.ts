import * as _ from 'lodash';
import { byte } from '../../types/byte';

export class Fluent
{
    private c = 0;
    private c2 = 0;
    private exec = false;
    private val: number = 0;

    constructor()
    {
        this.c2 = 0;
    }

    public Start(i: number): Fluent
    {
        this.val = i;
        this.c = 0;
        //  console.log('start');
        this.exec = true;

        return this;
    }

    public A(): Fluent
    {
        // this.p--;
        if (this.exec && (this.c === this.c2))
        {
            console.log('A()', this.val);
            this.exec = false;
            this.c2++;
        }
        this.c++;
        return this;
    }

    public B(inp: number): Fluent
    {
        if (this.exec && (this.c === this.c2))
        {
            console.log('BBB(' + inp + ')', this.val);
            if (this.val === inp)
            {
                console.log('execute');
            }
            this.exec = false;
            this.c2++;
        }
        this.c++;
        return this;
    }
}

export class FluentParser<T extends object>
{
    private functionIndex = 0;
    private functionToRun = 0;
    private execute = false;
    private quantum: byte = 0;
    private temp: T = <T>{};
    private dropping: number = 0;

    constructor()
    {
        this.functionToRun = 0;
    }

    public Parse(quantum: byte): FluentParser<T>
    {
        this.quantum = quantum;
        this.functionIndex = 0;
        this.execute = true;

        if (this.dropping)
        {
            this.dropping--;
            this.execute = false;
        }

        return this;
    }

    public Drop(count: number): FluentParser<T>
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

    public Get(name: keyof T): FluentParser<T>
    {
        this.CanRun(() =>
        {
            this.temp[name] = this.quantum;
        });

        return this;
    }

    private Reset(): void
    {
        this.functionToRun = (-1);
    }

    public Is(toCompare: number): FluentParser<T>
    {
        this.CanRun(() =>
        {
            // console.log('Is(', toCompare);
            if (this.quantum !== toCompare)
            {
                this.Reset();
            }
        });

        return this;
    }

    public Any()
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
