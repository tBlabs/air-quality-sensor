import { Fluent, FluentParser } from "./FluentParser";


describe(FluentParser.name, () =>
{
    let fluent: FluentParser;
    let isComplete: boolean;

    beforeEach(() =>
    {
        fluent = new FluentParser();
        isComplete = false;
    });

    it('should complete valid series', () =>
    {
        const arr = [1, 1, 2, 3];

        arr.forEach(b =>
        {
            isComplete = fluent.Start(b).Is(2).Is(3).Complete();
        });

        expect(isComplete).toBeTruthy();
    });

    it('should not complete invalid series', () =>
    {
        const arr = [1, 1, 2, 1, 3];

        arr.forEach(b =>
        {
            isComplete = fluent.Start(b).Is(2).Is(3).Complete();
        });

        expect(isComplete).toBeFalsy();
    });
});