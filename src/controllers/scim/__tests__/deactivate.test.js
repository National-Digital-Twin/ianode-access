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

import { v4 as uuidv4 } from "uuid";

import usersModel from "../../../database/models/Users";
import TestResponse from "../../../testUtils";
import { deactivateUser } from "../deactivate";

const mockingoose = require("mockingoose");

describe("SCIM User - Deactivate", () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it("should successfully deactivate a user", async () => {
    const id = uuidv4();
    const mockResponse = new TestResponse();
    const mockRequest = { params: { id } };

    mockingoose(usersModel).toReturn({ deactivated: id }, "updateOne");
    await deactivateUser(true)(mockRequest, mockResponse);
    expect(mockResponse.statusCode).toBe(200);
  });

  it("should successfully handle error on unsuccessful deactivation of a user", async () => {
    const mockResponse = new TestResponse();
    const mockRequest = { params: { id: "uuid" } };

    mockingoose(usersModel).toReturn({ deactivatedCount: 0 }, "updateOne");
    await deactivateUser(true)(mockRequest, mockResponse);

    const {
      statusCode,
      data: { detail },
    } = mockResponse;
    expect(statusCode).toBe(422);
    expect(detail).toBe("User deactivation failed");
  });

  it("should successfully handle error on unexpected error", async () => {
    const mockResponse = new TestResponse();
    const mockRequest = { params: { id: "uuid" } };

    mockingoose(usersModel).toReturn(
      new Error("User deactivation failed"),
      "deleteOne"
    );
    await deactivateUser(true)(mockRequest, mockResponse);

    const {
      statusCode,
      data: { detail },
    } = mockResponse;
    expect(statusCode).toBe(422);
    expect(detail).toBe("User deactivation failed");
  });
});
