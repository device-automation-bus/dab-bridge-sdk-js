const { spawn, execSync} = require('child_process');

describe("Integration Test of Bridge Device Management Routes", () => {
  let mosquitto_child = null;

  beforeAll(() => {
    console.log("gagan print ez");
    mosquitto_child = spawn("mosquitto");
    console.log("gagan print code -- " + JSON.stringify(mosquitto_child));
  })

  test("fakeTest", () => {

  })

  afterAll(() => {
    // teardown mosquitto
    mosquitto_child.kill();
  })
});
