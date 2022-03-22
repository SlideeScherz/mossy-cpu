import { expect } from "chai";
import { MMU } from "../src/hardware/MMU";

const mmu = new MMU(11, "MMU.test.ts", false);

describe("MMU", () => {
  it("hexlog, 1 byte", () => {
    expect(mmu.hexLog(5, 1)).to.equal("0x5");
  });

  it("hexlog, 2 bytes", () => {
    expect(mmu.hexLog(5, 2)).to.equal("0x0005");
  });

  it("read/write", () => {
    let addr: number = 1;
    let data: number = 1;

    mmu.write(addr, data);
    expect(mmu.read(addr)).to.equal(data);
  });
});
