const assert = require('assert');

const {describe} = require('mocha');
const {it} = require('mocha');
const chai = import('chai');
const expect = chai.expect;
const { equal } = require('./utils');



// describe('Code', function() {
//     it('should generate a 4-digit code', function() {
//         const code = ValidationCodegenerator();
//         assert.equal(code.length, 4);
//         assert.ok(/^\d{4}$/.test(code));
//     });
// });

describe('Code generator', function(){
    it('should generate a 4-digit code', function(){
      const code = ValidationCodegenerator();
      assert.equal(code.length, 4);
      assert.ok(/^\d{4}$/.test(code));
    });
  });


mocha.run();