const assert = require("assert");
const { ValidationCodegenerator, createAppointmentSlots } = require("../utils");

describe("codegenerator", () => {
  it("should generate a 4-digit code", () => {
    const code = ValidationCodegenerator();
    assert.strictEqual(code.toString().length, 4);
  });

  it("generates a random code every time", () => {
    const codes = [];

    for (let i = 0; i < 50; i++) {
      codes.push(ValidationCodegenerator());
    }

    for (let i = 0; i < codes.length; i++) {
      for (let j = 0; j < codes.length; j++) {
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
        const futureTimestamp = new Date(AppointmentObj[i]["timestamps"][j]);
        assert(futureTimestamp > currentTimeStamp);
      }
    }
  });
});
