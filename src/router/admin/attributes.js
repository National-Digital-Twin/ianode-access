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
import { getAll, getAttribute } from "../../controllers/attributes";

const router = express.Router();

/**
 * @openapi
 * /attributes:
 *   get:
 *     summary: Get all attributes
 *     tags:
 *       - Attributes
 *     description: Returns all attributes
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved array of attributes
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Attributes'
 *       404:
 *         description: Attributes not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttributesNotFound'
 */
router.get("/", getAll);

/**
 * @openapi
 * /attributes/{_id}:
 *   get:
 *     summary: Get specific attribute by ID
 *     tags:
 *       - Attributes
 *     parameters:
 *       - in: path
 *         name: _id
 *         description: unique identifier for attribute
 *     description: Get specific attribute by ID
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved attribute
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attributes'
 *       404:
 *         description: Attribute not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttributesNotFound'
 */
router.get("/:_id", getAttribute);

module.exports = router;
