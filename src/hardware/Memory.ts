import { Hardware } from "./Hardware";

/**
 * This class will hold all memory data and the memory array simulting a disc and ram
 * This includes initializing memory with correct memory capacity
 */
export class Memory extends Hardware {
  /** RAM for 6502*/
  private _memory: number[] = [];
  public get memory() {
    return this._memory;
  }
  public set memory(value) {
    this._memory = value;
  }

  //memory capacity of 6502: 65536 bytes
  private _memoryCapacity: number = 0xffff;
  public get memoryCapacity(): number {
    return this._memoryCapacity;
  }
  public set memoryCapacity(value: number) {
    this._memoryCapacity = value;
  }

  constructor(hardwareID: number, hardwareName: string, debug: boolean) {
    //construct an object of the hardware class
    super(hardwareID, hardwareName, debug);

    //create Memory arr with correct size
    for (let i = 0; i < this.memoryCapacity; i++) {
      this.memory[i] = 0x00;
    }
  }
}
