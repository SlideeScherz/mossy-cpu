"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
// import classes
const clock_1 = require("./hardware/clock");
const Cpu_1 = require("./hardware/Cpu");
const Hardware_1 = require("./hardware/Hardware");
const Memory_1 = require("./hardware/Memory");
const MMU_1 = require("./hardware/MMU");
const Keyboard_1 = require("./hardware/Keyboard");
const InterruptController_1 = require("./hardware/InterruptController");
const opCode_1 = require("./utility/opCode");
//Possibly the max speed for node.js
const CLOCK_INTERVAL = 20;
var colors = require("../node_modules/colors/lib/index");
class System {
    constructor() {
        //Initialization Parameters for Hardware
        this._CPU = null;
        this._Memory = null;
        this._Clock = null;
        this._MMU = null;
        this._KEY = null;
        this._IRQ = null;
        this._Hardware = null;
        this.startSystem();
    }
    startSystem() {
        /*==================Initialize Hardware (turn on components)==================*/
        this._CPU = new Cpu_1.Cpu(1, "CPU", false);
        this._Memory = new Memory_1.Memory(2, "RAM", false);
        this._Clock = new clock_1.Clock(3, "CLK", false);
        this._MMU = new MMU_1.MMU(4, "MMU", false);
        this._KEY = new Keyboard_1.Keyboard(5, "KEY", false);
        this._IRQ = new InterruptController_1.InterruptController(6, "IRQ", false);
        this._Hardware = new Hardware_1.Hardware(7, "HW!", false);
        //populate Clock.listeners[] with hardware
        this._Clock.listeners[0] = this._CPU;
        this._Clock.listeners[1] = this._KEY;
        this._Clock.listeners[2] = this._IRQ;
        /*==================6502 Startup==================*/
        //Hello world!
        // load constant 2 to xReg
        this._MMU.write(0x0000, opCode_1.op.LDX);
        this._MMU.write(0x0001, 0x02);
        // load yReg with string
        this._MMU.write(0x0002, opCode_1.op.LDY);
        this._MMU.write(0x0003, 0x48); //H
        this._MMU.write(0x0004, opCode_1.op.SYS); //Print yReg String
        this._MMU.write(0x0005, opCode_1.op.LDY);
        this._MMU.write(0x0006, 0x65); //e
        this._MMU.write(0x0007, opCode_1.op.SYS); //Print yReg String
        this._MMU.write(0x0008, opCode_1.op.LDY);
        this._MMU.write(0x0009, 0x6c); //l
        this._MMU.write(0x000a, opCode_1.op.SYS); //Print yReg String
        this._MMU.write(0x000b, opCode_1.op.LDY);
        this._MMU.write(0x000c, 0x6c); //l
        this._MMU.write(0x000d, opCode_1.op.SYS); //Print yReg String
        this._MMU.write(0x000e, opCode_1.op.LDY);
        this._MMU.write(0x000f, 0x6f); //o
        this._MMU.write(0x0010, opCode_1.op.SYS); //Print yReg String
        this._MMU.write(0x0011, opCode_1.op.LDY);
        this._MMU.write(0x0012, 0x20); //space
        this._MMU.write(0x0013, opCode_1.op.SYS); //Print yReg String
        this._MMU.write(0x0014, opCode_1.op.LDY);
        this._MMU.write(0x0015, 0x57); //w
        this._MMU.write(0x0016, opCode_1.op.SYS); //Print yReg String
        this._MMU.write(0x0017, opCode_1.op.LDY);
        this._MMU.write(0x0018, 0x6f); //o
        this._MMU.write(0x0019, opCode_1.op.SYS); //Print yReg String
        this._MMU.write(0x001a, opCode_1.op.LDY);
        this._MMU.write(0x001b, 0x72); //r
        this._MMU.write(0x001c, opCode_1.op.SYS); //Print yReg String
        this._MMU.write(0x001d, opCode_1.op.LDY);
        this._MMU.write(0x001e, 0x6c); //l
        this._MMU.write(0x001f, opCode_1.op.SYS); //Print yReg String
        this._MMU.write(0x0020, opCode_1.op.LDY);
        this._MMU.write(0x0021, 0x64); //d
        this._MMU.write(0x0022, opCode_1.op.SYS); //Print yReg String
        this._MMU.write(0x0023, opCode_1.op.LDY);
        this._MMU.write(0x0024, 0x21); //!
        this._MMU.write(0x0025, opCode_1.op.SYS); //Print yReg String
        //Pulse with a timed interval repeat
        const intervalObj = setInterval(() => {
            this._Clock.cycle();
        }, CLOCK_INTERVAL);
        return true;
    }
    static stopSystem() {
        console.log(colors.magenta("Info: [HW: SYS] : Shutting Down"));
        process.exit();
    }
}
exports.System = System;
//main
let system = new System();
//# sourceMappingURL=System.js.map