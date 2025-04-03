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

import mongoose from "mongoose";

import groupsModel from "../../database/models/Groups";
import usersModel from "../../database/models/Users";
import { sendNotFound } from "./utils";
import { sendErrorResponse, setupSuccessResponseAction } from "../utils";

const sendDeleteSuccess = setupSuccessResponseAction("deleted");

export const deleteGroup = async (req, res) => {
  const { group: id } = req.params;

  try {
    const _id = mongoose.Types.ObjectId.createFromHexString(id);
    const group = await groupsModel.findOne({ _id }, { __v: 0 });
    if (!group) return sendNotFound(res);
    if (group.active) {
      return sendErrorResponse(
        res,
        new UnableToDeleteError(
          "Unable to process delete",
          "Group cannot be deleted as it is still active",
          422
        )
      );
    }

    const { userErr } = await usersModel.updateMany(
      {},
      { $pull: { userGroups: group.group_id } },
      { multi: true } // Ensure update is applied to all documents.
    );
    if (userErr) return sendErrorResponse(res, userErr);

    const { err } = await groupsModel.deleteOne({ _id });
    if (err) return sendErrorResponse(res, err);

    sendDeleteSuccess(res);
  } catch (err) {
    sendErrorResponse(res, err);
  }
};

class UnableToDeleteError extends Error {
  constructor(message, detail, code) {
    super(message);
    this.code = code;
    this.detail = detail;
  }
}

const sendToggleSuccess = (update) =>
  setupSuccessResponseAction("active", update);
export const toggleGroup = async (req, res) => {
  const { group: group_id } = req.params;

  try {
    const _id = mongoose.Types.ObjectId.createFromHexString(group_id);
    const group = await groupsModel.findOne({ _id }, { __v: 0 });
    if (!group) return sendNotFound(res);
    const updateActive = !group.active;
    const { err } = await groupsModel.updateOne(
      { _id },
      { active: updateActive }
    );
    if (err) return sendErrorResponse(res, err);

    sendToggleSuccess(updateActive)(res);
  } catch (err) {
    sendErrorResponse(res, err);
  }
};
