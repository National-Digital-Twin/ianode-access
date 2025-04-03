// SPDX-License-Identifier: Apache-2.0
/*
 *  Copyright (c) Telicent Ltd.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
/*
 *  This file is unmodified from its original version developed by Telicent Ltd.,
 *  and is now included as part of a repository maintained by the National Digital Twin Programme.
 *  All support, maintenance and further development of this code is now the responsibility
 *  of the National Digital Twin Programme.
 */

import { Types } from "mongoose";

export const mapScimToUser = (user) => {
  const id = new Types.ObjectId();
  const { externalId, userName, name, displayName, emails, groups } = user;
  const create = {
    _id: id,
    id,
    externalId: externalId || userName,
    userName,
    labels: [],
    groups: groups || [],
    schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
  };

  const { value } = emails?.find((email) => email.primary);
  const email = value || (emails?.length ? emails[0].value : null);
  if (email) {
    create.email = email;
  }

  const mappedName =
    displayName ||
    (name
      ? `${name?.givenName || ""} ${name?.middleName || ""} ${
          name?.familyName || ""
        }`
          .replace("  ", " ")
          .trim()
      : userName);
  if (mappedName) {
    create.name = mappedName;
  }

  return create;
};

export const mapMongoToScim = (user) => {
  const { _id, id, externalId, userName, groups, schemas } = user;

  return {
    id: _id || id,
    externalId,
    userName,
    groups,
    schemas,
  };
};

export const scimNotEnabledError = (res) =>
  res
    .status(405)
    .send(buildScimErrorObj(405, "SCIM is not enabled on this server"));

export const createListResponse = (
  totalResults,
  itemsPerPage,
  startIndex,
  Resources
) => ({
  totalResults,
  itemsPerPage,
  startIndex,
  schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
  Resources,
});

export const buildScimErrorObj = (status, detail) => ({
  schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"],
  status,
  detail,
});

export const sendErrorResponse = (res, error) =>
  res.status(error.status).send(error);
