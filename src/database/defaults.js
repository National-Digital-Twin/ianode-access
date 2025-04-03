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

import labelModel from "./models/Attributes";
import ccData from "../data/country-code";

// Warning: do no modify these values as they are consumed downstream.
export const DEFAULT_ATTRIBUTES = [
  {
    user_attribute_name: "clearance",
    data_attribute_name: "classification",
    value: {
      type: "hierarchy",
      values: ["O", "OS", "S", "TS"],
    },
    ihm: true,
    readonly: true,
    user_required: true,
  },
  {
    user_attribute_name: "nationality",
    data_attribute_name: "permitted_nationalities",
    value: {
      type: "enum",
      values: ccData.map((cc) => cc.Alpha3.trim()),
    },
    ihm: true,
    readonly: true,
    user_required: true,
  },
  {
    user_attribute_name: "deployed_organisation",
    data_attribute_name: "permitted_organisations",
    value: {
      type: "string",
      values: null,
    },
    ihm: true,
    readonly: true,
    user_required: true,
  },
  {
    user_attribute_name: "personnel_type",
    data_attribute_name: null,
    value: {
      type: "enum",
      values: ["GOV", "NON-GOV"],
    },
    ihm: true,
    readonly: true,
    user_required: true,
  },
];

export const attributeMapping = DEFAULT_ATTRIBUTES.reduce(
  (acc, { user_attribute_name, data_attribute_name }) => {
    acc[user_attribute_name] = data_attribute_name;
    return acc;
  },
  {}
);

export const createDefaultAttributes = async () => {
  const { error } = await labelModel.insertMany(DEFAULT_ATTRIBUTES);
  return { error };
};
