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

import router from "../index";

describe("Users Router", () => {

  // const layers = [
  //   { name: "isUser", type: "function" },
  // ];

  const routes = [
    { path: "/whoami", method: "get" },
    { path: "/user-info/self", method: "get" },
  ];

  it("Correct number of paths exists on", () => {
    const { stack } = router;
    expect(
      stack.length
    ).toBe(2);
  });

  it.each(routes)("'$method' exists on $path", ({ path, method }) => {
    const { stack } = router;
    // filter out middleware 
    const configuredRoutes = stack.filter(layer => layer.name !== "isUser")
    expect(
        configuredRoutes.some((s) => Object.keys(s.route.methods).includes(method))
      ).toBe(true);
    expect(configuredRoutes.some((s) => s.route.path === path)).toBe(true);
  });
});
