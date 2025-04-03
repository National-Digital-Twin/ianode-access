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
  buildDataErrorObject,
  isBodyEmpty,
  sendErrorResponse,
  sendResults,
  sendInvalidRequest,
} from "../utils";
import { attributeMapping } from "../../database/defaults";

const update = async (id, update) => {
  try {
    const { modifiedCount } = await usersModel.updateOne({ id }, update, {
      runValidators: true,
    });

    if (modifiedCount === 0) return { data: { id, updated: false } };

    return { data: { id, updated: true } };
  } catch (err) {
    return buildDataErrorObject(422, err.message);
  }
};

export const updateUser = async (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  if (isBodyEmpty(body)) return sendInvalidRequest(res);

  const attributes = await usersModel.findOne({ id }, "-_id -__v");
  if (!attributes) {
    return sendErrorResponse(res, { code: 404, message: "User not found" });
  }

  const updateObj = mapUpdateReqToUpdateUser(body, attributes);
  if (Object.keys(updateObj).length === 0) return sendInvalidRequest(res);

  const { data, error } = await update(id, updateObj);
  if (error) return sendErrorResponse(res, error);


  sendResults(res, data);
};

const mapUpdateReqToUpdateUser = (body, current) => {
  const topLevel = [
    "id",
    "name",
    "userName",
    "email",
    "active",
    "userGroups",
    "schemas",
  ];
  const { email, userGroups } = body;
  const updateObj = {
    email,
    userGroups,
  };
  delete body.email;
  delete body.userGroups;

  const { labels } = current;

  Object.entries(body).forEach(([k, v]) => {
    if (topLevel.includes(k)) {
      if (current[k] !== v) {
        updateObj[k] = v;
      }
    } else {
      updateLabels(labels, k, v);
    }
  });

  updateObj.labels = labels;

  return updateObj;
};

const updateLabels = (labelsToUpdate, k, v) => {
  const label = labelsToUpdate.find((lbl) => lbl.name === k);
  const dataName = attributeMapping[k];
  const toString = `${k}='${v}'`;
  const toDataLabelString = dataName ? `${dataName}='${v}'` : null;
  if (!label) {
    const newLabel = {
      name: k,
      value: v,
      toString,
      toDataLabelString,
    };
    labelsToUpdate.push(newLabel);
  } else {
    label.value = v;
    label.toString = toString;
    label.toDataLabelString = toDataLabelString;
  }
};
