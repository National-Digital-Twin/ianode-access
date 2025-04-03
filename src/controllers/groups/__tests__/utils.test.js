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

import { isValidPayload, sendNotFound, isGroupNameValid } from "../utils";
import TestResponse from "../../../testUtils";

describe("Groups - UTILS", () => {
  it("should check if valid", () => {
    const isValid = isValidPayload({
      label: "test",
      description: "test group",
    });
    expect(isValid).toBe(true);
  });

  it("should be not valid", () => {
    const isValid = isValidPayload({ description: "test group" });
    expect(isValid).toBe(false);
  });

  it("should be not valid", () => {
    const isValid = isValidPayload();
    expect(isValid).toBe(false);
  });

  it("send not found", () => {
    const mockResponse = new TestResponse();
    sendNotFound(mockResponse);

    const { statusCode, data } = mockResponse;
    expect(statusCode).toBe(404);
    expect(data).toStrictEqual({
      code: 404,
      detail: undefined,
      message: "Group(s) not found",
    });
  });

  it("should validate group names", () => {
    // Basic valid names
    expect(isGroupNameValid("__valid_underscores__")).toBe(true);
    expect(isGroupNameValid("Valid---words")).toBe(true);
    expect(isGroupNameValid("_GroupName")).toBe(true);
    expect(isGroupNameValid("Group.Name")).toBe(true);
    expect(isGroupNameValid("Group:Name")).toBe(true);
    expect(isGroupNameValid("Group+Name")).toBe(true);

    // Single-character valid names
    expect(isGroupNameValid("A")).toBe(true);
    expect(isGroupNameValid("a")).toBe(true);
    expect(isGroupNameValid("_")).toBe(true);

    // Mixed allowed characters
    expect(isGroupNameValid("Group_Name-123.456:789+ABC")).toBe(true);

    // Complex combinations
    expect(isGroupNameValid("__Group__Name--Test++123::456..ABC")).toBe(true);
    expect(isGroupNameValid("Group.Name-123:456+789_A-Z")).toBe(true);
    // Starting with invalid characters
    expect(isGroupNameValid("123InvalidStart")).toBe(false);        // Starts with digits
    expect(isGroupNameValid("-InvalidStart")).toBe(false);          // Starts with hyphen
    expect(isGroupNameValid(".InvalidStart")).toBe(false);          // Starts with dot
    expect(isGroupNameValid(":InvalidStart")).toBe(false);          // Starts with colon
    expect(isGroupNameValid("+InvalidStart")).toBe(false);          // Starts with plus
    expect(isGroupNameValid("*InvalidStart")).toBe(false);          // Starts with asterisk

    // Containing invalid characters in the middle
    expect(isGroupNameValid("Invalid*Char")).toBe(false);           // Contains asterisk
    expect(isGroupNameValid("Invalid Char")).toBe(false);           // Contains space
    expect(isGroupNameValid("Invalid/Char")).toBe(false);           // Contains slash
    expect(isGroupNameValid("Invalid#Char")).toBe(false);           // Contains hash
    expect(isGroupNameValid("Invalid@Char")).toBe(false);           // Contains at sign

    // Ending with invalid characters
    expect(isGroupNameValid("Group123")).toBe(false);               // Ends with number
    expect(isGroupNameValid("Example_Word-123")).toBe(false);       // Ends with number
    expect(isGroupNameValid("Group-Name.123")).toBe(false);         // Ends with number
    expect(isGroupNameValid("cannot_end_with.")).toBe(false);       // Ends with dot
    expect(isGroupNameValid("cannot_end-with-")).toBe(false);       // Ends with hyphen
    expect(isGroupNameValid("cannot_end_with+")).toBe(false);       // Ends with plus
    expect(isGroupNameValid("cannot_end_with:")).toBe(false);       // Ends with colon
    expect(isGroupNameValid("cannot_end_with*")).toBe(false);       // Ends with asterisk

    // Empty string
    expect(isGroupNameValid("")).toBe(false);

    // Strings with only invalid characters
    expect(isGroupNameValid(".")).toBe(false);
    expect(isGroupNameValid("-")).toBe(false);
    expect(isGroupNameValid(":")).toBe(false);
    expect(isGroupNameValid("+")).toBe(false);
    expect(isGroupNameValid("*")).toBe(false);

    // Strings with mixed invalid start and end
    expect(isGroupNameValid("123InvalidEnd-")).toBe(false);
    expect(isGroupNameValid("*InvalidEnd.")).toBe(false);
    expect(isGroupNameValid(":InvalidEnd+")).toBe(false);

    // Strings with dubious looking but valid sequences
    expect(isGroupNameValid("valid..Name")).toBe(true);          // Double dots 
    expect(isGroupNameValid("valid--Name")).toBe(true);          // Double hyphens
    expect(isGroupNameValid("valid::Name")).toBe(true);          // Double colons
    expect(isGroupNameValid("valid++Name")).toBe(true);          // Double pluses

    // Strings with trailing invalid characters
    expect(isGroupNameValid("ValidName.")).toBe(false);
    expect(isGroupNameValid("ValidName-")).toBe(false);
    expect(isGroupNameValid("ValidName:")).toBe(false);
    expect(isGroupNameValid("ValidName+")).toBe(false);

    // Strings with leading and trailing invalid characters
    expect(isGroupNameValid("-Invalid-")).toBe(false);
    expect(isGroupNameValid(".Invalid.")).toBe(false);
    expect(isGroupNameValid(":Invalid:")).toBe(false);
    expect(isGroupNameValid("+Invalid+")).toBe(false);
    // Single-character invalid names
    expect(isGroupNameValid("1")).toBe(false);                       // Starts with digit
    expect(isGroupNameValid("-")).toBe(false);                       // Single hyphen
    expect(isGroupNameValid(".")).toBe(false);                       // Single dot
    expect(isGroupNameValid(":")).toBe(false);                       // Single colon
    expect(isGroupNameValid("+")).toBe(false);                       // Single plus
    expect(isGroupNameValid("*")).toBe(false);

    // Extremely long strings (assuming no maximum length, but good to test)
    expect(isGroupNameValid("GroupName".repeat(1000))).toBe(true);  // 9000 characters long

    // Unicode characters (if not allowed)
    expect(isGroupNameValid("GrüßGroupe")).toBe(false);              // Contains 'ü' and 'ß'
    expect(isGroupNameValid("グループ名")).toBe(false);               // Japanese characters
    expect(isGroupNameValid("Группа")).toBe(false);                  // Cyrillic characters
    expect(isGroupNameValid("Group😊Name")).toBe(false);             // Emoji

    // Null or undefined inputs (if applicable)
    expect(isGroupNameValid(null)).toBe(false);
    expect(isGroupNameValid(undefined)).toBe(false);
  })
});
