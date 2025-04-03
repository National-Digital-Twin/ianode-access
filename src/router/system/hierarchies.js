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
  getHierarchyLookup,
} from "../../controllers/hierarchies";

const router = express.Router();

/**
 * @openapi
 * /hierarchies/lookup/{name}:
 *   get:
 *     summary: Look up hierarchy by name
 *     tags:
 *       - Hierarchies
 *     description: Looks up hierarchy by name, using the data_attribute_name or user_attribute_name property of the hierarchy attribute
 *     parameters:
 *       - in: path
 *         name: name
 *         description: Name of the the hierarchy to be looked up
 *       - in: query
 *         name: isUserAttribute
 *         schema:
 *           type: boolean
 *           required: false
 *           default: false
 *           description: isUserAttribute being set to true tells ACCESS to look up the hierarchy using the user_attribute_name property rather than data_attribute_name
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully looked up hierarchy
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
router.get("/lookup/:name", getHierarchyLookup);

module.exports = router;
