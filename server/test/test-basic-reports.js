import * as basic from "./../reports/basic/basic.js"
import assert from "assert"

describe("basic reports", function () {
  it("should return a flattened object", function () {
    var data = {
      a: 1,
      b: [1, 2, 3, 4],
      c: {a: 1, b: 2, c: {a: 1, b: null}}
    };
    var result = basic.flatten(data);
    var expected = {a: 1, 'c.a': 1, 'c.b': 2, 'c.c.a': 1};
    assert.deepEqual(result, expected);
  });

  it("should generate valid csv text", function () {
    var data = [{c: 3, g: 4}, {c: 1, a: 4}, {c: 3, g: 5, a: 5}];
    var csv = basic.toCSV(data);
    var expected = "\"c\",\"g\",\"a\"\n3,4,\n1,,4\n3,5,5";
    assert.equal(csv, expected);
  });

  it("should generate valid front-end json", function () { 
    var data = [{c: 3, g: {x: 99}}, {c: 1, a: 4}, {c: 3, g: 5, a: 5}];
    var result = basic.formatJSON(data);
    var expectedHeaders = ["c", "g.x", "a", "g"];
    var resultHeaders = result.headers.concat();
    assert.deepEqual(resultHeaders.sort(), expectedHeaders.sort());
    var index = result.headers.indexOf("g.x");
    assert.equal(result.data[0][index], 99);
    assert.equal(result.data[1][index], "");
    assert.equal(result.data[2][index], "");
  })
});
