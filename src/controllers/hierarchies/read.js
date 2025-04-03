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

import Attributes from "../../database/models/Attributes";
import { sendNotFound } from "./utils";
import { sendErrorResponse, sendResults } from "../utils";

export const getAllHierarchies = async () => {
  try {
    const groups = await Attributes.find(
      { "value.type": "hierarchy" },
      { __v: 0 }
    );

    return { data: groups.map(mapToHierarchy) };
  } catch (error) {

    return { error };
  }
};

export const getAll = async (req, res) => {
  const { data, error } = await getAllHierarchies();

  if (error) return sendErrorResponse(res, error);
  if (!data) return sendNotFound(res);
  sendResults(res, data);
};

export const getHierarchy = async (req, res) => {
  try {
    const group = await Attributes.findOne(
      { _id: req.params.hierarchyId },
      { __v: 0 }
    );
    if (!group) return sendNotFound(res);
    sendResults(res, mapToHierarchy(group));
  } catch (err) {
    sendErrorResponse(res, err);
  }
};

export const getHierarchyLookup = async (req, res) => {
  const { query, params } = req;
  
  try {
    const key =
      query.isUserAttribute?.toLowerCase() === "true"
        ? "user_attribute_name"
        : "data_attribute_name";

    const group = await Attributes.findOne(
      { [key]: params.name, "value.type": "hierarchy" },
      { __v: 0 }
    );

    if (!group) return sendNotFound(res);

    sendResults(res, mapToHierarchy(group));
  } catch (err) {
    sendErrorResponse(res, err);
  }
};

const mapToHierarchy = (attr) => {
  const {
    _id,
    data_attribute_name,
    value: { values },
    readonly,
  } = attr;

  return {
    uuid: _id,
    name: data_attribute_name,
    tiers: values,
    readonly,
  };
};
