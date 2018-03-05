
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

export class FluentParser
{
    private fi = 0;// function index
    private f2r = 0;// function to run
    private exec = false;
    private val: number = 0;

    constructor()
    {
        this.f2r = 0;
    }

    public Start(i: number): FluentParser
    {
        this.val = i;
        this.fi = 0;
        //  console.log('start');
        this.exec = true;

        return this;
    }

    public A(): FluentParser
    {
        // this.p--;
        if (this.exec && (this.fi === this.f2r))
        {
            console.log('A()', this.val);
            this.exec = false;
            this.f2r++;
        }
        this.fi++;
        return this;
    }

    public Is(inp: number): FluentParser
    {
        // if (this.exec && (this.fi === this.f2r))
        // {
        //     console.log('Is(' + inp + ') val='+this.val+', f2r='+this.f2r);
        //     if (this.val === inp)
        //     {
        //         console.log('true');
        //     }
        //      else this.f2r=-1;
        //     this.exec = false;
        //     this.f2r++;
        // }
        // this.fi++;
        this.Wrap(() =>
        {
            console.log('Is(' + inp + ') val=' + this.val + ', f2r=' + this.f2r);
            if (this.val === inp)
            {
                console.log('true');
            }
            else this.f2r = -1;
        });
        return this;
    }

    public Complete(): boolean
    {
        if (this.f2r === this.fi)
        {
            console.log('complete');
            this.f2r = 0;
            return true;
        }

        return false;
    }

    private Wrap(callback)
    {
        if (this.exec && (this.fi === this.f2r))
        {
            callback();

            this.exec = false;
            this.f2r++;
        }
        this.fi++;
    }
}



// Parser(b)
//     .Is(0xAA).Is(0xCC)
//     .Get('pm25H').Get('pm25L')
//     .Drop(3)
//     .Is(0xAB)
//     .Compute(({ pm25H, pm25L }=> {
//         pm25 = ...
//     }))

// class FluentParser
// {
//     p = 0;
//     b = 0;

//     Parse(b)
//     {
//         this.b = b;

//     }

//     Is(byte)
//     {
//         if (p > 0) return this;

//         if (b === byte) p++;
//         else p = 0;
//     }

//     Get(name)
//     {
//         temp[name] = b
//     }

//     Drop(counter)
//     {
//         counter--;
//     }

//     Compute(callback)
//     {
//         callback(temp)
//     }
// }