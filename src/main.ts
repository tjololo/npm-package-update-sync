import * as core from '@actions/core'
import { readFileSync, statSync, writeFileSync } from 'fs'
import ncu from 'npm-check-updates'
import * as path from 'path'
import { NpmOutdatedPackage, NpmCommandManager } from './npm-command-manager'
import { getAllProjects } from './npm-project-locator'
import { PackageJsonUpdater } from './packagejson-updater'
import { PrBodyHelper } from './pr-body'

async function execute(): Promise<void> {
    try {
        const recursive = await core.getBooleanInput("recursive")
        const rootFolder = await core.getInput("root-folder")
        const folders: string[] = await getAllProjects(rootFolder, recursive)
        let body = ""
        for (const folder in folders) {
            const packageJson = path.join(folder, 'package.json')
            if (statSync(packageJson).isFile()) {
                core.startGroup("Print dependencies")
                const packageJsonContent = await readFileSync(packageJson, 'utf8')
                const packageJsonObject = JSON.parse(packageJsonContent)
                let dependencies = Object.entries(packageJsonObject.dependencies)
                const devDependencies = packageJsonObject.devDependencies
                for (let [key, value] of dependencies) {
                    core.info(`Version of "${key}" is: "${value}`)
                }
                core.endGroup()
                const npm = await NpmCommandManager.create(rootFolder);

                core.startGroup("npm install")
                await npm.install()
                core.endGroup()

                core.startGroup("npm outdated")
                const outdatedPackages = await npm.outdated()
                core.endGroup()

                core.startGroup("Update package.json")
                const updater = new PackageJsonUpdater(packageJson)
                await updater.updatePackageJson(outdatedPackages)
                core.endGroup()

                core.startGroup("npm update")
                await npm.update()
                core.endGroup()

                core.startGroup("Generate PR body")
                const prBodyHelper = new PrBodyHelper(folder)
                body += await prBodyHelper.buildPRBody(outdatedPackages)
            }
        }
        core.setOutput("body", body)
    } catch (e) {
        core.setFailed(e.message)
    }
}
execute()