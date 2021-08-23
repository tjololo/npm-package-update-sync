import { error } from '@actions/core'
import * as exec from '@actions/exec'
import * as io from '@actions/io'


export class NpmCommandManager {
    private workingDirectory: string
    private npmPath: string

    constructor(workingDirectory: string, npmPath: string) {
        this.workingDirectory = workingDirectory
        this.npmPath = npmPath
    }

    static async create(workingDirectory: string): Promise<NpmCommandManager> {
        const newLocal = await io.which('npm', true)
        return new NpmCommandManager(workingDirectory, newLocal)
    }

    async install(): Promise<void> {
        const result = await this.exec(['install'])
        if (result.exitCode !== 0) {
            error(`npm install returned non-zero exitcode: ${result.exitCode}`)
            throw new Error(`npm install returned non-zero exitcode: ${result.exitCode}`)
        }
    }

    async outdated(): Promise<NpmOutdatedPackage[]> {
        const result = await this.exec(['outdated', '--json'])
        if (result.exitCode > 1) {
            throw new Error(`npm outdated returned unknown exitcode: ${result.exitCode}`)
        }
        const packages: NpmOutdatedPackage[] = []
        const resultJson = JSON.parse(result.stdout)
        for (const name of Object.keys(resultJson)) {
            const info = resultJson[name]
            packages.push({
                name: name,
                current: info.current,
                latest: info.latest,
                wanted: info.wanted,
            })
        }
        return packages
    }

    async update(): Promise<void> {
        const result = await this.exec(['install', '--package-lock-only'])
        if (result.exitCode !== 0) {
            error(`npm update returned non-zero exitcode: ${result.exitCode}`)
            throw new Error(`npm install --package-lock-only returned non-zero exitcode: ${result.exitCode}`)
        }
    }

    async exec(args: string[]): Promise<NpmOutput> {
        const env = {}
        for (const key of Object.keys(process.env)) {
            env[key] = process.env[key]
        }
        const stdout: string[] = []
        const stderr: string[] = []

        const options = {
            cwd: this.workingDirectory,
            env,
            ignoreReturnCode: true,
            listeners: {
                stdout: (data: Buffer) => stdout.push(data.toString()),
                stderr: (data: Buffer) => stderr.push(data.toString())
            }
        }
        const resultcode = await exec.exec(`"${this.npmPath}"`, args, options)
        const result = new NpmOutput(resultcode)
        result.stdout = stdout.join('')
        result.stderr = stderr.join('')
        return result
    }
}

export class NpmOutdatedPackage {
    name: string
    current: string
    wanted: string
    latest: string

    constructor(name: string, current: string, wanted: string, latest: string) {
        this.name = name
        this.current = current
        this.wanted = wanted
        this.latest = latest
    }
}

export class NpmOutput {
    stdout = ''
    stderr = ''
    exitCode = 0

    constructor(exitCode: number) {
        this.exitCode = exitCode
    }

}