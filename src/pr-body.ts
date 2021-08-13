import { NpmOutdatedPackage } from "./npm-command-manager"
import { escapeString } from "./utils"

export class PrBodyHelper {
    rootFolder: string
    commentUpdated: boolean

    constructor(rootFolder: string, commentUpdated: boolean) {
        this.rootFolder = rootFolder
        this.commentUpdated = commentUpdated
    }

    async buildPRBody(outdated: NpmOutdatedPackage[]): Promise<string> {
        let updatesOutOfScope: NpmOutdatedPackage[] = []
        let body = `# Module: ${await escapeString(this.rootFolder)} \n`
        if(this.commentUpdated) {
            body += `### Merging this PR will update the following dependencies\n`
        }
        for (let outdatedPackage of outdated) {
            if(outdatedPackage.wanted != outdatedPackage.latest) {
                updatesOutOfScope.push(outdatedPackage)
            }
            if(outdatedPackage.current != outdatedPackage.wanted && this.commentUpdated) {
                body += `- ${outdatedPackage.name} ${outdatedPackage.current} -> ${outdatedPackage.wanted}\n`
            }
        }
        if (updatesOutOfScope.length == 0) {
            body += "\nAfter merging this PR all packages will be updated to the latest version."
        } else {
            body += "\n### Version updates outside of current version ranges\n"
            for (let outdatedPackage of updatesOutOfScope) {
                body += `- ${outdatedPackage.name} ${outdatedPackage.wanted} -> ${outdatedPackage.latest}\n`
            }
            body += "\nPlease update these manually or change version range."
        }
        return body
    }
}