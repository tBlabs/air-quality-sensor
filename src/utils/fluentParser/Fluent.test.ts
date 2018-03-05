import { Fluent, FluentParser } from "./FluentParser";

test('fluent', () =>
{
    // const fluent = new Fluent();
    const fluent = new FluentParser();
    const arr = [3,5,7,9,11,13,15];
    for (let i = 0; i < 6; i++)
    {
        console.log('-------------#'+i);
        // fluent.Start(i).A().B(1).A().B(30).A().B(4);

        const b = arr[i];

        fluent.Start(b).Is(7);
    }
});