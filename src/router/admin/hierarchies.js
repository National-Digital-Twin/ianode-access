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
  getAll,
  getHierarchy,
} from "../../controllers/hierarchies";

const router = express.Router();

/**
 * @openapi
 * /hierarchies:
 *   get:
 *     summary: Get all hierarchies
 *     tags:
 *       - Hierarchies
 *     description: Returns all hierarchies
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved all hierarchies
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Hierarchy'
 *       404:
 *         description: Hierarchies not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HierarchyNotFound'
 */
router.get("/", getAll);

/**
 * @openapi
 * /hierarchies/{hierarchyId}:
 *   get:
 *     summary: Get hierarchy with id :hierarchyId
 *     tags:
 *       - Hierarchies
 *     description: Returns hierarchy with specified ID
 *     parameters:
 *       - in: path
 *         name: hierarchyId
 *         description: Identifier of requested hierarchy
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved hierarchy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hierarchy'
 *       404:
 *         description: Hierarchy not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HierarchyNotFound'
 */
router.get("/:hierarchyId", getHierarchy);


module.exports = router;
