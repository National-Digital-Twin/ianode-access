# Local AWS Cognito Emulator
**Repository:** `ianode-access`  
**Description:** `Provides guidance on using Cognito with IA Node Access application`
<!-- SPDX-License-Identifier: OGL-UK-3.0 -->

This is a local AWS Cognito emulator to be used in conjunction with
[IA Node Access](../README.md). 

## Prerequisites

- AWS CLI 

## Create a User Pool 

A user pool and client has been created: 
UserPoolId: local_6GLuhxhD
ClientId: 6967e8jkb0oqcm9brjkrbcrhj
ClientName: access

## Using cognito 

You can reset the state of cognito by running the script "reset_cognito.sh" 

```
sh reset_cognito.sh
```

Once this is clean you can start up the local cognito instance:

```
docker compose up
```

You can then configure users and groups in Cognito, by using the "config_cognito.sh"

```
sh config_cognito.sh
```

This will configure 4 users:

| user | password | ianode_read | ianode_admin | command to get token |
|-|-|-|-|-|
| test+admin@ndtp.co.uk | password | ❌ | ✅ | `aws --endpoint http://0.0.0.0:9229 cognito-idp initiate-auth --client-id 6967e8jkb0oqcm9brjkrbcrhj --auth-flow USER_PASSWORD_AUTH --auth-parameters USERNAME=test+admin@ndtp.co.uk,PASSWORD=password` |
| test+user@ndtp.co.uk | password | ✅ | ❌ | `aws --endpoint http://0.0.0.0:9229 cognito-idp initiate-auth --client-id 6967e8jkb0oqcm9brjkrbcrhj --auth-flow USER_PASSWORD_AUTH --auth-parameters USERNAME=test+user@ndtp.co.uk,PASSWORD=password` |
| test+user+admin@ndtp.co.uk | password | ✅ | ✅ | `aws --endpoint http://0.0.0.0:9229 cognito-idp initiate-auth --client-id 6967e8jkb0oqcm9brjkrbcrhj --auth-flow USER_PASSWORD_AUTH --auth-parameters USERNAME=test+user+admin@ndtp.co.uk,PASSWORD=password` |
| test@ndtp.co.uk | password | ❌ | ❌ | `aws --endpoint http://0.0.0.0:9229 cognito-idp initiate-auth --client-id 6967e8jkb0oqcm9brjkrbcrhj --auth-flow USER_PASSWORD_AUTH --auth-parameters USERNAME=test@ndtp.co.uk,PASSWORD=password` |

This command gets the token which can be used to log in; it will return an Access Token, Refresh Token and ID Token. 

Take the ID Token, and you can call the Access API in the JWT header as a bearer token. By default the JWT header is "authorization".

© Crown Copyright 2025. This work has been developed by the National Digital Twin Programme and is legally attributed to the Department for Business and Trade (UK) as the
governing entity.  
Licensed under the Open Government Licence v3.0.
