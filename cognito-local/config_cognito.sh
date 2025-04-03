# SPDX-License-Identifier: Apache-2.0
# Originally developed by Telicent Ltd.; subsequently adapted, enhanced, and maintained by the National Digital Twin Programme.
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
  #  Modifications made by the National Digital Twin Programme (NDTP)
  #  © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
  #  and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

aws --endpoint http://0.0.0.0:9229 cognito-idp admin-create-user --user-pool-id local_6GLuhxhD --username test+admin@ndtp.co.uk --cli-read-timeout 0 --message-action SUPPRESS --user-attributes Name=email,Value=test+admin@ndtp.co.uk 1> /dev/null
aws --endpoint http://0.0.0.0:9229 cognito-idp admin-create-user --user-pool-id local_6GLuhxhD --username test+user@ndtp.co.uk --cli-read-timeout 0 --message-action SUPPRESS --user-attributes Name=email,Value=test+user@ndtp.co.uk 1> /dev/null
aws --endpoint http://0.0.0.0:9229 cognito-idp admin-create-user --user-pool-id local_6GLuhxhD --username test+user+admin@ndtp.co.uk --cli-read-timeout 0 --message-action SUPPRESS --user-attributes Name=email,Value=test+user+admin@ndtp.co.uk 1> /dev/null
aws --endpoint http://0.0.0.0:9229 cognito-idp admin-create-user --user-pool-id local_6GLuhxhD --username test@ndtp.co.uk --cli-read-timeout 0 --message-action SUPPRESS --user-attributes Name=email,Value=test@ndtp.co.uk 1> /dev/null

echo "4 users created"

aws --endpoint http://0.0.0.0:9229 cognito-idp admin-set-user-password --user-pool-id local_6GLuhxhD --username test+admin@ndtp.co.uk --password password --permanent 1> /dev/null
aws --endpoint http://0.0.0.0:9229 cognito-idp admin-set-user-password --user-pool-id local_6GLuhxhD --username test+user+admin@ndtp.co.uk --password password --permanent  1> /dev/null
aws --endpoint http://0.0.0.0:9229 cognito-idp admin-set-user-password --user-pool-id local_6GLuhxhD --username test+user@ndtp.co.uk --password password --permanent 1> /dev/null
aws --endpoint http://0.0.0.0:9229 cognito-idp admin-set-user-password --user-pool-id local_6GLuhxhD --username test@ndtp.co.uk --password password --permanent 1> /dev/null

echo "all users passwords set to ... password"

aws --endpoint http://0.0.0.0:9229 cognito-idp create-group --user-pool-id local_6GLuhxhD  --group-name ianode_admin 1> /dev/null
aws --endpoint http://0.0.0.0:9229 cognito-idp create-group --user-pool-id local_6GLuhxhD  --group-name ianode_read 1> /dev/null

echo "IANode_admin and IANode_read groups created"

aws --endpoint http://0.0.0.0:9229 cognito-idp admin-add-user-to-group --user-pool-id local_6GLuhxhD --username test+admin@ndtp.co.uk --group-name ianode_admin 1> /dev/null
aws --endpoint http://0.0.0.0:9229 cognito-idp admin-add-user-to-group --user-pool-id local_6GLuhxhD --username test+user@ndtp.co.uk --group-name ianode_read 1> /dev/null
aws --endpoint http://0.0.0.0:9229 cognito-idp admin-add-user-to-group --user-pool-id local_6GLuhxhD --username test+user+admin@ndtp.co.uk --group-name ianode_admin 1> /dev/null
aws --endpoint http://0.0.0.0:9229 cognito-idp admin-add-user-to-group --user-pool-id local_6GLuhxhD --username test+user+admin@ndtp.co.uk --group-name ianode_read 1> /dev/null

echo "Added users to groups when required"
