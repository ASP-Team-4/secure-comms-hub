const assert = require("assert");
const { ValidationCodegenerator, createAppointmentSlots } = require("../utils");

describe("codegenerator", () => {
  it("should generate a 4-digit code", () => {
    const code = ValidationCodegenerator();
    assert.strictEqual(code.toString().length, 4);
  });

  it("generates a random code every time", () => {
    var codes = [];

    const code1 = ValidationCodegenerator();
    const code2 = ValidationCodegenerator();
    const code3 = ValidationCodegenerator();
    const code4 = ValidationCodegenerator();
    const code5 = ValidationCodegenerator();
    var codes = [code1, code2, code3, code4, code5];
    for (var i = 0; i < 5; i++) {
      console.log(codes[i]);
      for (var j = 0; j < 5; j++) {
        if (i != j) {
          assert(codes[i] !== codes[j]);
        }
      }
    }
  });
});

describe("Appointment slot generator", () => {
  it("should generate only future appointment timestamps", () => {
    const AppointmentObj = createAppointmentSlots();
    const currentTimeStamp = new Date();
    for (var i = 0; i < AppointmentObj.length; i++) {
      for (var j = 0; j < AppointmentObj[i]["timestamps"].length; j++) {
        var futureTimestamp = new Date(AppointmentObj[i]["timestamps"][j]);
        assert(futureTimestamp > currentTimeStamp);
      }
    }
  });
});
