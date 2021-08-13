import { info } from "@actions/core"
import { readdirSync, statSync } from "fs"
import { join } from "path"

export const getAllProjects = async (
    rootFolder: string,
    recursive: boolean,
    result: string[] = []
): Promise<string[]> => {
    if (recursive) {
        const files: string[] = await readdirSync(rootFolder)
        const regex = new RegExp(`\\package.json$`)
        for (const fileName of files) {
            const file = join(rootFolder, fileName)
            if (statSync(file).isDirectory()) {
                try {
                    result = await getAllProjects(file, recursive, result)
                } catch (error) {
                    continue
                }
            } else {
                if (regex.test(file)) {
                    info(`module found : ${file}`)
                    result.push(rootFolder)
                }
            }
        }
        return result
    } else {
        return [rootFolder]
    }
}