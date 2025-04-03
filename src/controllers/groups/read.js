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

import groupsModel from "../../database/models/Groups";
import { sendNotFound } from "./utils";
import { sendErrorResponse, sendResults } from "../utils";
import { Types } from "mongoose";

export const getAllGroups = async (label) => {
  try {
    const groups = await groupsModel.aggregate([
      {
        $match: label ? { label: { $regex: `^${label}`, $options: "i" } } : {},
      },
      {
        $lookup: {
          from: "users",
          localField: "group_id",
          foreignField: "userGroups",
          as: "users",
        },
      },
      { $addFields: { userCount: { $size: "$users" } } },
      { $project: { users: 0, __v: 0 } },
    ]);

    return { data: groups };
  } catch (error) {
    const { code } = error;
    if (!code || code > 500) {
      error.code = 500;
    }
    return { error };
  }
};

export const getAll = async (req, res) => {
  const { label } = req.query;
  const { data, error } = await getAllGroups(label);
  if (error) return sendErrorResponse(res, error);
  if (!data) return sendNotFound(res);
  sendResults(res, data);
};

export const getGroup = async (req, res) => {
  const { group } = req.params;

  try {
    const groups = await groupsModel.aggregate([
      { $match: { _id: Types.ObjectId.createFromHexString(group) } },
      { $project: { __v: 0 } },
      {
        $lookup: {
          from: "users",
          localField: "group_id",
          foreignField: "userGroups",
          as: "users",
        },
      },
            {
        $addFields: {
          users: {
            $map: {
              input: "$users",
              as: "user",
              in: {
                id: "$$user.id",
                name: "$$user.name",
                email: "$$user.email",
                active: "$$user.active",
                labels: "$$user.labels",
                userGroups: "$$user.userGroups",
              },
              },
            },
        },
      },
      { $addFields: { userCount: { $size: "$users" } } },
    ]);

    if (!groups || groups.length === 0) return sendNotFound(res);

    sendResults(res, groups[0]);
  } catch (error) {
    const { code } = error;
    if (!code || code > 500) {
      error.code = 500;
    }
    sendErrorResponse(res, error);
  }
};
