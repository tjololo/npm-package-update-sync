import * as core from '@actions/core'
import { readFileSync, writeFileSync } from "fs"
import { NpmOutdatedPackage } from "./npm-command-manager"

export class PackageJsonUpdater {
    private packageJson: string

    constructor(packageJson: string) {
        this.packageJson = packageJson
    }

    async updatePackageJson(outdated: NpmOutdatedPackage[]): Promise<void> {
        const packageJsonContent = readFileSync(this.packageJson, 'utf8')
        const packageJsonObject = JSON.parse(packageJsonContent)
        for (const outdatedPackage of outdated) {
            core.info(`${outdatedPackage.name} is ${outdatedPackage.current} wanting ${outdatedPackage.wanted}`)
            if (packageJsonObject.dependencies && packageJsonObject.dependencies[outdatedPackage.name]) {
                const orig = packageJsonObject.dependencies[outdatedPackage.name]
                if (this.shouldUpdatePackageJson(orig)) {
                    packageJsonObject.dependencies[outdatedPackage.name] = `${orig[0]}${outdatedPackage.wanted}`
                } else {
                    core.info(`Skipping update of version for ${outdatedPackage.name} as update of version string ${orig} has no affect`)
                }
            } else if (packageJsonObject.devDependencies && packageJsonObject.devDependencies[outdatedPackage.name]) {
                const orig = packageJsonObject.devDependencies[outdatedPackage.name]
                if (this.shouldUpdatePackageJson(orig)) {
                    packageJsonObject.devDependencies[outdatedPackage.name] = `${orig[0]}${outdatedPackage.wanted}`
                } else {
                    core.info(`Skipping update of version for ${outdatedPackage.name} as update of version string ${orig} has no affect`)
                }
            }
        }
        writeFileSync(this.packageJson, JSON.stringify(packageJsonObject, null, 2))
    }

    private shouldUpdatePackageJson(version: string): boolean {
        const regex = /^[~\^](0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/
        return regex.test(version)
    }
}