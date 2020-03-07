let foo = "foo";
let bar = "bar";
let baz = "baz";
let object = {};

//dot notation when possible
foo = object.foo;
foo = object["invalid-variable-name"];

//dot on newline or on the same line
foo = object
  .property;
bar = object.property;

//no floating decimals
foo = 0.5;
foo = -0.5;
foo = 5.0;

//remove extraneous spaces
foo = 5.0;

//require spaces inside one line function block
function footwo() {
  return true;
}

//one true brace style
if (foo) {
  foo = "a";
} else {
  foo = "b";
}

//comments must start with a lowercase letter
//test

//must have trailing commas
foo = {
  a: "a",
  b: "b",
  c: "c",
};

//one space after commas, no space before
let a, b, c;

//no space after func name
alert("hello world");

//no newlines in function args
alert(foo, baz, bar);

//arrow functions braces must be on the same line
const funcName = ()=> {};

//double quotes for strings
foo = "hello world";

//colon spacing in dictionaries
foo = {
  a: "a",
  b: "b",
};

//space before/after keywords
if (foo){}

//newlines between class functions
class Test{
  func1(){}

  func2(){}
}

//chained functions go on newlines, unless there's <=3
d3.select("body").selectAll("p");
d3.select("body").selectAll("p").data([4, 8, 15, 16, 23, 42,])
  .enter()
  .append("p")
  .text(function(d) {
    return "I'm number " + d + "!";
  });

//remove trailing whitespace
foo = "5";

//remove leading whitespace before properties
foo.bar = "5";

//all properties on one line, or all on separate lines
const newObject = {
  a: "a.m.",
  b: "p.m.",
  c: "daylight saving time",
};

//no operator shorthand
foo = foo + 5

//no block padding
if (true){

  console.log("hello world")
  
}

//use exponent operator
Math.pow(5, 5)

//add semicolons at the end of each line
foo = 5.0

//no spaces before semicolons
f = 5.0 ;


//no space before function parenthesis
function testFuncTwo (){}

//no space inside parenthesis
foo = 4*( 5+5 )

//space around infix operators
foo = 5+5

//no leading space for comments
// example

//spaces around arrow functions arrows
foo = ()=>{} 