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

import { createUserIfNotExist } from "../../controllers/Users/read";
// import { isUser } from "../../middleware/authz";
import { getUserDetails } from "../../controllers/Users/read";

const router = express.Router();
// router.use(isUser)

/**
 * @openapi
 * /whoami:
 *   get:
 *     summary: Gets who user is, will create if no user exists
 *     tags:
 *       - UserInfo
 *     description: Returns details for the user querying
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully returned full user details
 *         content:
 *          application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *       422:
 *         description: Operation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserInvalid'
 */
router.get("/whoami", createUserIfNotExist)


/**
 * @openapi
 * /user-info/self:
 *   get:
 *     summary: Get user details
 *     tags:
 *       - UserInfo
 *     description: Returns details for the user querying
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully returned full user details
 *         content:
 *          application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
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
router.get("/user-info/self", getUserDetails);
export default router;
