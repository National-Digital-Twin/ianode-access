import admin from "../index";

describe("Admin Router", () => {


  it("Correct number of routers exists on", () => {
    const { stack } = admin;

    expect(
      stack.length
    ).toBe(6);
  });
});
