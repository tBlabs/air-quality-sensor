import { byte } from "../../types/byte";
import { ParserOutput } from "./ParserOutput";

interface SampleOutput
{
    foo: byte;
}

test('adds property', () =>
{
    const obj = new ParserOutput<SampleOutput>();

    obj.Store('foo', 0xAB);

    expect(obj.Obj).toEqual({ foo: 0xAB });
});

test('reset after adding property', () =>
{
    const obj = new ParserOutput<SampleOutput>(new SampleOutput());

    obj.Store('foo', 0xAB);

    obj.Reset();

    expect(obj.Obj).toEqual({ });
});