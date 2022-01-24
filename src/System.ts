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

    //Hello world!

    // load constant 2 to xReg
    this._MMU.write(0x0000, op.LDX);
    this._MMU.write(0x0001, 0x02);

    // load yReg with string
    this._MMU.write(0x0002, op.LDY);
    this._MMU.write(0x0003, 0x48); //H
    this._MMU.write(0x0004, op.SYS); //Print yReg String

    this._MMU.write(0x0005, op.LDY);
    this._MMU.write(0x0006, 0x65); //e
    this._MMU.write(0x0007, op.SYS); //Print yReg String

    this._MMU.write(0x0008, op.LDY);
    this._MMU.write(0x0009, 0x6c); //l
    this._MMU.write(0x000a, op.SYS); //Print yReg String

    this._MMU.write(0x000b, op.LDY);
    this._MMU.write(0x000c, 0x6c); //l
    this._MMU.write(0x000d, op.SYS); //Print yReg String

    this._MMU.write(0x000e, op.LDY);
    this._MMU.write(0x000f, 0x6f); //o
    this._MMU.write(0x0010, op.SYS); //Print yReg String

    this._MMU.write(0x0011, op.LDY);
    this._MMU.write(0x0012, 0x20); //space
    this._MMU.write(0x0013, op.SYS); //Print yReg String

    this._MMU.write(0x0014, op.LDY);
    this._MMU.write(0x0015, 0x57); //w
    this._MMU.write(0x0016, op.SYS); //Print yReg String

    this._MMU.write(0x0017, op.LDY);
    this._MMU.write(0x0018, 0x6f); //o
    this._MMU.write(0x0019, op.SYS); //Print yReg String

    this._MMU.write(0x001a, op.LDY);
    this._MMU.write(0x001b, 0x72); //r
    this._MMU.write(0x001c, op.SYS); //Print yReg String

    this._MMU.write(0x001d, op.LDY);
    this._MMU.write(0x001e, 0x6c); //l
    this._MMU.write(0x001f, op.SYS); //Print yReg String

    this._MMU.write(0x0020, op.LDY);
    this._MMU.write(0x0021, 0x64); //d
    this._MMU.write(0x0022, op.SYS); //Print yReg String

    this._MMU.write(0x0023, op.LDY);
    this._MMU.write(0x0024, 0x21); //!
    this._MMU.write(0x0025, op.SYS); //Print yReg String

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
