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

import { model, Schema } from "mongoose";

/**
 * @openapi
 * components:
 *   schemas:
 *     BaseHierarchyModel:
 *       type: object
 *       properties:
 *         uuid:
 *           type: string
 *           example: 31127653-a234-48bc-b940-34c866bfe837
 *         tiers:
 *           type: array
 *           example: ["O", "S", "TS"]
 *     Hierarchies:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseHierarchyModel'
 *         - type: object
 *           required:
 *             - uuid
 *             - tiers
 *     HierarchiesResponseArray:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/Hierarchies'
 *     HierarchiesResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseHierarchyModel'
 *         - type: object
 *           properties:
 *             name:
 *               type: string
 *     CreateHierarchiesInput:
 *       type: object
 *       required:
 *         - name
 *         - tiers
 *       properties:
 *         name:
 *           type: string
 *           example: testClearance
 *         tiers:
 *           type: array
 *           example: ["O", "S", "TS"]
 *     HierarchyError:
 *       type: object
 *       properties:
 *         code:
 *           type: number
 *         message:
 *           type: string
 *     HierarchySuccess:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             created:
 *               type: boolean
 *     HierarchyUpdateSuccess:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             updated:
 *               type: boolean
 *     HierarchyDeleteSuccess:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             deleted:
 *               type: boolean
 *     HierarchyNotFound:
 *       type: object
 *       properties:
 *         code:
 *           type: number
 *           example: 404
 *         message:
 *           type: string
 *           example: hierarchy not found
 */
const hierarchySchema = new Schema({
  uuid: String,
  name: { type: String, required: true, unique: true },
  tiers: [String],
  readonly: { type: Boolean, example: false },
});

export default model("Hierarchies", hierarchySchema);
