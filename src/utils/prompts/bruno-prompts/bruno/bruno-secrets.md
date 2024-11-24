### Secrets Management

## Problem Statement

In any collection, there are secrets that need to be managed. These secrets can be anything such as API keys, passwords, or tokens.

A common practice is to store these secrets in environment variables.

There are two ways in which developers share bruno collections:

Check in the collection folder to source control (like git)
Export the collection to a file and share it
In both these cases we want to ensure that the secrets are stripped out of the collection before it is shared.

## Solution

Bruno offers two approaches to manage secrets in collections.

- DotEnv File
- Secret Variables

## DotEnv File

This approach is inspired by how usually developers manage secrets in their source code.

In this approach, you can store all your secrets in a .env file at the root of your collection folder.

Bruno will automatically load the secrets from this file and make them available to your collection via process.env.<secret-name>.

Your environment file at environments/local.bru would look like

local.bru
vars {
  host: http://localhost:5005
  jwtToken: {{process.env.JWT_TOKEN}}
}
And now you can safely check in your collection to source control without worrying about exposing your secrets. Don't forget to add .env to your .gitignore file.

You can store a .env.sample file in your collection folder to help other developers get started with the collection.

## Secret Variables

In this approach, you can check the secret checkbox for any variable in your environment.

Bruno will manage your secrets internally and will not write them into the environment file.
Your environment file at environments/local.bru would look like

local.bru
vars {
  host: http://localhost:5005
}
vars:secret [
  jwtToken
]
 
And now you can safely check in your collection to source control without worrying about exposing your secrets.

When you export your collection as a file, Bruno will not export the secret variables.