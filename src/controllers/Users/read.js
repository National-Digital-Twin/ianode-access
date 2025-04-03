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
import { buildDataErrorObject, sendErrorResponse } from "../utils";
import logger from "../../lib/logger";
import { create } from "./create";
import { mapSkeletonToUser } from "./utils";

export const getAllUsers = async (filters) => {
  try {
    // Lean allows deletion of object keys e.g. _id
    const users = await usersModel.find({}, `-_id ${filters}`).lean().exec();
    return { data: users };
  } catch (err) {
    return buildDataErrorObject(422, err.message);
  }
};

export const getAll = async (req, res) => {
  const { data, error } = await getAllUsers("-__v");
  if (error) return sendErrorResponse(res, error);
  res.status(200).json(data);
};

const getAttributes = async (id) => {
  try {
    const attributes = await usersModel
      .findOne({ id }, "-__v -_id -externalId -groups")
      .exec();

    if (!attributes) {
      return buildDataErrorObject(404, "User not found");
    }

    return { data: attributes.toObject() };
  } catch (err) {
    return buildDataErrorObject(422, err.message);
  }
};

export const getUserAttributes = async (req, res) => {
  const { data, error } = await getAttributes(req.params.id);
  if (error) {
    res.status(error.code).json(error);
    return;
  }

  res.status(200).json(data);
};



const getAttributesByKeyValue = async (key,value) => {
  try {
    const result = await usersModel
      .findOne({ [key]: value })
      .select({
        labels: 1,
        id: 1,
        _id: 0,
        userGroups: 1,
        active: 1,
      })
      .exec();
    if (!result) {
      return buildDataErrorObject(404, "User not found");
    }
    if (!result.active) {
      return {
        data: {
          id: result.id,
          attributes: [],
        },
      };
    }
    const attributes = [
      ...result.labels
        .filter((label) => label.toDataLabelString)
        .map((label) => label.toDataLabelString),
      ...result.userGroups.map((group) => `${group}:and`),
      ...result.userGroups.map((group) => `${group}:or`),
    ];

    return {
      data: {
        id: result.id,
        attributes,
      },
    };
  } catch (err) {
    return buildDataErrorObject(422, err.message);
  }
};

export const getUserFromEmail = async (req, res) => {
  const email = req.params.email;

  const { data, error } = await getAttributesByKeyValue("email", email);
  if (error) {
    res.status(error.code).json(error);
    return;
  }

  logger.debug("User: ", email, " retrieves with attributes: ", data);
  res.status(200).json(data);
};

export const getUserFromExternalId = async (req, res) => {
  const exId = req.params.sub;
  const { data, error } = await getAttributesByKeyValue("externalId", exId);
  if (error) {
    res.status(error.code).json(error);
    return;
  }

  logger.debug("User: ", exId, " retrieves with attributes: ", data);
  res.status(200).json(data);
}

const getUserFromIdPId = async (sub) => {
    const result = await usersModel
      .findOne({ externalId: sub })
      .select({
        name: 1,
        id: 1,
        _id: 0,
        labels: 1,
        userGroups: 1,
        active: 1,
        email: 1
      })
      .exec();
    return result

}

const accessUserToUIRepresentation = (result) => {

  const attributes = result.labels
      .filter((label) => label.toString)
      .reduce((acc, { name, value }) => {
        acc[name] = value;
        return acc;
      }, {});

    const groups = result.userGroups.map((group) => group);

    delete result.labels;
    delete result.userGroups;

    const user = {
      username: result.name,
      active: result.active,
      email: result.email,
      userId: result.id,
      attributes,
      groups,
    }
    return user
}
const getUserFromToken =  async (token) => {
  const { sub } = token;
  
  try {
    const result = await getUserFromIdPId(sub)
    if (!result) {
      return buildDataErrorObject(404, "User not found");
    }

    const user = accessUserToUIRepresentation(result)

    return {
      data: user,
    };
  } catch (err) {
    return buildDataErrorObject(422, err.message);
  }
};

export const getUserDetails = async (req, res) => {
  const { data, error } = await getUserFromToken(req.token);
  if (error) {
    res.status(error.code).json(error);
    return;
  }

  return res.status(200).json(data);
};

export const createUserIfNotExist = async (req, res) => {
  const { token } = req;
  let { data, error } = await getUserFromToken(token);

  if (error?.code === 404) {
    const {data: userData, error:err} = await create(mapSkeletonToUser(createSkeletonUser(token)))
   
    if(err){
      res.status(err.code).json(err);
      return;
    }
    return res.status(200).json(accessUserToUIRepresentation(userData))
  }else if(error){
    res.status(error.code).json(error);
    return;
  }
  return res.status(200).json(data);
}

const createSkeletonUser = (token) => {
  const {sub, email, name} = token
  return {
    externalId : sub,
    name: name || email,
    email, 
    active: false,
    userGroups: []
  }
}
