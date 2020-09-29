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
      core.setFailed('Unable to find event payload path. Environment variable GITHUB_EVENT_PATH is undefined.')
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
        core.setOutput('commandId', command.commandId)
        core.setOutput('projectId', command.projectId)
        core.setOutput('providerId', command.providerId)
        core.setOutput('sender', command.user)
        core.setOutput('sender_id', command.user.id)
        core.setOutput('sender_userType', command.user.userType)
        core.setOutput('sender_role', command.user.role)
        core.setOutput('sender_projectMemberships', command.user.projectMemberships)
        core.setOutput('sender_properties', command.user.properties)

        core.exportVariable('TC_COMMAND', command)
        core.exportVariable('TC_COMMANDID', command.commandId)
        core.exportVariable('TC_PROJECTID', command.projectId)
        core.exportVariable('TC_PROVIDERID', command.providerId)
        core.exportVariable('TC_SENDER', command.user)
        core.exportVariable('TC_SENDER_ID', command.user.id)
        core.exportVariable('TC_SENDER_USERTYPE', command.user.userType)
        core.exportVariable('TC_SENDER_ROLE', command.user.role)
        core.exportVariable('TC_SENDER_PROJECTMEMBERSHIPS', command.user.projectMemberships)
        core.exportVariable('TC_SENDER_PROPERTIES', command.user.properties)

        const projectEvents = ['tc_project_create', 'tc_project_update', 'tc_project_delete']
        const userEvents = [
          'tc_project_user_create',
          'tc_project_user_delete',
          'tc_project_user_update',
          'tc_teamcloud_user_create',
          'tc_teamcloud_user_delete',
          'tc_teamcloud_user_update'
        ]

        if (projectEvents.includes(eventType)) {
          core.setOutput('project', command.payload)
          core.setOutput('project_id', command.payload.id)
          core.setOutput('project_name', command.payload.name)
          core.setOutput('project_type_id', command.payload.type.id)
          core.setOutput('project_type_isDefault', command.payload.type.isDefault)
          core.setOutput('project_type_region', command.payload.type.region)
          core.setOutput('project_type_subscriptions', command.payload.type.subscriptions)
          core.setOutput('project_type_subscriptionCapacity', command.payload.type.subscriptionCapacity)
          core.setOutput('project_type_resourceGroupNamePrefix', command.payload.type.resourceGroupNamePrefix)
          core.setOutput('project_type_providers', command.payload.type.providers)
          core.setOutput('project_resourceGroup_id', command.payload.resourceGroup.id)
          core.setOutput('project_resourceGroup_name', command.payload.resourceGroup.name)
          core.setOutput('project_resourceGroup_subscriptionId', command.payload.resourceGroup.subscriptionId)
          core.setOutput('project_resourceGroup_region', command.payload.resourceGroup.region)
          core.setOutput('project_users', command.payload.users)
          core.setOutput('project_links', command.payload._links)

          core.exportVariable('TC_PROJECT', command.payload)
          core.exportVariable('TC_PROJECT_ID', command.payload.id)
          core.exportVariable('TC_PROJECT_NAME', command.payload.name)
          core.exportVariable('TC_PROJECT_TYPE_ID', command.payload.type.id)
          core.exportVariable('TC_PROJECT_TYPE_ISDEFAULT', command.payload.type.isDefault)
          core.exportVariable('TC_PROJECT_TYPE_REGION', command.payload.type.region)
          core.exportVariable('TC_PROJECT_TYPE_SUBSCRIPTIONS', command.payload.type.subscriptions)
          core.exportVariable('TC_PROJECT_TYPE_SUBSCRIPTIONCAPACITY', command.payload.type.subscriptionCapacity)
          core.exportVariable('TC_PROJECT_TYPE_RESOURCEGROUPNAMEPREFIX', command.payload.type.resourceGroupNamePrefix)
          core.exportVariable('TC_PROJECT_TYPE_PROVIDERS', command.payload.type.providers)
          core.exportVariable('TC_PROJECT_RESOURCEGROUP_ID', command.payload.resourceGroup.id)
          core.exportVariable('TC_PROJECT_RESOURCEGROUP_NAME', command.payload.resourceGroup.name)
          core.exportVariable('TC_PROJECT_RESOURCEGROUP_SUBSCRIPTIONID', command.payload.resourceGroup.subscriptionId)
          core.exportVariable('TC_PROJECT_RESOURCEGROUP_REGION', command.payload.resourceGroup.region)
          core.exportVariable('TC_PROJECT_USERS', command.payload.users)
          core.exportVariable('TC_PROJECT_LINKS', command.payload._links)
        }
        if (userEvents.includes(eventType)) {
          core.setOutput('user', command.payload)
          core.setOutput('user_id', command.payload.id)
          core.setOutput('user_userType', command.payload.userType)
          core.setOutput('user_role', command.payload.role)
          core.setOutput('user_projectMemberships', command.payload.projectMemberships)
          core.setOutput('user_properties', command.payload.properties)

          core.exportVariable('TC_USER', command.payload)
          core.exportVariable('TC_USER_ID', command.payload.id)
          core.exportVariable('TC_USER_USERTYPE', command.payload.userType)
          core.exportVariable('TC_USER_ROLE', command.payload.role)
          core.exportVariable('TC_USER_PROJECTMEMBERSHIPS', command.payload.projectMemberships)
          core.exportVariable('TC_USER_PROPERTIES', command.payload.properties)
        }
      }
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
