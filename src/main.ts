import * as core from '@actions/core'
import { statSync } from 'fs'
import * as path from 'path'
import { NpmCommandManager } from './npm-command-manager'
import { getAllProjects } from './npm-project-locator'
import { PackageJsonUpdater } from './packagejson-updater'
import { PrBodyHelper } from './pr-body'

async function execute(): Promise<void> {
    try {
        const recursive = core.getBooleanInput("recursive")
        const commentUpdated = core.getBooleanInput("comment-updated")
        const rootFolder = core.getInput("root-folder")
        core.startGroup("Find modules")
        const folders: string[] = await getAllProjects(rootFolder, recursive)
        core.endGroup()
        let body = ""
        for (const folder of folders) {
            const packageJson = path.join(folder, 'package.json')
            if (statSync(packageJson).isFile()) {
                const npm = await NpmCommandManager.create(folder)

                core.startGroup(`npm install ${packageJson}`)
                await npm.install()
                core.endGroup()

                core.startGroup(`npm outdated ${packageJson}`)
                const outdatedPackages = await npm.outdated()
                core.endGroup()

                core.startGroup(`update package references in ${packageJson}`)
                const updater = new PackageJsonUpdater(packageJson)
                await updater.updatePackageJson(outdatedPackages)
                core.endGroup()

                core.startGroup(`npm install --package-lock-only ${packageJson}`)
                await npm.update()
                core.endGroup()

                core.startGroup(`append to PR body  ${packageJson}`)
                const prBodyHelper = new PrBodyHelper(folder, commentUpdated)
                body += `${await prBodyHelper.buildPRBody(outdatedPackages)}\n`
            }
        }
        core.setOutput("body", body)
    } catch (e) {
        core.setFailed(e.message)
    }
}
execute()