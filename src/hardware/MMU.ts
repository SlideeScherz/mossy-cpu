import { Hardware } from "./Hardware";
import { Memory } from "./Memory";

const mem = new Memory(2, "Memory / MMU", false);

/** __Memory Management Unit__
 * - This class will be responsible for the management of all memory
 * - In order for the Memory and CPU to communicate, they must do so through the MMU Class
 * - This includes allowing memory to be read and written by CPU
 */
export class MMU extends Hardware {
  /** Memory address register
   * - Used as the index to parse the memory array
   * - 16 bit register
   */
  private _mar: number = 0x0000;
  public get mar(): number {
    return this._mar;
  }
  public set mar(value: number) {
    this._mar = value;
  }

  /** Memory data register
   * - Data returned from memory
   * - Or buffer for data that is about to be written to memory
   * - 8 Bit register
   */
  private _mdr: number = 0x00;
  public get mdr(): number {
    return this._mdr;
  }
  public set mdr(value: number) {
    this._mdr = value;
  }

  /** Used for Decode step of pipeline
   * - Used for 1 byte memory references.
   * - 8 bit
   */
  private static _decodedByte1: number = null;
  public static get decodedByte1(): number {
    return MMU._decodedByte1;
  }
  public static set decodedByte1(value: number) {
    MMU._decodedByte1 = value;
  }

  /** Used for Decode step of pipeline
   * - Used for 2 byte memory references.
   * - 8 bit, second register to construct a 16 bit address
   */
  private static _decodedByte2: number = null;
  public static get decodedByte2(): number {
    return this._decodedByte2;
  }
  public static set decodedByte2(value: number) {
    this._decodedByte2 = value;
  }

  constructor(hardwareID: number, hardwareName: string, debug: boolean) {
    super(hardwareID, hardwareName, debug);

    this.resetMemory();
  }

  /**
   * Input a number and output it in hexlog format
   * ```js
   * console.log(hexLog(0x0A15)); //16 bits
   * console.log(hexLog(0x0A, 8));    //8 bits
   * ```
   */
  public hexLog(value: number, bytes: number): string {
    //Error handling
    if (value == undefined) {
      return "undef.";
    }

    let len = value.toString(16).length;
    let hex = value.toString(16).toUpperCase();

    //16 bit formatting
    if (bytes === 2) {
      if (value > 9 && value < 16) {
        return "0x000" + hex;
      }

      switch (len) {
        case 1:
          return "0x000" + hex;

        case 2:
          return "0x00" + hex;

        case 3:
          return "0x0" + hex;

        case 4:
          return "0x" + hex;
      }
    }

    //8 bit formatting
    else if (bytes === 1) {
      switch (len) {
        case 1:
          return "0x0" + hex;

        case 2:
          return "0x" + hex;

        case 3:
          return "0x" + hex;

        default:
          this.errorLog(this, `Error hex decoding 8 bit number. with len of ${len}`);
          return null;
      }
    }
  }

  /** Fetch memory data
   * - This allows the MMU to send data from RAM to the CPU by accessing the Memory MAR and MDR
   * - This will return the MDR so the CPU Doesnt voilate the scope
   * @param address which will be used to set memory address
   * @returns data from MDR
   */
  public read(address: number): number {
    //Update MAR
    this.mar = address;

    this.mdr = mem.memory[this.mar];

    return this.mdr;
  }

  /** Send data from the CPU to memory
   * @param address which will be used to set memory address
   * @param data Data to be written in location
   */
  public write(address: number, data: number): void {
    //read the address and update MAR
    this.mar = address;

    //update the MDR with given data
    this.mdr = data;

    mem.memory[this.mar] = this.mdr;
  }

  /** Create a little endian pointer for the CPU's Stack pointer
   * - ref: https://www.i-programmer.info/programming/javascript/6151-javascript-data-structures-typed-arrays-ii.html?start=1
   * @param value 8 Bit integer to write to the MAR
   */
  public createPointer(lowByte: number, highByte: number): number {
    var bytes = new Uint8Array(2);
    bytes[0] = lowByte;
    bytes[1] = highByte;

    var buffer = bytes.buffer;
    var datav = new DataView(buffer);
    var uint = datav.getUint16(0, true); //TODO: return this save 2 lines?

    return uint;
  }

  /** Fetch and display memory from the memory class
   * @param startAddress used to specify address where to begin reading
   * @param endAddress indicates address to break
   */
  public memoryDump(startAddress: number, endAddress: number): void {
    console.log("====================");
    this.log(this, "Memory Dump");

    //create a json for each Memory address
    for (let i = startAddress; i <= endAddress; i++) {
      console.log(`Address: ${i}: ${this.read(i)}`);
    }
    console.log("====================");
  }

  /** Reset all memory to 0x00 */
  public resetMemory(): void {
    mem.memory.forEach((addr) => this.write(addr, 0x00));
    this.log(this, `Memory Reset, ${mem.memory.length} elements`);
  }
}
