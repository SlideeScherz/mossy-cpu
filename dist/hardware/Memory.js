"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memory = void 0;
const Hardware_1 = require("./Hardware");
/**
 * This class will hold all memory data and the memory array simulting a disc and ram
 * This includes initializing memory with correct memory capacity
 */
class Memory extends Hardware_1.Hardware {
    constructor(hardwareID, hardwareName, debug) {
        //construct an object of the hardware class
        super(hardwareID, hardwareName, debug);
        /** RAM for 6502*/
        this._memory = [];
        //memory capacity of 6502: 65536 bytes
        this.memoryCapacity = 0xffff;
        //create Memory arr with correct size
        for (let i = 0; i < this.memoryCapacity; i++) {
            this.memory[i] = 0x00;
        }
    }
    get memory() {
        return this._memory;
    }
    set memory(value) {
        this._memory = value;
    }
}
exports.Memory = Memory;
//# sourceMappingURL=Memory.js.map