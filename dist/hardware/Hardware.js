"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hardware = void 0;
var colors = require("../../node_modules/colors/lib/index");
/** SuperClass for all hardware */
class Hardware {
    //assign name and id to each object
    constructor(hardwareID, hardwareName, debug) {
        this.id = hardwareID;
        this._name = hardwareName;
        this.debug = debug;
        this.log(this, colors.green(`Created hardware ${hardwareName}`));
    }
    /** Print a log statement with the hardware and a personal message
     * @param hardware the current class the log is being called from
     * @param message string message to be outputted to terminal
     */
    log(hardware, message) {
        let timeStamp = new Date().valueOf(); //local time and date
        console.log(`[HW: ${hardware._name} ID: ${hardware.id} @ ${timeStamp}] ${message}`);
    }
    /** Quick way to report errors to terminal
     * @param hardware hardware object
     * @param message custom messege to alert terminal
     */
    errorLog(hardware, message) {
        console.log(colors.red.bold(`Error [HW: ${hardware._name}] ${message}`));
    }
}
exports.Hardware = Hardware;
//# sourceMappingURL=Hardware.js.map