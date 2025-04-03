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

import { deactivateUser, deleteUser } from "../delete";
import usersModel from "../../../database/models/Users";

import TestResponse from "../../../testUtils";

const mockingoose = require("mockingoose");

describe("Users - DELETE", () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it("should successfully delete a user", async () => {
    mockingoose(usersModel)
      .toReturn(
        {
          deletedCount: 1,
        },
        "deleteOne"
      )
      .toReturn({ externalId: "aaa-bbb-ccc" }, "findOne");

    const mockResponse = new TestResponse();
    const mockRequest = {
      params: {
        id: "abc-123",
      },
    };
    await deleteUser(mockRequest, mockResponse);
    expect(mockResponse.statusCode).toBe(200);
  });

  it("should successfully handle error on unsuccessful deleting of a user", async () => {
    mockingoose(usersModel)
      .toReturn({ externalId: "aaa-bbb-ccc" }, "findOne")
      .toReturn({ deletedCount: 0 }, "deleteOne");

    const mockResponse = new TestResponse();
    const mockRequest = {
      params: {
        id: "uuid",
      },
    };
    await deleteUser(mockRequest, mockResponse);

    const {
      statusCode,
      data: { message },
    } = mockResponse;
    expect(statusCode).toBe(422);
    expect(message).toBe("User delete failed");
  });

  it("should successfully handle if user doesn't exist", async () => {
    mockingoose(usersModel).toReturn(undefined, "findOne");

    const mockResponse = new TestResponse();
    const mockRequest = {
      params: {
        id: "abc-123",
      },
    };
    await deleteUser(mockRequest, mockResponse);

    const {
      statusCode,
      data: { message },
    } = mockResponse;
    expect(statusCode).toBe(404);
    expect(message).toBe("User does not exist");
  });

  it("should successfully deactivate user", async () => {
    usersModel.findOne = jest.fn(() => {
      return {};
    });
    usersModel.updateOne = jest.fn(() => {
      return { updatedCount: 1 };
    });

    const mockResponse = new TestResponse();
    const mockRequest = {
      params: {
        id: "abc-123",
      },
    };
    await deactivateUser(mockRequest, mockResponse);

    const { statusCode, data } = mockResponse;
    expect(usersModel.findOne).toBeCalledWith({ _id: "abc-123" });
    expect(usersModel.updateOne).toBeCalledWith(
      { _id: "abc-123" },
      { $set: { active: false } }
    );
    expect(statusCode).toBe(200);
    expect(data).toStrictEqual({ ok: true });
  });

  it("should return error - user not found", async () => {
    usersModel.findOne = jest.fn(() => {
      return null;
    });

    const mockResponse = new TestResponse();
    const mockRequest = {
      params: {
        id: "abc-123",
      },
    };
    await deactivateUser(mockRequest, mockResponse);

    const { statusCode, data } = mockResponse;
    expect(usersModel.findOne).toBeCalledWith({ _id: "abc-123" });
    expect(statusCode).toBe(404);
    expect(data).toStrictEqual({
      code: 404,
      detail: undefined,
      message: "User not found",
    });
  });

  it("should return error - user deactivation failed", async () => {
    usersModel.findOne = jest.fn(() => {
      return {};
    });
    usersModel.updateOne = jest.fn(() => {
      return { updatedCount: 0 };
    });

    const mockResponse = new TestResponse();
    const mockRequest = {
      params: {
        id: "abc-123",
      },
    };
    await deactivateUser(mockRequest, mockResponse);

    const { statusCode, data } = mockResponse;
    expect(usersModel.findOne).toBeCalledWith({ _id: "abc-123" });
    expect(usersModel.updateOne).toBeCalledWith(
      { _id: "abc-123" },
      { $set: { active: false } }
    );
    expect(statusCode).toBe(422);
    expect(data).toStrictEqual({
      code: 422,
      detail: undefined,
      message: "User deactivation failed",
    });
  });

  it("should return error - database error", async () => {
    usersModel.findOne = jest.fn(() => {
      throw new DatabaseError();
    });

    const mockResponse = new TestResponse();
    const mockRequest = {
      params: {
        id: "abc-123",
      },
    };
    await deactivateUser(mockRequest, mockResponse);

    const { statusCode, data } = mockResponse;
    expect(usersModel.findOne).toBeCalledWith({ _id: "abc-123" });
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
