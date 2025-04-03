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

export class TestResponse {
  statusCode = 0;
  status(code) {
    this.statusCode = code;
    return this;
  }
  data = {};
  json(data) {
    this.data = data;
  }
  send(data) {
    this.data = data;
  }
}

export class TestRequest {
  
}

export const stringifyMongoId = (item) => {
  const clone = item.hasOwnProperty("_doc") ? { ...item._doc } : { ...item };
  if (Object.hasOwn(clone, "labels")) {
    clone.labels = clone.labels?.map((label) => {
      label._id = label._id.toString();
      return label;
    });
  }
  if (Object.hasOwn(clone, "_id")) {
    clone._id = clone._id.toString();
  }
  if (Object.hasOwn(clone, "id")) {
    clone.id = clone.id.toString();
  }

  return clone;
};

export default TestResponse
