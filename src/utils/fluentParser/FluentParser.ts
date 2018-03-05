
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
        console.log('BBB('+inp+')', this.val);
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