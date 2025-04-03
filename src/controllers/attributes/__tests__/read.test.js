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

import { DEFAULT_ATTRIBUTES } from "../../../database/defaults";
import attributesModel from "../../../database/models/Attributes";
import TestResponse from "../../../testUtils";
import { getAll, getAttribute } from "../read";

const ids = [
  "64d25a470a97a540165757dc",
  "64d25a470a97a540165757dd",
  "64d25a470a97a540165757de",
  "64d25a470a97a540165757df",
];
const ATTRIBUTES = DEFAULT_ATTRIBUTES.map((attr, idx) => {
  const attribute = { ...attr };
  attribute._id = ids[idx];
  return attribute;
});

describe("Attributes - READ", () => {
  it("should GET specific attribute", async () => {
    attributesModel.findOne = jest.fn((query) => {
      return ATTRIBUTES.find((attr) => attr._id === query._id);
    });
    const testId = "64d25a470a97a540165757dc";
    const mockRequest = {
      params: {
        _id: testId,
      },
    };
    const mockResponse = new TestResponse();
    await getAttribute(mockRequest, mockResponse);

    const { statusCode, data } = mockResponse;
    expect(statusCode).toBe(200);
    expect(data).toStrictEqual(ATTRIBUTES.find((attr) => attr._id === testId));
  });

  it("should handle error thrown from database in specific attribute", async () => {
    attributesModel.findOne = jest.fn(() => {
      throw new DatabaseError();
    });
    const testId = "64d25a470a97a540165757dc";
    const mockRequest = {
      params: {
        _id: testId,
      },
    };
    const mockResponse = new TestResponse();
    await getAttribute(mockRequest, mockResponse);

    const { statusCode, data } = mockResponse;
    expect(statusCode).toBe(422);
    expect(data).toStrictEqual({
      code: 422,
      detail: undefined,
      message: "database error",
    });
  });

  it("should GET all attributes", async () => {
    attributesModel.find = jest.fn(() => {
      return ATTRIBUTES;
    });

    const mockRequest = {};
    const mockResponse = new TestResponse();
    await getAll(mockRequest, mockResponse);

    const { statusCode, data } = mockResponse;
    expect(statusCode).toBe(200);
    expect(data).toStrictEqual(ATTRIBUTES);
  });

  it("should handle error thrown by database in GET all attributes", async () => {
    attributesModel.find = jest.fn(() => {
      throw new DatabaseError();
    });

    const mockRequest = {};
    const mockResponse = new TestResponse();
    await getAll(mockRequest, mockResponse);

    const { statusCode, data } = mockResponse;
    expect(statusCode).toBe(422);
    expect(data).toStrictEqual({
      code: 422,
      detail: undefined,
      message: "database error",
    });
  });
});

class DatabaseError extends Error {
  constructor() {
    super("database error");
    this.code = 422;
  }
}
