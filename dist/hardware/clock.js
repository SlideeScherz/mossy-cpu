"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clock = void 0;
const Hardware_1 = require("./Hardware");
class Clock extends Hardware_1.Hardware {
    constructor(hardwareID, hardwareName, debug) {
        super(hardwareID, hardwareName, debug);
        /** Array to hold all listeners to be cycled */
        this.listeners = [];
    }
    /** Pulse and cycle all ClockListeners in listeners array
     * - Call pulse method to all ClockListners children
     * - Listeners specified in ```./src/System```
     */
    cycle() {
        this.listeners.forEach((listener) => {
            listener.pulse();
            if (this.debug)
                this.log(this, `Pulsing: ${listener.constructor.name}`);
        });
    }
}
exports.Clock = Clock;
//# sourceMappingURL=clock.js.map