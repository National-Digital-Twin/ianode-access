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

import groupsModel from "../../../database/models/Groups";
import TestResponse from "../../../testUtils";
import { deleteGroup } from "../delete";
import mongoose from "mongoose";
describe("Groups - DELETE", () => {
  it("should delete group", async () => {
    groupsModel.findOne = jest.fn(() => {
      return { active: false };
    });
    groupsModel.deleteOne = jest.fn(() => {
      return {};
    });
    const testId = "64f749485fce985092884376";
    const mockRequest = {
      params: { group: testId },
    };
    const mockResponse = new TestResponse();
    await deleteGroup(mockRequest, mockResponse);

    const { statusCode, data } = mockResponse;
    expect(groupsModel.deleteOne).toBeCalledWith({
      _id: mongoose.Types.ObjectId.createFromHexString(testId),
    });
    expect(statusCode).toBe(200);
    expect(data).toStrictEqual({
      deleted: true,
    });
  });

  it("should delete group throw error - database error", async () => {
    groupsModel.findOne = jest.fn(() => {
      return {};
    });
    groupsModel.deleteOne = jest.fn(() => {
      throw new BasicDatabaseError();
    });
    const testId = "64f749485fce985092884376";
    const mockRequest = {
      params: { group: testId },
    };
    const mockResponse = new TestResponse();
    await deleteGroup(mockRequest, mockResponse);

    const { statusCode, data } = mockResponse;
    expect(statusCode).toBe(422);
    expect(data).toStrictEqual({
      code: 422,
      message: "database error",
      detail: undefined,
    });
  });

  it("should delete group error - database error", async () => {
    groupsModel.findOne = jest.fn(() => {
      return {};
    });
    groupsModel.deleteOne = jest.fn(() => {
      return { err: new BasicDatabaseError() };
    });
    const testId = "64f749485fce985092884376";
    const mockRequest = {
      params: { group: testId },
    };
    const mockResponse = new TestResponse();
    await deleteGroup(mockRequest, mockResponse);

    const { statusCode, data } = mockResponse;
    expect(statusCode).toBe(422);
    expect(data).toStrictEqual({
      code: 422,
      message: "database error",
      detail: undefined,
    });
  });
});

class BasicDatabaseError extends Error {
  constructor() {
    super("database error");
    this.code = 422;
  }
}
