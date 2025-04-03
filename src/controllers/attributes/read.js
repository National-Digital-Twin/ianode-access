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

import attributesModel from "../../database/models/Attributes";
import { sendNotFound } from "./utils";
import { sendErrorResponse, sendResults } from "../utils";

export const getAllAttributes = async () => {
  try {
    const attributes = await attributesModel.find({}, { __v: 0 });
    return { data: attributes };
  } catch (error) {
    return { error };
  }
};

export const getAll = async (req, res) => {
  const { data, error } = await getAllAttributes();

  if (error) return sendErrorResponse(res, error);
  if (!data) return sendNotFound(res);
  sendResults(res, data);
};

export const getAttribute = async (req, res) => {
  try {
    const attributes = await attributesModel.findOne(
      { _id: req.params._id },
      { __v: 0 }
    );

    if (!attributes) return sendNotFound(res);
    sendResults(res, attributes);
  } catch (err) {
    sendErrorResponse(res, err);
  }
};
