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

import express from "express";
import config from "../../config";

import {
  getAll,
  getUserAttributes,
  updateUser,
  deleteUser,
  deactivateUser
} from "../../controllers";

const router = express.Router();
const {isScimEnabled} = config

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     description: Returns all users
 *     produces:
 *       - application/json:
 *     responses:
 *       200:
 *         description: An array of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       422:
 *         description: Operation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserInvalid'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
router.get("/", getAll);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - Users
 *     description: Returns user based on specified ID
 *     parameters:
 *       - in: path
 *         name: id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserNotFound'
 *       422:
 *         description: Operation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserInvalid'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
router.get("/:id", getUserAttributes);

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     summary: Update an existing user
 *     tags:
 *       - Users
 *     description: Updates an existing user
 *     parameters:
 *       - in: path
 *         name: id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully updated an existing user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserSuccess'
 *       400:
 *         description: Failed to update user - invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserInvalidRequest'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserNotFound'
 *       422:
 *         description: Operation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserInvalid'
 */
router.patch("/:id", updateUser);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Delete existing user
 *     tags:
 *       - Users
 *     description: Deletes an existing user by specified ID (if SCIM is enabled, delete is a soft delete)
 *     parameters:
 *       - in: path
 *         name: id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully deleted existing user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteUserSuccess'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserNotFound'
 *       422:
 *         description: User delete failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserInvalid'
 *             example:
 *               code: 422
 *               message: User delete failed
 */
if (!isScimEnabled) {
  router.delete("/:id", deleteUser);
} else {
  router.delete("/:id", deactivateUser);
}
module.exports = router;
