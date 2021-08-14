import {NpmCommandManager, NpmOutput} from "../../src/npm-command-manager"

test(`install does not throw error if exit code is 0`, async () => {
    const ncm = await NpmCommandManager.create("__tests__/unit/fixtures/root/package.json")
    jest.spyOn(ncm, "exec").mockImplementationOnce(async ():Promise<NpmOutput> => {
        return new NpmOutput(0)
    })
    await expect(ncm.install()).resolves.not.toThrow()
})

test(`install throws error if exit code is 1`, async () => {
    const ncm = await NpmCommandManager.create("__tests__/unit/fixtures/root/package.json")
    jest.spyOn(ncm, "exec").mockImplementationOnce(async ():Promise<NpmOutput> => {
        return new NpmOutput(1)
    })
    await expect(ncm.install()).rejects.toThrow()
})

test('outdated returns list of outdated packages', async () => {
    const ncm = await NpmCommandManager.create("__tests__/unit/fixtures/root/package.json")
    jest.spyOn(ncm, "exec").mockImplementationOnce(async ():Promise<NpmOutput> => {
        const out = new NpmOutput(1)
        out.stdout = '{"@actions/exec":{"current":"1.0.0","wanted":"1.0.4","latest":"1.1.0","location":"node_modules/@actions/exec"},"@types/node":{"current":"16.6.0","wanted":"16.6.1","latest":"16.6.1","location":"node_modules/@types/node"},"@vercel/ncc":{"current":"0.29.0","wanted":"0.29.1","latest":"0.29.1","location":"node_modules/@vercel/ncc"},"npm-check-updates":{"current":"10.0.0","wanted":"10.3.1","latest":"11.8.3","location":"node_modules/npm-check-updates"}}'
        out.stderr = ''
        return out
    })
    const expected = [
        {
            name: "@actions/exec",
            current: "1.0.0",
            wanted: "1.0.4",
            latest: "1.1.0",
        },
        {
            name: "@types/node",
            current: "16.6.0",
            wanted: "16.6.1",
            latest: "16.6.1",
        },
        {
            name: "@vercel/ncc",
            current: "0.29.0",
            wanted: "0.29.1",
            latest: "0.29.1",
        },
        {
            name: "npm-check-updates",
            current: "10.0.0",
            wanted: "10.3.1",
            latest: "11.8.3",
        }
    ]
    const actual = await ncm.outdated()
    expect(actual).toEqual(expected)
})

test('outdated returns empty list if no updates', async () => {
    const ncm = await NpmCommandManager.create("__tests__/unit/fixtures/root/package.json")
    jest.spyOn(ncm, "exec").mockImplementationOnce(async ():Promise<NpmOutput> => {
        const out = new NpmOutput(0)
        out.stdout = '{}'
        out.stderr = ''
        return out
    })
    const expected = []
    const actual = await ncm.outdated()
    expect(actual).toEqual(expected)
})

test('outdated throws error if exitcode is > 1', async () => {
    const ncm = await NpmCommandManager.create("__tests__/unit/fixtures/root/package.json")
    jest.spyOn(ncm, "exec").mockImplementationOnce(async ():Promise<NpmOutput> => {
        const out = new NpmOutput(2)
        out.stdout = ''
        out.stderr = 'some error'
        return out
    })
    await expect(ncm.outdated()).rejects.toThrow()
})

test('update does not throw error if exitCode 0', async () => {
    const ncm = await NpmCommandManager.create("__tests__/unit/fixtures/root/package.json")
    jest.spyOn(ncm, "exec").mockImplementationOnce(async ():Promise<NpmOutput> => {
        const out = new NpmOutput(0)
        out.stdout = ''
        out.stderr = ''
        return out
    })
    await expect(ncm.update()).resolves.not.toThrow()
})

test('update does throw error if exitCode 1', async () => {
    const ncm = await NpmCommandManager.create("__tests__/unit/fixtures/root/package.json")
    jest.spyOn(ncm, "exec").mockImplementationOnce(async ():Promise<NpmOutput> => {
        const out = new NpmOutput(1)
        out.stdout = ''
        out.stderr = ''
        return out
    })
    await expect(ncm.update()).rejects.toThrow()
})