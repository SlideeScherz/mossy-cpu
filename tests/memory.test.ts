import { expect } from 'chai';
import { Memory } from '../src/hardware/Memory';

//redefine console.log so we disable console output
console.log = function() {}

const mem = new Memory(11, 'Memory.test.ts', false);

describe('Memory', () => {
  it('memory is an array', () => {
    expect(mem.memory).to.be.an('array');
  });

  it('memory capacity is 0xffff', () => {
    expect(mem.memoryCapacity).to.equal(0xffff);
  });

  it('read/write', () => {
    let addr: number = 1;
    let data: number = 1;

    mem.memory[addr] = data;
    expect(mem.memory[addr]).to.equal(data);
  });
});
