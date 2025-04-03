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

describe("Logger", () => {
    afterEach(() => {    
        jest.clearAllMocks();
    
    });
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules() // Most important - it clears the cache
        process.env = { ...OLD_ENV }; // Make a copy
    });

    afterAll(() => {
        process.env = OLD_ENV; // Restore old environment
    });
    it("test debug logging - but debug off", () => {
        
        process.env.DEBUG = "false"
        const logger =require("../logger").default
        const logSpy = jest.spyOn(global.console, "log")
        logger.debug("we are debugging")
        expect(logSpy).not.toHaveBeenCalled();
        expect(logSpy).toHaveBeenCalledTimes(0);
        logger.info("we are infoing")
        expect(logSpy).toHaveBeenCalled();
        expect(logSpy).toHaveBeenCalledTimes(1);
        expect(logSpy).toHaveBeenCalledWith("%c INFO: we are infoing", "color: green")
        logger.error("we are erroring")
        expect(logSpy).toHaveBeenCalled();
        expect(logSpy).toHaveBeenCalledTimes(2);
        expect(logSpy).toHaveBeenCalledWith("%c ERROR: we are erroring", "color: red")
   
    })

    it("test debug logging", () => {
        process.env.DEBUG = "true"
        const logger =require("../logger").default
        const logSpy = jest.spyOn(global.console, "log")
        logger.debug("we are debugging")
        expect(logSpy).toHaveBeenCalled();
        expect(logSpy).toHaveBeenCalledTimes(1);
        expect(logSpy).toHaveBeenCalledWith("DEBUG: we are debugging")
        logger.info("we are infoing")
        expect(logSpy).toHaveBeenCalled();
        expect(logSpy).toHaveBeenCalledTimes(2);
        expect(logSpy).toHaveBeenCalledWith("%c INFO: we are infoing", "color: green")
        logger.error("we are erroring")
        expect(logSpy).toHaveBeenCalled();
        expect(logSpy).toHaveBeenCalledTimes(3);
        expect(logSpy).toHaveBeenCalledWith("%c ERROR: we are erroring", "color: red")
       
    })
  });
