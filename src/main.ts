import * as core from '@actions/core'
import { statSync } from 'fs'
import * as path from 'path'
import { NpmCommandManager } from './npm-command-manager'
import { getAllProjects } from './npm-project-locator'
import { PackageJsonUpdater } from './packagejson-updater'
import { PrBodyHelper } from './pr-body'
import { filterPackagesWithUpdates } from './utils'

async function execute(): Promise<void> {
    try {
        const recursive = core.getBooleanInput("recursive")
        const commentUpdated = core.getBooleanInput("comment-updated")
        const rootFolder = core.getInput("root-folder")
        core.startGroup("Find modules")
        const folders: string[] = await getAllProjects(rootFolder, recursive)
        core.endGroup()
        let body = ""
        let hasUpdates = false
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
                core.info(`Updating ${outdatedPackages}`)
                await updater.updatePackageJson(outdatedPackages)
                core.endGroup()

                core.startGroup(`npm install --package-lock-only ${packageJson}`)
                await npm.update()
                core.endGroup()

                core.startGroup(`update output flag value`)
                if (!hasUpdates) {
                    hasUpdates = (await filterPackagesWithUpdates(outdatedPackages)).length > 0
                }
                core.endGroup

                core.startGroup(`append to PR body  ${packageJson}`)
                const prBodyHelper = new PrBodyHelper(folder, commentUpdated)
                body += `${await prBodyHelper.buildPRBody(outdatedPackages)}\n`
            }
        }
        core.setOutput("body", body)
        core.setOutput("updated", hasUpdates)
    } catch (e) {
        if (e instanceof Error) {
            core.setFailed(e.message)
        } else if (typeof e === 'string') {
            core.setFailed(e)
        } else {
            core.setFailed("Some unknown error occured, please see logs")
        }
    }
}
execute()