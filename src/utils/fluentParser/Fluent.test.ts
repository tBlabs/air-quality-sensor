import { Fluent } from "./FluentParser";

test('fluent', () =>
{
    const fluent = new Fluent();

    for (let i = 0; i < 6; i++)
    {
        console.log('-------------#'+i);
        fluent.Start(i).A().B(1).A().B(30).A().B(4);
    }
});