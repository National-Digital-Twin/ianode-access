#!/bin/bash
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

set -e;

# A default non-root role
MONGO_NON_ROOT_ROLE="${MONGO_NON_ROOT_ROLE:-readWrite}"

if [ -n "${MONGO_NON_ROOT_USERNAME:-}" ] && [ -n "${MONGO_NON_ROOT_PASSWORD:-}" ]; then
	"${mongo[@]}" "$MONGO_INITDB_DATABASE" <<-EOJS
		db.createUser({
			user: $(_js_escape "$MONGO_NON_ROOT_USERNAME"),
			pwd: $(_js_escape "$MONGO_NON_ROOT_PASSWORD"),
			roles: [ { role: $(_js_escape "$MONGO_NON_ROOT_ROLE"), db: $(_js_escape "$MONGO_INITDB_DATABASE") } ]
			})
	EOJS
else
	# Print warning or kill temporary Mongo and exit non-zero
  echo "FAILED TO CREATE NON-ROOT USER: $MONGO_NON_ROOT_USERNAME $MONGO_NON_ROOT_PASSWORD"
fi
