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

import { parse } from "scim2-parse-filter";

import usersModel from "../../database/models/Users";
import {
  mapMongoToScim,
  scimNotEnabledError,
  sendErrorResponse,
  buildScimErrorObj,
} from "./utils";

const getAllUsers = async ({
  query,
  filters,
  startIndex = "-1",
  limit = "-1",
}) => {
  try {
    let mongoQuery = usersModel.find({ ...query }, `-_id ${filters}`);
    let parsedIndex = parseInt(startIndex, 10);
    if (parsedIndex === -1) {
      parsedIndex = 1;
    }

    const users = await mongoQuery.exec();

    if (!users || !users.length) {
      const returnObj = {
        schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
        totalResults: 0,
        startIndex: parsedIndex,
        itemsPerPage: 0,
        Resources: [],
      };
      return { data: returnObj };
    }

    let parsedLimit = parseInt(limit, 10);
    if (parsedLimit === -1) {
      parsedLimit = users?.length;
    }
    const resources = users
      ?.slice(parsedIndex - 1, parsedLimit)
      .map(mapMongoToScim)
      .filter((user) => user.id);
    const returnObj = {
      schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
      totalResults: resources?.length,
      startIndex: parsedIndex,
      itemsPerPage: parsedLimit,
      Resources: resources,
    };
    return { data: returnObj };
  } catch (err) {
    const { message } = err;
    console.log("ERROR ", message);
    return { error: buildScimErrorObj(422, message) };
  }
};

const parseFilter = (filters) => {
  if (filters) {
    try {
      const parsedFilters = parse(filters);
      const { attrPath, compValue, op } = parsedFilters;
      if (op !== "eq") {
        console.log("OPERATOR NOT SUPPORTED IN FILTER");
        return { error: buildScimErrorObj(422, "Operator not supported") };
      }
      if (attrPath === "userName") {
        return { data: { [attrPath]: compValue } };
      }
    } catch (err) {
      const { code, message } = err;
      console.log(err);
      return { error: buildScimErrorObj(code, message) };
    }
  }
  return { data: {}, error: null };
};

export const getAll = (isScimEnabled) => async (req, res) => {
  if (!isScimEnabled) {
    return scimNotEnabledError(res);
  }
  const { query: reqQuery } = req;
  const { data: query, error: parseError } = parseFilter(reqQuery.filter);
  if (parseError) {
    return sendErrorResponse(res, { message: parseError });
  }

  const { data, error } = await getAllUsers({
    query,
    filters: "-__v",
    startIndex: reqQuery?.startIndex,
    limit: reqQuery?.count,
  });
  if (error) {
    console.log("ERROR ", error.message);
    return sendErrorResponse(res, error);
  }
  res.status(200).json(data);
};

const getAttributes = async (externalId) => {
  try {
    const attributes = await usersModel
      .findOne({ externalId }, "-_id -__v")
      .exec();
    if (!attributes) {
      console.log("USER NOT FOUND", externalId);
      return { error: buildScimErrorObj(404, "User not found") };
    }

    return { data: mapMongoToScim(attributes.toObject()) };
  } catch (err) {
    const { message } = err;
    console.log("ERROR ", message);
    return { error: buildScimErrorObj(422, message) };
  }
};

export const getUserAttributes = (isScimEnabled) => async (req, res) => {
  if (!isScimEnabled) {
    return scimNotEnabledError(res);
  }
  const { data, error } = await getAttributes(req.params.userId);
  if (error) {
    console.log("ERROR ", error.details);
    return sendErrorResponse(res, error);
  }
  res.status(200).json(data);
};
