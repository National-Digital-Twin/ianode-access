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

import usersModel from "../../database/models/Users";
import {
  scimNotEnabledError,
  sendErrorResponse,
  buildScimErrorObj,
} from "./utils";
import { sendResults, sendUpdateSuccess } from "../utils";

const deactivateUserById = async (id) => {
  try {
    const result = await usersModel.updateOne(
      { _id: id },
      { $set: { active: false } }
    );

    if (!result || result.deactivatedCount === 0)
      return { error: buildScimErrorObj(422, "User deactivation failed") };

    return { data: { ok: true } };
  } catch (err) {
    return { error: buildScimErrorObj(422, err.message) };
  }
};

export const deactivateUser = (isScimEnabled) => async (req, res) => {
  if (!isScimEnabled) {
    return scimNotEnabledError(res);
  }

  const { data, error } = await deactivateUserById(req.params.userId);
  if (error) return sendErrorResponse(res, error);
  sendResults(res, data);
};

export const patchUser = (isScimEnabled) => async (req, res) => {
  if (!isScimEnabled) {
    return scimNotEnabledError(res);
  }

  const { Operations } = req.body;
  const updates = Operations.filter((changes) => {
    const {
      op,
      value,
      value: { active },
    } = changes;

    return (
      op === "replace" &&
      Object.keys(value).includes("active") &&
      active === false
    );
  });

  if (updates.length !== Operations.length) {
    return sendErrorResponse(
      res,
      buildScimErrorObj(
        501,
        "Operation in patch not supported, only user deactivation is supported from the SCIM Service provider"
      )
    );
  }

  const { error } = await deactivateUserById(req.params.id);
  if (error) return sendErrorResponse(res, error);
  sendUpdateSuccess(res);
};
