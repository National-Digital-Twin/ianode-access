 # SPDX-License-Identifier: Apache-2.0
 #
 #  Copyright (c) Telicent Ltd.
 #
 #  Licensed under the Apache License, Version 2.0 (the "License");
 #  you may not use this file except in compliance with the License.
 #  You may obtain a copy of the License at
 #
 #      http://www.apache.org/licenses/LICENSE-2.0
 #
 #  Unless required by applicable law or agreed to in writing, software
 #  distributed under the License is distributed on an "AS IS" BASIS,
 #  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 #  See the License for the specific language governing permissions and
 #  limitations under the License.
 #
 #
 #  This file is unmodified from its original version developed by Telicent Ltd.,
 #  and is now included as part of a repository maintained by the National Digital Twin Programme.
 #  All support, maintenance and further development of this code is now the responsibility
 #  of the National Digital Twin Programme.

export SCIM_ENABLED=true
export DEBUG=false
export GROUPS_KEY="cognito:groups"

# Read the dynamic user pool ID from cognito-local setup
if [ -f "cognito-local/.user_pool_id" ]; then
    USER_POOL_ID=$(cat cognito-local/.user_pool_id)
    export OPENID_PROVIDER_URL="http://0.0.0.0:9229/$USER_POOL_ID"
    echo "Using dynamic user pool ID: $USER_POOL_ID"
else
    echo "Warning: No .user_pool_id file found. Run ./cognito-local/config_cognito.sh first"
    export OPENID_PROVIDER_URL="http://0.0.0.0:9229/local_PLACEHOLDER"
fi

if [ -f "cognito-local/.client_id" ]; then
    CLIENT_ID=$(cat cognito-local/.client_id)
    export COGNITO_CLIENT_ID="$CLIENT_ID"
    echo "Using dynamic client ID: $CLIENT_ID"
else
    echo "Warning: No .client_id file found. Run ./cognito-local/config_cognito.sh first"
    export COGNITO_CLIENT_ID="local_PLACEHOLDER_CLIENT"
fi
