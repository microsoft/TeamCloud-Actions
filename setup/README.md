# TeamCloud Setup

Configure the workflow to handle [TeamCloud](https://github.com/microsoft/TeamCloud) commands.

## Usage

Create a workflow `.yml` file in your repositories `.github/workflows` directory. [Example workflows](#example-workflows) are available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

## Event types

To receive commands from TeamCloud, your workflows must be triggered by the [`repository_dispatch`](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows#repository_dispatch) event, and filtered by one or more of the following custom types:

- `tc_project_create`
- `tc_project_update`
- `tc_project_delete`
- `tc_project_user_create`
- `tc_project_user_delete`
- `tc_project_user_update`
- `tc_teamcloud_user_create`
- `tc_teamcloud_user_delete`
- `tc_teamcloud_user_update`

> See the [example workflows](#example-workflows) for a demonstration of filtering by event type

## Outputs

You can access information about the the command in subsequent jobs/steps in your workflow by using [step context outputs](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#steps-context) set by the `setup` action by specifying an `id`.

### Example workflow using step output

````yaml
on:
  repository_dispatch:
    types: [tc_project_create]

jobs:
  handle_command:
    name: Handle Command
    runs-on: ubuntu-latest

    steps:
      - id: teamcloud
        uses: microsoft/teamcloud-actions/setup@v1

      - run: echo '${{ steps.teamcloud.outputs.command }}'
      - run: echo '${{ steps.teamcloud.outputs.commandId }}'
      - run: echo '${{ steps.teamcloud.outputs.projectId }}'
      - run: echo '${{ steps.teamcloud.outputs.providerId }}'
````

### Available outputs

- `command` - The full command json.
- `commandId` - The command id (guid)
- `projectId` - For project commands, the command project id (guid)
- `providerId` - The command provider id
- `sender` - The full command user json
- `sender_id` - The command sender (user) id (guid)
- `sender_userType` - The command sender (user) type: [User, System, Provider, Application]
- `sender_role` - The command sender (user) system role: [None, Provider, Creator, Admin]
- `sender_projectMemberships` - The command sender (user) project memberships array json
- `sender_properties` - The command sender (user) properties
- `project` - For project commands, the full payload (project) json
- `project_id` - For project commands, the payload (project) id (guid)
- `project_name` - For project commands, the payload (project) name
- `project_type_id` - For project commands, the payload (project) type id
- `project_type_isDefault` - For project commands, whether the payload (project) type is the default
- `project_type_region` - For project commands, the payload (project) type region
- `project_type_subscriptions` - For project commands, the payload (project) type subscriptions (array of guid)
- `project_type_subscriptionCapacity` - For project commands, the payload (project) type subscription capacity
- `project_type_resourceGroupNamePrefix` - For project commands, the payload (project) type resource group name prefix
- `project_type_providers` - For project commands, the payload (project) type providers
- `project_resourceGroup_id` - For project commands, the payload (project) resource group id
- `project_resourceGroup_name` - For project commands, the payload (project) resource group name
- `project_resourceGroup_subscriptionId` - For project commands, the payload (project) resource group subscription id
- `project_resourceGroup_region` - For project commands, the payload (project) resource group region
- `project_users` - For project commands, the payload (project) users
- `project_links` - For project commands, the payload (project) links
- `user` - For user commands, the payload (user) json
- `user_id` - For user commands, the payload (user) id
- `user_userType` - For user commands, the payload (user) type: [User, System, Provider, Application]
- `user_role` - For user commands, the payload (user) role: [None, Provider, Member, Owner]
- `user_projectMemberships` - For user commands, the payload (user) project memberships array json
- `user_properties` - For user commands, the payload (user) properties

## Environment variables

Alternatively, information about the the command is also available to subsequent jobs/steps in your workflow via [environment variables](https://docs.github.com/en/free-pro-team@latest/actions/reference/environment-variables) set by the `setup` action.

### Example workflow using environment variables

````yaml
on:
  repository_dispatch:
    types: [tc_project_create]

jobs:
  handle_command:
    name: Handle Command
    runs-on: ubuntu-latest

    steps:
      - uses: microsoft/teamcloud-actions/setup@v1

      - run: echo '${{ env.TC_COMMAND }}'
      - run: echo '${{ env.TC_COMMANDID }}'
      - run: echo '${{ env.TC_PROJECTID }}'
      - run: echo '${{ env.TC_PROVIDERID }}'
````

### Available environment variables

- `TC_COMMAND` - The full command json.
- `TC_COMMANDID` - The command id (guid)
- `TC_PROJECTID` - For project commands, the command project id (guid)
- `TC_PROVIDERID` - The command provider id
- `TC_SENDER` - The full command user json
- `TC_SENDER_ID` - The command sender (user) id (guid)
- `TC_SENDER_USERTYPE` - The command sender (user) type: [User, System, Provider, Application]
- `TC_SENDER_ROLE` - The command sender (user) system role: [None, Provider, Creator, Admin]
- `TC_SENDER_PROJECTMEMBERSHIPS` - The command sender (user) project memberships array json
- `TC_SENDER_PROPERTIES` - The command sender (user) properties
- `TC_PROJECT` - For project commands, the full payload (project) json
- `TC_PROJECT_ID` - For project commands, the payload (project) id (guid)
- `TC_PROJECT_NAME` - For project commands, the payload (project) name
- `TC_PROJECT_TYPE_ID` - For project commands, the payload (project) type id
- `TC_PROJECT_TYPE_ISDEFAULT` - For project commands, whether the payload (project) type is the default
- `TC_PROJECT_TYPE_REGION` - For project commands, the payload (project) type region
- `TC_PROJECT_TYPE_SUBSCRIPTIONS` - For project commands, the payload (project) type subscriptions (array of guid)
- `TC_PROJECT_TYPE_SUBSCRIPTIONCAPACITY` - For project commands, the payload (project) type subscription capacity
- `TC_PROJECT_TYPE_RESOURCEGROUPNAMEPREFIX` - For project commands, the payload (project) type resource group name prefix
- `TC_PROJECT_TYPE_PROVIDERS` - For project commands, the payload (project) type providers
- `TC_PROJECT_RESOURCEGROUP_ID` - For project commands, the payload (project) resource group id
- `TC_PROJECT_RESOURCEGROUP_NAME` - For project commands, the payload (project) resource group name
- `TC_PROJECT_RESOURCEGROUP_SUBSCRIPTIONID` - For project commands, the payload (project) resource group subscription id
- `TC_PROJECT_RESOURCEGROUP_REGION` - For project commands, the payload (project) resource group region
- `TC_PROJECT_USERS` - For project commands, the payload (project) users
- `TC_PROJECT_LINKS` - For project commands, the payload (project) links
- `TC_USER` - For user commands, the payload (user) json
- `TC_USER_ID` - For user commands, the payload (user) id
- `TC_USER_USERTYPE` - For user commands, the payload (user) type: [User, System, Provider, Application]
- `TC_USER_ROLE` - For user commands, the payload (user) role: [None, Provider, Member, Owner]
- `TC_USER_PROJECTMEMBERSHIPS` - For user commands, the payload (user) project memberships array json
- `TC_USER_PROPERTIES` - For user commands, the payload (user) properties

## Example workflows

### Create a storage account on project create commands

The following example creates a new [Azure Storage Account](https://azure.microsoft.com/en-us/services/storage/blobs/) in the project's resource group when a new project is created using the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/):

```yaml
name: Project Create

on:
  repository_dispatch:
    types: [tc_project_create]

jobs:
  handle_command:
    name: Handle Command
    runs-on: ubuntu-latest

    steps:
      - uses: microsoft/teamcloud-actions/setup@v1

      - name: Login to Azure CLI
        run: |
          az login --service-principal \
          -u '${{ secrets.SP_NAME }}' \
          -p '${{ secrets.SP_PASSWORD }}' \
          -t '${{ secrets.SP_TENANT }}'

      - name: Get Storage Account Name
        shell: python
        run: |
          project_id = '${{ env.TC_PROJECT_ID }}'
          storage_name = ''

          for n in project_id.lower():
              if len(storage_name) < 24 and (n.isdigit() or n.isalpha()):
                  storage_name += n

          print("::set-env name=TC_STORAGE_NAME::{}".format(storage_name))

      - name: Create Storage Account
        run: |
          az storage account create \
          -n ${{ env.TC_STORAGE_NAME }} \
          -g ${{ env.TC_PROJECT_RESOURCEGROUP_NAME }} \
          -l ${{ env.TC_PROJECT_RESOURCEGROUP_REGION }} \
          --sku Standard_LRS
```

### Create a storage account on project delete commands

The following example deletes the [Azure Storage Account](https://azure.microsoft.com/en-us/services/storage/blobs/) created by the example above when the project is deleted:

```yaml
name: Project Delete

on:
  repository_dispatch:
    types: [tc_project_delete]

jobs:
  handle_command:
    name: Handle Command
    runs-on: ubuntu-latest

    steps:
      - uses: microsoft/teamcloud-actions/setup@v1

      - name: Login to Azure CLI
        run: |
          az login --service-principal \
          -u '${{ secrets.SP_NAME }}' \
          -p '${{ secrets.SP_PASSWORD }}' \
          -t '${{ secrets.SP_TENANT }}'

      - name: Get Storage Account Name
        shell: python
        run: |
          project_id = '${{ env.TC_PROJECT_ID }}'
          storage_name = ''

          for n in project_id.lower():
              if len(storage_name) < 24 and (n.isdigit() or n.isalpha()):
                  storage_name += n

          print("::set-env name=TC_STORAGE_NAME::{}".format(storage_name))

      - name: Delete Storage Account
        run: |
          az storage account delete \
          -n ${{ env.TC_STORAGE_NAME }} \
          -g ${{ env.TC_PROJECT_RESOURCEGROUP_NAME }} \
          -y
```
