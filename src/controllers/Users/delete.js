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
import { buildDataErrorObject, sendErrorResponse, sendResults } from "../utils";

/**
 * Delete user from auth provider and database
 * @param {string} id
 * @returns {Object}
 */
export const deleteUserById = async (id) => {
  try {
    const user = await usersModel.findOne({
      _id: id,
    });
    if(!user){
      return buildDataErrorObject(404, "User does not exist")
    }
   
    const result = await usersModel.deleteOne({ _id: id });

    if (result.deletedCount === 0)
      return buildDataErrorObject(422, "User delete failed");

    return { data: { ok: true } };
  } catch (err) {
    return buildDataErrorObject(422, err.message);
  }
};

export const deleteUser = async (req, res) => {
  const { data, error } = await deleteUserById(req.params.id);
  if (error) return sendErrorResponse(res, error);
  sendResults(res, data);
};

const deactivateUserById = async (id) => {
  try {
    const user = await usersModel.findOne({
      _id: id,
    });
    if (!user) {
      return buildDataErrorObject(404, "User not found");
    }
    const result = await usersModel.updateOne(
      { _id: id },
      { $set: { active: false } }
    );

    if (!result || result.updatedCount === 0)
      return buildDataErrorObject(422, "User deactivation failed");

    return { data: { ok: true } };
  } catch (err) {
    return buildDataErrorObject(422, err.message);
  }
};

export const deactivateUser = async (req, res) => {
  const { data, error } = await deactivateUserById(req.params.id);
  if (error) return sendErrorResponse(res, error);
  sendResults(res, data);
};
