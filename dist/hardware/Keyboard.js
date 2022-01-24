"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keyboard = void 0;
const System_1 = require("../System");
const ASCII_1 = require("../utility/ASCII");
const Hardware_1 = require("./Hardware");
const InterruptController_1 = require("./InterruptController");
const stdin = process.stdin;
const irqController = new InterruptController_1.InterruptController(1, "IRQ-Key", false);
/** Interface in which the user can give commands from the terminal */
class Keyboard extends Hardware_1.Hardware {
    constructor(hardwareID, hardwareName, debug) {
        super(hardwareID, hardwareName, debug);
        //interrupt members
        this.IRQNum = 2;
        this.IRQname = "Key input given";
        this.outputBuffer = [];
        this.monitorKeys();
    }
    /** Async Method to receive key input.
     * - Character stream from stdin code (most of the contents of this function) taken from
     * https://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin
     * - This takes care of the simulation.
     * - Capture stdin from the console and retrieve the character.
     * - Then store in the buffer and trigger the interrupt.
     */
    monitorKeys() {
        let rawMode = false;
        if (!rawMode) {
            this.log(this, "gitBash cannot run 'setRawMode', so default is set to disabled.");
            this.log(this, "To enable RawMode, in src/Keyboard.ts set rawMode to true");
        }
        //toggle rawmode
        //stdin.setRawMode(rawMode);
        // resume stdin in the parent process (node app won't quit all by itself
        // unless an error or process.exit() happens)
        stdin.resume();
        // i don't want binary, do you?
        stdin.setEncoding(null);
        stdin.on("data", function (key) {
            let keyPressed = key.toString();
            let keyPressedHex = ASCII_1.ASCII.getHex(keyPressed);
            // this let's us break out with ctrl-c for non node.js users
            if (key.toString() === "\u0003") {
                System_1.System.stopSystem();
            }
            // put the key value in the buffer
            this.outputBuffer.push(keyPressedHex);
            //required when running an asynchronous process in node that wishes to reference an instance of an object.
        }.bind(this));
    }
    //Only send interupts on a clock pulse
    pulse() {
        //if there are any interupts, send them to IQR
        if (this.outputBuffer.length > 0) {
            irqController.acceptInterrupt(this);
            if (this.debug)
                console.log(`Sending interupt: ${this}`);
        }
    }
}
exports.Keyboard = Keyboard;
//# sourceMappingURL=Keyboard.js.map