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
    private fi = 0;// function index
    private f2r = 0;// function to run
    private exec = false;
    private quantum: byte = 0;
    private temp: T = <T>{};

    constructor()
    {
        this.f2r = 0;
    }

    public Parse(quantum: byte): FluentParser<T>
    {
        this.quantum = quantum;
        this.fi = 0;
        this.exec = true;

        return this;
    }

    public Get(name: keyof T): FluentParser<T>
    {
        this.Wrap(() =>
        {
            this.temp[name] = this.quantum;
        });

        return this;
    }

    private Reset(): void
    {
        this.f2r = (-1);
    }

    public Is(toCompare: number): FluentParser<T>
    {
        this.Wrap(() =>
        {
            if (this.quantum !== toCompare)
            {
                this.Reset();
            }
        });

        return this;
    }

    public Any()
    {
        this.Wrap();

        return this;
    }

    public Complete(callback?: (T) => void): boolean
    {
        if (this.f2r === this.fi)
        {
            if (callback)
            {
                callback(this.temp);
            }

            this.f2r = 0;
            this.temp = <T>{};

            return true;
        }

        return false;
    }

    private Wrap(callback?: () => void): void
    {
        if (this.exec && (this.fi === this.f2r))
        {
            if (callback)
            {
                callback();
            }

            this.exec = false;
            this.f2r++;
        }

        this.fi++;
    }
}
