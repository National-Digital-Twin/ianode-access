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

import {TestResponse, TestRequest} from "../../testUtils"
import {isUser, isAdmin} from "../authz"
const admin = {
    isUser: false,
    isAdmin: true
}
const user = {
    isUser: true,
    isAdmin: false
}
const user_admin = {
    isUser: true,
    isAdmin: true
}

describe ("testing authz funcs", () => {
    afterEach(() => {    
        jest.clearAllMocks();
    });
    it("test user permissions", () => {
        const req = user
        
        const res = new TestResponse()
        const next = jest.fn()
        isUser(req, res, next)
        expect(next).toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
        isAdmin(req, res, next)
        expect(res.statusCode).toBe(401)
        expect(res.data).toBe("Not Authorised")
    })
    it("test admin permissions", () => {
        const req = admin
        const res = new TestResponse()
        const next = jest.fn()
        isAdmin(req, res, next)
        expect(next).toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
        isUser(req, res, next)
        expect(res.statusCode).toBe(401)
        expect(res.data).toBe("Not Authorised")
    })

    it("test user admin permissions", () => {
        const req = user_admin
        const res = new TestResponse()
        const next = jest.fn()
        isAdmin(req, res, next)
        expect(next).toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
        isUser(req, res, next)
        expect(next).toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(2)
    })
})
