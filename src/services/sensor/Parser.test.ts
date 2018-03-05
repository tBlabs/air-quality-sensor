class OutData
{
    foo: byte;
}

describe('parser', () =>
{
    let parser: Parser;
    const MATRIX = [0xAA, 'foo', 0xAB];

    beforeEach(() =>
    {
        parser = new Parser<OutData>(MATRIX);
    });

    it('should ', () =>
    {
        const input = [0xAA, 'foo', 0xAB];

        input.forEach(b =>
        { 
            const result: OutData | null = parser.Parse(b);

            if (result !== null)
            {
                SensorData = Convert(raw)

                expect(parse).toBe(true);
                expect(parser.)

            }
        })
        // const parseResult = parser.ParseBuffer(input);
    });
});