import { join } from "path/posix"
import { NpmOutdatedPackage } from "./npm-command-manager"

const map = {
    '*': '\\*',
    '#': '\\#',
    '(': '\\(',
    ')': '\\)',
    '[': '\\[',
    ']': '\\]',
    _: '\\_',
    '\\': '\\\\',
    '+': '\\+',
    '-': '\\-',
    '`': '\\`',
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;'
}

export const escapeString = async (
    string
): Promise<string> => {
    return string.replace(/[\*\(\)\[\]\+\-\\_`#<>]/g, m => map[m])
}

export const filterPackagesWithUpdates = async (
    packages: NpmOutdatedPackage[]
): Promise<NpmOutdatedPackage[]> => {
    return packages.filter(p => p.wanted !== p.current)
}

export const mapIgnoreList = async (
    ignoreList: string[],
    rootFolder: string
): Promise<string[]> => {
    return ignoreList.map(ignore => join(rootFolder, ignore))
}