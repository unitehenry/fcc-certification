const ConvertHandler = require('./controllers/convertHandler');

function test(){

  const convert = new ConvertHandler();

  let input = 'lbs';
  let num =  convert.getNum(input);
  let unit = convert.getUnit(input);
  let returnUnit = convert.getReturnUnit(unit);
  let spelledOut = convert.spellOutUnit(returnUnit);
  let converted = convert.convert(num, unit);
  let output = convert.getString(num, unit, converted, returnUnit);

  console.log('getNum', num || 'invalid number');
  console.log('getUnit', unit || 'invalid unit');
  console.log('getReturnUnit', returnUnit || 'invalid unit');
  console.log('spellOutUnit', spelledOut || 'invalid unit');
  console.log('convert', converted)
  console.log('toString', output);

}

test();
