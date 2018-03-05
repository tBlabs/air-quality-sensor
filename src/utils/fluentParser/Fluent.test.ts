import { byte } from './../../types/byte';
import { Fluent, FluentParser } from "./FluentParser";
import * as _ from 'lodash';

interface Foo
{
    foo: byte;
    bar: byte;
}

describe(FluentParser.name, () =>
{
    let fluent: FluentParser<Foo>;
    let isComplete: boolean;

    beforeEach(() =>
    {
        fluent = new FluentParser<Foo>();
        isComplete = false;
    });

    it('should complete valid series', () =>
    {
        const arr = [1, 1, 2, 3];

        arr.forEach(b =>
        {
            isComplete = fluent.Parse(b).Is(2).Is(3).Complete();
        });

        expect(isComplete).toBeTruthy();
    });

    it('should not complete invalid series', () =>
    {
        const arr = [1, 1, 2, 1, 3];

        arr.forEach(b =>
        {
            isComplete = fluent.Parse(b).Is(2).Is(3).Complete();
        });

        expect(isComplete).toBeFalsy();
    });

    it('should get all Foo values', () =>
    {
        const arr = [1, 1, 2, 69, 5, 96];
        let out: Foo;

        arr.forEach(b =>
        {
            isComplete = fluent.Parse(b)
                .Is(2).Get('foo').Is(5).Get('bar')
                .Complete((temp) =>
                {
                    out = temp;
                });
        });

        expect(isComplete).toBeTruthy();
        expect(out.foo).toBe(69);
        expect(out.bar).toBe(96);
    });

    it('should get Foo values from noised stream', () =>
    {
        const arr = [1, 1, 2, 69, 6, 96, 2, 100, 5, 101];
        let out: Foo;

        arr.forEach(b =>
        {
            isComplete = fluent.Parse(b)
                .Is(2).Get('foo')
                .Is(5).Get('bar')
                .Complete((temp) =>
                {
                    out = temp;
                });
        });

        expect(isComplete).toBeTruthy();
        expect(out.foo).toBe(100);
        expect(out.bar).toBe(101);
    });

    it('should get Foo values from noised stream', () =>
    {
        const arr = [1, 1, 0x02, 0x03, 0x04, 0x05];
        let out: Foo;

        arr.forEach(b =>
        {
            isComplete = fluent.Parse(b)
                .Is(0x02).Any().Any().Get('foo')
                .Complete((temp) =>
                {
                    out = temp;
                });
        });

        expect(isComplete).toBeTruthy();
        expect(out.foo).toBe(0x05);
    });

    it('should catch two frames', () =>
    {
        const arr = [1, 1, 0xAA, 0xAB, 0xFF, 2, 2, 0xAA, 0xAB, 0xAC, 3, 3];
        let out: Foo;
        let completions = 0;
        let temp1 = 0;

        arr.forEach(b =>
        {
            isComplete = fluent.Parse(b)
                .Is(0xAA).Any().Get('foo')
                .Complete((temp: Foo) =>
                {
                    if (completions === 0)
                        temp1 = temp.foo;

                    out = temp;
                    completions += 1;
                });
        });

        expect(completions).toBe(2);
        expect(temp1).toBe(0xFF);
        expect(out.foo).toBe(0xAC); // last foo
    });
});