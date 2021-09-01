import * as locator from '../../src/npm-project-locator'

test('locate projects recursivly', async () => {
    const expected = [
        "__tests__/unit/fixtures/root",
        "__tests__/unit/fixtures/root/sub-folder",
        "__tests__/unit/fixtures/root/sub-folder/sub-folder2"
    ]
    const actual = await locator.getAllProjects("__tests__/unit/fixtures/root", true)
    expect(actual).toEqual(expected)
})

test('locate and ignore', async () => {
    const expected = [
        "__tests__/unit/fixtures/root",
        "__tests__/unit/fixtures/root/sub-folder"
    ]
    const actual = await locator.getAllProjects("__tests__/unit/fixtures/root", true, ["__tests__/unit/fixtures/root/sub-folder/sub-folder2"])
    expect(actual).toEqual(expected)
})

test('locate and ignore multiple levels', async () => {
    const expected = [
        "__tests__/unit/fixtures/root"
    ]
    const actual = await locator.getAllProjects("__tests__/unit/fixtures/root", true, ["__tests__/unit/fixtures/root/sub-folder"])
    expect(actual).toEqual(expected)
})

test('locate projects not recursivly', async () => {
    const expected = [
        "__tests__/unit/fixtures/root",
    ]
    const actual = await locator.getAllProjects("__tests__/unit/fixtures/root", false)
    expect(actual).toEqual(expected)
})