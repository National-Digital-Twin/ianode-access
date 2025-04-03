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
import fs from "fs";
import path from "path";
// import { isAdmin } from "../../middleware/authz";

const router = express.Router();

// router.use(isAdmin)
const localPath = `${__dirname}/`;

/**
 * @openapi
 * components:
 *   schemas:
 *     ServerError:
 *       type: object
 *       properties:
 *         code:
 *           type: number
 *           example: 500
 *         message:
 *           type: string
 *           example: Server error
 */
fs.readdirSync(localPath)
  .filter((file) => {
    if (file === "index.js" || path.extname(file) !== ".js") {
      return false;
    }
    return true;
  })
  .forEach((file) => {
    const filename = file.split(".")[0];
    router.use(`/${filename}`, require(`./${filename}`));
  });



export default router;
