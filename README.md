# NPM update and synchronize
[![Total alerts](https://img.shields.io/lgtm/alerts/g/tjololo/npm-package-update-sync.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/tjololo/npm-package-update-sync/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/tjololo/npm-package-update-sync.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/tjololo/npm-package-update-sync/context:javascript)
[![CodeQL](https://github.com/tjololo/npm-package-update-sync/workflows/CodeQL/badge.svg)](https://github.com/tjololo/npm-package-update-sync/actions?query=workflow%3ACodeQL "Code quality workflow status")

[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.png?v=101)](https://github.com/ellerbrock/typescript-badges/)
![GitHub](https://img.shields.io/github/license/tjololo/npm-package-update-sync?style=plastic)

Github action that checks for updates and synchronises package.json

This action will update dependencies to latest available version accoring to version range in package.json

If the version range is described with ```^``` or ```~``` prefix and complete semver string it will update package.json to reflect actual version.

Given that version 1.4.0 of _@actions/core_ is the latest version on major version 1 and the following dependencies in package.json

```json
//.....
"dependencies": {
    "@actions/core": "^1.3.0",
},
//.....
```
The package.json will be updated to
```json
//.....
"dependencies": {
    "@actions/core": "^1.4.0",
},
//.....
```
The same logic applies to version with ```~``` prefix eg: ```~1.2.3```

All other ways of you can describe version ranges in npm is left as-is

## Steps in the action

1. locate package.json in root folder and all sub-folders. Root folder can be overwritten, and recursiveness can be turned off
2. Install all dependencies using ```npm install```
3. List all outdated dependencies using [```npm outdated --json```](https://docs.npmjs.com/cli/v6/commands/npm-update)
4. Check if any versions should be updated in package.json to reflect actual version
5. Update package-lock.json using ```npm install --package-lock-only```
6. Generate a pr-body and make it avialable in output: ```body```

## Usage
Its recomended to use this aciton in combination along with a action for creating pull requests automatically

```yaml
on: 
  schedule:
    - cron: '0 8 * * 4' # every thursday @ AM 8:00

jobs:
  npm_update_sync:
    runs-on: ubuntu-latest
    name: Update npm packages and sync package.json
    steps:
      - name: checkout code
        uses: actions/checkout@v2

      - uses: actions/setup-node@v2   # Setup build agent with wanted version of node see: https://github.com/actions/setup-node
        with:
          node-version: '16'          

      - name: Update package.json
        id: update
        uses: tjololo/npm-package-update-sync@v1

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v3
        with:
          title: "Updated npm dependencies"
          body: ${{ steps.update.outputs.body }}
          labels: dependencies
```
### Action inputs
| Name | Description | Default |
| ---- | ----------- | ------- |
| `root-folder` | relative path from repository root where the action should look for `package.json` files | `.` |
| `ignore-folders` | folders to ignore during update including subfolder. path is relative to root-folder input | `''` |
| `recursive` | wether or not the action should look for package.json in sub-folders and update all of them | `true` |
| `comment-updated` | wheter or not the dependencies that are update should be included in the body output | `false` |

### Action outputs
* `body` - Markdown formated text that can be used in a commit or PR
* `updated` - Returns true if any dependencies are updated

Example of a body for a project with two package.json with `comment-updated` set to `true`:

# Module: demo
### Merging this PR will update the following dependencies
- @actions/exec 1.0.0 -> 1.0.4
- @types/node 16.6.0 -> 16.6.1
- npm-check-updates 10.0.0 -> 10.3.1

### Version updates outside of current version ranges
- @actions/exec 1.0.4 -> 1.1.0
- npm-check-updates 10.3.1 -> 11.8.3

Please update these manually or change version range.
# Module: demo/sub\-folder 
### Merging this PR will update the following dependencies
- @actions/exec 1.0.0 -> 1.0.4
- @types/node 16.6.0 -> 16.6.1
- npm-check-updates 10.0.0 -> 10.3.1

### Version updates outside of current version ranges
- @actions/exec 1.0.4 -> 1.1.0
- npm-check-updates 10.3.1 -> 11.8.3

Please update these manually or change version range.