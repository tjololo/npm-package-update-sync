import { NpmOutdatedPackage } from "../../src/npm-command-manager"
import { PackageJsonUpdater } from "../../src/packagejson-updater"
import { readFileSync, writeFileSync } from "fs"


test('updates dependencies package.json', async () => {
    const orig = await readFileSync("__tests__/unit/fixtures/package-update-dep.json", 'utf8')
    const packageUpdater = new PackageJsonUpdater("__tests__/unit/fixtures/package-update-dep.json")
    const outdatedPackages = [
        new NpmOutdatedPackage("tilde-one-zero-zero", "1.0.0", "1.0.1", "1.1.0"),
        new NpmOutdatedPackage("tilde-one-zero", "1.0.0", "1.0.1", "1.1.0"),
        new NpmOutdatedPackage("tilde-one-zero-x", "1.0.0", "1.0.1", "1.1.0"),
        new NpmOutdatedPackage("upper-one-zero-zero", "1.0.0", "1.1.0", "2.0.1"),
        new NpmOutdatedPackage("upper-one-zero-x", "1.0.0", "1.1.0", "2.0.1"),
        new NpmOutdatedPackage("upper-one-zero", "1.0.0", "1.1.0", "2.0.1"),
        new NpmOutdatedPackage("upper-one-x-x", "1.0.0", "1.1.0", "2.0.1"),
        new NpmOutdatedPackage("upper-one-x", "1.0.0", "1.1.0", "2.0.1"),
        new NpmOutdatedPackage("upper-one", "1.0.0", "1.1.0", "2.0.1"),
        new NpmOutdatedPackage("one-zero", "1.0.0", "1.1.0", "2.0.1"),
        new NpmOutdatedPackage("one-zero-x", "1.0.0", "1.1.0", "2.0.1"),
        new NpmOutdatedPackage("one-x", "1.0.0", "1.1.0", "2.0.1"),
        new NpmOutdatedPackage("star", "1.0.0", "2.0.0", "2.0.0"),
        new NpmOutdatedPackage("x", "1.0.0", "2.0.0", "2.0.0"),
        new NpmOutdatedPackage("fixed", "1.0.0", "1.0.0", "2.0.1"),
    ]
    const expected = await readFileSync("__tests__/unit/fixtures/package-update-dep.golden.json", 'utf8')
    await packageUpdater.updatePackageJson(outdatedPackages)
    const actual = await readFileSync("__tests__/unit/fixtures/package-update-dep.json", 'utf8')
    await writeFileSync("__tests__/unit/fixtures/package-update-dep.json", orig, 'utf8')
    expect(expected).toEqual(actual)
})

test('updates devDependencies package.json', async () => {
    const orig = await readFileSync("__tests__/unit/fixtures/package-update-dev-dep.json", 'utf8')
    const packageUpdater = new PackageJsonUpdater("__tests__/unit/fixtures/package-update-dev-dep.json")
    const outdatedPackages = [
        new NpmOutdatedPackage("tilde-one-zero-zero", "1.0.0", "1.0.1", "1.1.0"),
        new NpmOutdatedPackage("tilde-one-zero", "1.0.0", "1.0.1", "1.1.0"),
        new NpmOutdatedPackage("tilde-one-zero-x", "1.0.0", "1.0.1", "1.1.0"),
        new NpmOutdatedPackage("upper-one-zero-zero", "1.0.0", "1.1.0", "2.0.1"),
        new NpmOutdatedPackage("upper-one-zero-x", "1.0.0", "1.1.0", "2.0.1"),
        new NpmOutdatedPackage("upper-one-zero", "1.0.0", "1.1.0", "2.0.1"),
        new NpmOutdatedPackage("upper-one-x-x", "1.0.0", "1.1.0", "2.0.1"),
        new NpmOutdatedPackage("upper-one-x", "1.0.0", "1.1.0", "2.0.1"),
        new NpmOutdatedPackage("upper-one", "1.0.0", "1.1.0", "2.0.1"),
        new NpmOutdatedPackage("one-zero", "1.0.0", "1.1.0", "2.0.1"),
        new NpmOutdatedPackage("one-zero-x", "1.0.0", "1.1.0", "2.0.1"),
        new NpmOutdatedPackage("one-x", "1.0.0", "1.1.0", "2.0.1"),
        new NpmOutdatedPackage("star", "1.0.0", "2.0.0", "2.0.0"),
        new NpmOutdatedPackage("x", "1.0.0", "2.0.0", "2.0.0"),
        new NpmOutdatedPackage("fixed", "1.0.0", "1.0.0", "2.0.1"),
    ]
    const expected = await readFileSync("__tests__/unit/fixtures/package-update-dev-dep.golden.json", 'utf8')
    await packageUpdater.updatePackageJson(outdatedPackages)
    const actual = await readFileSync("__tests__/unit/fixtures/package-update-dev-dep.json", 'utf8')
    await writeFileSync("__tests__/unit/fixtures/package-update-dev-dep.json", orig, 'utf8')
    expect(expected).toEqual(actual)
})