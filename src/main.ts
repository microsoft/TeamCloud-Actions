import * as core from '@actions/core'
import { create, UploadOptions } from '@actions/artifact'
import { dirname } from 'path'
import { promises as fs } from 'fs'

async function run(): Promise<void> {
  try {
    const workspace = process.env.GITHUB_WORKSPACE
    const eventPath = process.env.GITHUB_EVENT_PATH
    const commandPath = `${workspace}/command.json`

    if (!eventPath) {
      core.setFailed(
        'Unable to find event payload path. Environment variable GITHUB_EVENT_PATH is undefined.'
      )
    } else {
      const buffer = await fs.readFile(eventPath)
      const event = JSON.parse(buffer.toString())
      const command = event.client_payload
      const eventType = event.event_type

      if (!command) {
        core.setFailed('Unable get command from event payload.')
      } else {
        await fs.writeFile(commandPath, JSON.stringify(command))

        const artifactClient = create()
        const options: UploadOptions = {
          continueOnError: false
        }

        const uploadResponse = await artifactClient.uploadArtifact(
          'command',
          [commandPath],
          dirname(commandPath),
          options
        )

        if (uploadResponse.failedItems.length > 0) {
          core.setFailed(
            `An error was encountered when uploading ${uploadResponse.artifactName}. There were ${uploadResponse.failedItems.length} items that failed to upload.`
          )
        } else {
          core.info(`Artifact ${uploadResponse.artifactName} has been successfully uploaded!`)
        }

        core.setOutput('command', command)
        core.setOutput('command_id', command.commandId)

        const projectEvents = ['tc_project_create', 'tc_project_update', 'tc_project_delete']

        if (projectEvents.includes(eventType)) {
          core.setOutput('project', command.payload)
          core.setOutput('project_id', command.payload.id)
          core.setOutput('project_name', command.payload.name)
          core.setOutput('project_resourceGroup_id', command.payload.resourceGroup.id)
          core.setOutput('project_resourceGroup_name', command.payload.resourceGroup.name)
          core.setOutput('project_resourceGroup_region', command.payload.resourceGroup.region)
        }
      }
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
