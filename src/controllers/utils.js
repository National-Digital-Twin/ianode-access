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

import { SUCCESS_CODE, INVALID_CODE } from "./constants";
import logger from '../lib/logger';

export const buildErrorObject = (code, message, detail) => ({
  code,
  message,
  detail,
});

export const buildDataErrorObject = (code, message) => ({
  data: null,
  error: buildErrorObject(code, message),
});

/**
 *
 * @param {Object} body
 * @returns {bool}
 */
export const isBodyEmpty = (body = {}) => Object.keys(body).length === 0;

export const sendInvalidRequest = (res) =>
  res
    .status(INVALID_CODE)
    .send(buildErrorObject(INVALID_CODE, "Invalid request"));


export const sendErrorResponse = (res, { code, message, detail }) => {
  const httpCode = Math.max(400, Math.min(599, code));
  if (httpCode !== code) {
    console.warn(
      `Expected HTTP error code, got ${code} (transformed to ${httpCode})`
    );
  }
  return res.status(httpCode).send(buildErrorObject(code, message, detail));
};

export const setupSuccessResponseCode =
  (code) =>
  (action, bool = true) =>
  (res, id) => {
    const obj = {
      [action]: bool,
    };
    if (id) {
      obj.uuid = id;
    }
    return res.status(code).send(obj);
  };

/**
 * Setup Success action string. Action is an object key so must follow variable
 * naming conventions.
 * Returns a function which can be invoked with a response object.
 * @param {string} action
 * @returns {Function}
 */
export const setupSuccessResponseAction =
  setupSuccessResponseCode(SUCCESS_CODE);

export const sendResults = (res, data) => res.status(SUCCESS_CODE).json(data);
export const sendUpdateSuccess = (res) => res.status(204).send();
