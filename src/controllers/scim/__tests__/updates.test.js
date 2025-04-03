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

import TestResponse from "../../../testUtils";
import {putUser} from "../updates"
describe("test scim updates", () => {
    afterEach(() => {
        jest.clearAllMocks();    
        jest.resetModules();
        
    });
    it("scim not enabled", () => {
        const res = new TestResponse()
        putUser(false)(null, res)

        expect(res.statusCode).toBe(405)
        const data = res.data
        expect(data.schemas).toStrictEqual(["urn:ietf:params:scim:api:messages:2.0:Error"])
        expect(data.detail).toBe("SCIM is not enabled on this server")
        expect(data.status).toBe(405)
    })

    it("scim enabled", () => {
        const res = new TestResponse()
        putUser(true)(null, res)

        expect(res.statusCode).toBe(501)
        const data = res.data
        expect(data.schemas).toStrictEqual(["urn:ietf:params:scim:api:messages:2.0:Error"])
        expect(data.detail).toBe("User updates are not currently enabled in ACCESS")
        expect(data.status).toBe(501)
    })
})
