import { NpmOutdatedPackage } from '../../src/npm-command-manager'
import * as utils from '../../src/utils'

const cases = [
    ["*", "\\*"],
    ["#", '\\#'],
    ['(', '\\('],
    [')', '\\)'],
    ['[', '\\['],
    [']', '\\]'],
    ['_', '\\_'],
    ['\\', '\\\\'],
    ['+', '\\+'],
    ['-', '\\-'],
    ['`', '\\`'],
    ['<', '&lt;'],
    ['>', '&gt;'],
    // ['&', '&amp;']
]

test.each(cases)("given input: %s escapeString returns %s", async (input, expected) => {
    expect(await utils.escapeString(input)).toBe(expected)
})

test("filter returns complete list if all elligble for update", async() => {
    const expected = [
        new NpmOutdatedPackage(
            "m1",
            "1.0.0",
            "1.0.4",
            "1.1.0",
        ),
        new NpmOutdatedPackage(
            "m2",
            "16.6.0",
            "16.6.1",
            "16.6.1",
        ),
        new NpmOutdatedPackage(
            "m3",
            "0.29.0",
            "0.29.1",
            "0.30.0",
        )
    ]
    const input = [
        new NpmOutdatedPackage(
            "m1",
            "1.0.0",
            "1.0.4",
            "1.1.0",
        ),
        new NpmOutdatedPackage(
            "m2",
            "16.6.0",
            "16.6.1",
            "16.6.1",
        ),
        new NpmOutdatedPackage(
            "m3",
            "0.29.0",
            "0.29.1",
            "0.30.0",
        )
    ]
    expect(await utils.filterPackagesWithUpdates(input)).toEqual(expected)
});

test("filter packages with version outside version range", async() => {
    const expected = [
        new NpmOutdatedPackage(
            "m1",
            "1.0.0",
            "1.0.4",
            "1.1.0",
        ),
        new NpmOutdatedPackage(
            "m3",
            "0.29.0",
            "0.29.1",
            "0.30.0",
        )
    ]
    const input = [
        new NpmOutdatedPackage(
            "m1",
            "1.0.0",
            "1.0.4",
            "1.1.0",
        ),
        new NpmOutdatedPackage(
            "m2",
            "16.6.0",
            "16.6.0",
            "16.6.1",
        ),
        new NpmOutdatedPackage(
            "m3",
            "0.29.0",
            "0.29.1",
            "0.30.0",
        )
    ]
    expect(await utils.filterPackagesWithUpdates(input)).toEqual(expected)
});

test("returns empty list if all version up to date", async() => {
    const expected = []
    const input = [
        new NpmOutdatedPackage(
            "m1",
            "1.0.0",
            "1.0.0",
            "1.1.0",
        ),
        new NpmOutdatedPackage(
            "m2",
            "16.6.0",
            "16.6.0",
            "16.6.1",
        ),
        new NpmOutdatedPackage(
            "m3",
            "0.29.0",
            "0.29.0",
            "0.30.0",
        )
    ]
    expect(await utils.filterPackagesWithUpdates(input)).toEqual(expected)
});

test("mapIgnoreList prefixes all elemts with rootFolder", async() =>{
    const expected = [
        "rootFolder/m1",
        "rootFolder/m2",
        "rootFolder/m3"
    ]
    const input = [
        "m1",
        "m2",
        "m3"
    ]
    expect(await utils.mapIgnoreList(input, "rootFolder")).toEqual(expected)
})