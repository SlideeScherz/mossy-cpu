import { ASCII } from '../src/utility/ascii';
import { expect } from 'chai';

//redefine console.log so we disable console output
console.log = function() {}

describe('ASCII', () => {

  ASCII.setMap();

  it(`map initialized`, () => {  
    expect(ASCII.ASCIIMap).has.length.greaterThan(0);
  });

  it(`map correct capacity`, () => {  
    expect(ASCII.ASCIIMap).has.lengthOf(128);
  });

  for(let i: number = 0; i < 128; i++){

    let char: string = ASCII.getChar(i);
    let key: number = ASCII.getHex(char);

    it(`correct key and value: ${char} => ${key}`, () => {  
      expect(i).to.equal(key);
    });
  }

});
