/*
 *
 *
 *       Complete the handler logic below
 *
 *
 */

function ConvertHandler() {
  this.getNum = function(input) {
    var result;
    var numIdx = 0;

    for (var idx = input.length - 1; idx > 0; idx--) {
      if (input.charAt(idx) !== '/' && input.charAt(idx) !== '.') {
        var parsed = parseInt(input.charAt(idx));
        Number.isNaN(parsed) && (numIdx = idx);
      }
    }

    try {
      result = parseFloat(eval(input.substring(0, numIdx)));
    } catch (e) {
      result = 1;
    }

    return result;
  };

  this.getUnit = function(input) {
    var result;
    var numIdx;

    if (Number.isNaN(parseInt(input.charAt(0)))) {
      numIdx = 0;
    } else {
      for (var idx = input.length - 1; idx > 0; idx--) {
        if (input.charAt(idx) !== '/' && input.charAt(idx) !== '.') {
          var parsed = parseInt(input.charAt(idx));
          Number.isNaN(parsed) && (numIdx = idx);
        }
      }
    }

    result = input.substring(numIdx, input.length);

    if (this.getReturnUnit(result.toLowerCase())) {
      return result.toLowerCase();
    } else {
      return false;
    }
  };

  this.getReturnUnit = function(initUnit) {
    var result;

    switch (initUnit) {
      case 'gal':
        result = 'L';
        break;
      case 'lbs':
        result = 'kg';
        break;
      case 'mi':
        result = 'km';
        break;
      case 'l':
        result = 'gal';
        break;
      case 'kg':
        result = 'lbs';
        break;
      case 'km':
        result = 'mi';
        break;
      default:
        result = false;
        break;
    }

    return result;
  };

  this.spellOutUnit = function(unit) {
    var result;

    switch (unit) {
      case 'gal':
        result = 'gallons';
        break;
      case 'lbs':
        result = 'pounds';
        break;
      case 'mi':
        result = 'miles';
        break;
      case 'l':
        result = 'liters';
        break;
      case 'kg':
        result = 'kilograms';
        break;
      case 'km':
        result = 'kilometers';
        break;
      default:
        result = false;
        break;
    }

    return result;
  };

  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    var result;

    switch (this.getReturnUnit(initUnit)) {
      case 'gal':
        result = initNum * galToL;
        break;
      case 'lbs':
        result = initNum * lbsToKg;
        break;
      case 'mi':
        result = initNum * miToKm;
        break;
      case 'l':
        result = initNum / galToL;
        break;
      case 'kg':
        result = initNum / lbsToKg;
        break;
      case 'km':
        result = initNum / miToKm;
      default:
        result = false;
        break;
    }

    return result;
  };

  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    var result;

    result = `${initNum} ${initUnit} converts to ${returnNum.toFixed(5)} ${returnUnit}`;

    return result;
  };
}

module.exports = ConvertHandler;
