const assert = require('assert');
const { codegenerator } = require('../utils');

describe('codegenerator', () => {
    it('should generate a 4-digit code', () => {
        const code = ValidationCodegenerator();
        assert.strictEqual(code.toString().length, 4);
    });

    it('generates a random code every time', () => {
      const code1 = ValidationCodegenerator();
      const code2 = ValidationCodegenerator();
      assert(code1 !== code2);
    });

});