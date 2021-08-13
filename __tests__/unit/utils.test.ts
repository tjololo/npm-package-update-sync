import * as utils from '../../src/utils';

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
    expect(await utils.escapeString(input)).toBe(expected);
})