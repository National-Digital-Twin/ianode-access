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

import { buildErrorObject } from "../utils";

export const isValidPayload = ({ label, description } = {}) =>
  typeof label === "string" && typeof description === "string";

export const sendNotFound = (res) =>
  res.status(404).send(buildErrorObject(404, "Group(s) not found"));

export const isGroupNameValid = (input) => {
  // Check to see if string is null or undefined
  if (Boolean(input) === false) return false;
  const regex = new RegExp(
    "^" + // ^ - Starts with...
    "[A-Za-z_]" + // letter char (uppercase or lowercase) or an underscore
    "(" + // ( - START optional capture groupe
    "[A-Za-z0-9_\\.\\-:+]*" + // Zero or more letters, digits, _, ., -, : or +
    "[A-Za-z_]" + // IF additional characters
    // THEN last char must be a letter, digit, or underscore
    ")?" + // )? - END optional capturing group
    "$"
  );
  return regex.test(input)
}
