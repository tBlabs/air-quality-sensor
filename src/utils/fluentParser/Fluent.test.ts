import { Fluent } from "./FluentParser";

test('fluent', () =>
{
    const fluent = new Fluent();

    for (let i = 0; i < 5; i++)
    {
        console.log('#'+i);
        fluent.Start().A().B().A().B().B();
    }
});