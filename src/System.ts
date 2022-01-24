// import classes
import { Clock } from "./hardware/clock";
import { Cpu } from "./hardware/Cpu";
import { Hardware } from "./hardware/Hardware";
import { Memory } from "./hardware/Memory";
import { MMU } from "./hardware/MMU";
import { Keyboard } from "./hardware/Keyboard";
import { InterruptController } from "./hardware/InterruptController";
import { op } from "./utility/opCode";

//Possibly the max speed for node.js
const CLOCK_INTERVAL: number = 20;

/**test bounds and memory of your 6502*/
const stessTest = [
  op.LDA,
  0xa9,
  op.LDX,
  0x01,
  op.CPX,
  0x13,
  0x00,
  op.LDY_Mem,
  0x0b,
  0x00,
  op.STA,
  0xf0,
  0x00,
  op.INC,
  0x0b,
  0x00,
  op.BNE,
  0xf5,
  0x00,
  0x00, //brk
];

/**Print hello world to the screen */
const helloWorld = [
  op.LDX,
  0x02,

  // load yReg with string, then Print yReg String
  op.LDY,
  0x48,
  op.SYS,

  op.LDY,
  0x65,
  op.SYS,

  op.LDY,
  0x6c,
  op.SYS,

  op.LDY,
  0x6c,
  op.SYS,

  op.LDY,
  0x6f,
  op.SYS,

  op.LDY,
  0x20,
  op.SYS,

  op.LDY,
  0x57,
  op.SYS,

  op.LDY,
  0x6f,
  op.SYS,

  op.LDY,
  0x72,
  op.SYS,

  op.LDY,
  0x6c,
  op.SYS,

  op.LDY,
  0x64,
  op.SYS,

  op.LDY,
  0x21,
  op.SYS,
];

const powers = [
  0xA9, 0x00, 
  0x8D, 0x40, 0x00, 
  0xA9, 0x01, 
  0x6D, 0x40, 0x00, 
  0x8D, 0x40, 0x00, 
  0xA8,
  0xA2, 0x01, 
  0xFF, 
  0xD0, 0xF4, 
  0x00
]

var colors = require("../node_modules/colors/lib/index");

export class System {
  //Initialization Parameters for Hardware
  private _CPU: Cpu = null;
  private _Memory: Memory = null;
  private _Clock: Clock = null;
  private _MMU: MMU = null;
  private _KEY: Keyboard = null;
  private _IRQ: InterruptController = null;
  private _Hardware: Hardware = null;

  constructor() {
    this.startSystem();
  }

  /** Load an array of opcodes and data into memory
   * @param startAddress RAM Address to start writing
   * @param program Array of data
   */
  private loadProgram(startAddress: number, program: number[]): void {
    var data = 0;

    for (let i = startAddress; data < program.length; i++) {
      this._MMU.write(i, program[data]);
      data++;
    }
  }

  public startSystem(): boolean {
    /*==================Initialize Hardware (turn on components)==================*/
    this._CPU = new Cpu(1, "CPU", false);
    this._Memory = new Memory(2, "RAM", false);
    this._Clock = new Clock(3, "CLK", false);
    this._MMU = new MMU(4, "MMU", false);
    this._KEY = new Keyboard(5, "KEY", false);
    this._IRQ = new InterruptController(6, "IRQ", false);
    this._Hardware = new Hardware(7, "HW!", false);

    //populate Clock.listeners[] with hardware
    this._Clock.listeners[0] = this._CPU;
    this._Clock.listeners[1] = this._KEY;
    this._Clock.listeners[2] = this._IRQ;

    /*==================6502 Startup==================*/

    this.loadProgram(0x00, powers);

    //Pulse with a timed interval repeat
    const intervalObj = setInterval(() => {
      this._Clock.cycle();
    }, CLOCK_INTERVAL);

    return true;
  }

  public static stopSystem(): void {
    console.log(colors.magenta("Info: [HW: SYS] : Shutting Down"));
    process.exit();
  }
}

//main
let system: System = new System();
