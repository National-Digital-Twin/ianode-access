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
import adminRouter from "./admin/index"

import userRouter from "./users/index"
import systemRouter from "./system/index"

class AccessRouter{

    constructor(middleware){
        this.decoder = middleware
    }

    init(){
        const protectedRouter = express.Router();
        protectedRouter.use(this.decoder)
        protectedRouter.use(adminRouter)
        protectedRouter.use(userRouter)

        const unprotectedRouter = express.Router();

        unprotectedRouter.use(systemRouter)

        const router = express.Router();
        router.use(unprotectedRouter)
        router.use(protectedRouter)
        this.router = router
    }
}


export default AccessRouter
