import { expect } from 'chai';
import { Memory } from '../src/hardware/Memory';

const mem = new Memory(11, 'Memory.test.ts', false);

describe('Memory', () => {
  it('memory array type', () => {
    expect(mem.memory).to.be.an('array');
  });

  it('memory capacity type', () => {
    expect(mem.memoryCapacity).to.be.a('number');
  });

  it('memory capacity value', () => {
    expect(mem.memoryCapacity).to.equal(0xffff);
  });

  it('read/write', () => {
    let addr: number = 1;
    let data: number = 1;

    mem.memory[addr] = data;
    expect(mem.memory[addr]).to.equal(data);
  });
});
