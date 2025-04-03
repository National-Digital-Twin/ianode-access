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

import {
  getUserFromEmail,getUserFromExternalId
} from "../../controllers";

const router = express.Router();

/**
 * @openapi
 * /users/lookup/{email}:
 *   get:
 *     summary: Get user attributes by email
 *     deprecated: true
 *     tags:
 *       - Users
 *     description: Returns user attributes based on specified email address
 *     parameters:
 *       - in: path
 *         name: email
 *     producers:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 6564acddf66ddafd4a2fd645
 *                 attributes:
 *                   $ref: '#/components/schemas/AttributesToStrings'
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
router.get("/lookup/:email", getUserFromEmail);

/**
 * @openapi
 * /users/retrieve/{sub}:
 *   get:
 *     summary: Get user attributes by subject of token
 *     tags:
 *       - Users
 *     description: Returns user attributes based on specified IdP identifier
 *     parameters:
 *       - in: path
 *         name: sub
 *     producers:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 6564acddf66ddafd4a2fd645
 *                 attributes:
 *                   $ref: '#/components/schemas/AttributesToStrings'
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
router.get("/retrieve/:sub", getUserFromExternalId);



module.exports = router
