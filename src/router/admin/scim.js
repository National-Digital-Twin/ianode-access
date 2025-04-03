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

const router = express.Router();

/**
 * @openapi
 * /scim/v2/IsEnabled:
 *   get:
 *     summary: Get SCIM enabled status
 *     tags:
 *       - SCIM
 *     description: Get if SCIM is configured for the back end - i.e. an external IdP is being used to managed users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: SCIM enabled status returned
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 isEnabled:
 *                   type: boolean
 *                   example: true
 */
router.get("/v2/IsEnabled", (req, res) => {

    res.status(200).send({ isEnabled: config.isScimEnabled });
    return;
  });

module.exports = router;
