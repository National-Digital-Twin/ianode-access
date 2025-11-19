#!/usr/bin/env bash

# SPDX-License-Identifier: Apache-2.0
# Utility script to authenticate against the local Cognito instance and
# export the resulting ID token into the current shell environment.

# set -euo pipefail

echo " set COGNITO_ADMIN_PASSWORD before use!"

ENDPOINT_URL=${ENDPOINT_URL:-"http://0.0.0.0:9229"}
DEFAULT_USERNAME="test+admin@ndtp.co.uk"
DEFAULT_PASSWORD=${COGNITO_ADMIN_PASSWORD:-admin}

USERNAME=${1:-$DEFAULT_USERNAME}
PASSWORD=${2:-$DEFAULT_PASSWORD}

# Resolve the Cognito client ID from the environment or local metadata files.
if [[ -n ${COGNITO_CLIENT_ID:-} ]]; then
    CLIENT_ID="$COGNITO_CLIENT_ID"
elif [[ -f "cognito-local/.client_id" ]]; then
    CLIENT_ID=$(<"cognito-local/.client_id")
else
    echo "Error: Cognito client ID not provided and cognito-local/.client_id not found." >&2
    echo "       Run ./cognito-local/config_cognito.sh or export COGNITO_CLIENT_ID first." >&2
    return 1 2>/dev/null || exit 1
fi

AUTH_OUTPUT=$(aws --endpoint-url "$ENDPOINT_URL" cognito-idp initiate-auth \
    --client-id "$CLIENT_ID" \
    --auth-flow USER_PASSWORD_AUTH \
    --auth-parameters USERNAME="$USERNAME",PASSWORD="$PASSWORD" \
    --output json)

ID_TOKEN=$(printf '%s\n' "$AUTH_OUTPUT" | jq -r '.AuthenticationResult.IdToken')

if [[ -z "$ID_TOKEN" || "$ID_TOKEN" == "null" ]]; then
    echo "Error: Failed to extract ID token from Cognito response." >&2
    return 1 2>/dev/null || exit 1
fi

export COGNITO_ID_TOKEN="$ID_TOKEN"
echo "COGNITO_ID_TOKEN exported for user $USERNAME"
