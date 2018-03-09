import { byte } from '../../types/byte';
import { FluentParser } from "./FluentParser";
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
        const arr = [1, 1, 0x02, 0x03];

        arr.forEach(b =>
        {
            isComplete = fluent.Parse(b).Is(0x02).Is(0x03).Complete();
        });

        expect(isComplete).toBeTruthy();
    });

    it('Drop() should drop', () =>
    {
        const arr = [0xA0, 0xA1, 0xA2, 0xA3, 0xA4, 0xA5];

        arr.forEach(b =>
        {
            isComplete = fluent.Parse(b).Is(0xA0).Drop(1).Is(0xA2).Drop(2).Is(0xA5).Complete();
        });

        expect(isComplete).toBeTruthy();
    });

    it('should not complete invalid series', () =>
    {
        const arr = [1, 1, 0xA0, 1, 0xA1];

        arr.forEach(b =>
        {
            isComplete = fluent.Parse(b).Is(0xA0).Is(0xA1).Complete();
        });

        expect(isComplete).toBeFalsy();
    });

    it('should get all Foo values', () =>
    {
        const arr = [1, 1, 0xA0, 0xB0, 0xA1, 0xB1];
        let out: Foo;

        arr.forEach(b =>
        {
            isComplete = fluent.Parse(b)
                .Is(0xA0).Get('foo')
                .Is(0xA1).Get('bar')
                .Complete((temp) =>
                {
                    out = temp;
                });
        });

        expect(isComplete).toBeTruthy();
        expect(out.foo).toBe(0xB0);
        expect(out.bar).toBe(0xB1);
    });

    it('should get Foo values from noised stream', () =>
    {
        const arr = [1, 1, 0xA0, 0xB0, 0xA1, 2, 0x0B, 3, 3, 0xA0, 0xB0, 0xA1, 0xB1];
        let out: Foo;

        arr.forEach(b =>
        {
            isComplete = fluent.Parse(b)
                .Is(0xA0).Get('foo')
                .Is(0xA1).Get('bar')
                .Complete((temp) =>
                {
                    out = temp;
                });
        });

        expect(isComplete).toBeTruthy();
        expect(out.foo).toBe(0xB0);
        expect(out.bar).toBe(0xB1);
    });

    it('Any() should drop', () =>
    {
        const arr = [1, 1, 0xA0, 0xC0, 0xC1, 0xB0];
        let out: Foo;

        arr.forEach(b =>
        {
            isComplete = fluent.Parse(b)
                .Is(0xA0).Any().Any().Get('foo')
                .Complete((temp) =>
                {
                    out = temp;
                });
        });

        expect(isComplete).toBeTruthy();
        expect(out.foo).toBe(0xB0);
    });

    it('nothing should happen for empty stream', () =>
    {
        isComplete = fluent.Parse(undefined)
            .Complete();

            expect(isComplete).toBeFalsy();
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