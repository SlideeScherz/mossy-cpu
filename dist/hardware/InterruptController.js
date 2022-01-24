"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterruptController = void 0;
const Hardware_1 = require("./Hardware");
class InterruptController extends Hardware_1.Hardware {
    constructor(hardwareID, hardwareName, debug) {
        super(hardwareID, hardwareName, debug);
        /** Interrupt Queue */
        this.iQueue = [];
        this.irqsPending = 0;
        this.IRQname = "IRQ Controller";
    }
    /** Allow classes to call this and add data to the irq input buffer
     * Also, iterate the iQueue and place it in the correct index
     * @param interupt received interupt __object__
     */
    acceptInterrupt(irq) {
        if (this.debug) {
            this.log(this, `Interrupt Received: ${irq.IRQname}`);
        }
        //add interupt to back of Queue
        this.iQueue.push(irq);
        this.sortIQueue();
    }
    /** Sort by IRQ priority
     * - ref: https://www.javascripttutorial.net/javascript-array-sort/
     */
    sortIQueue() {
        //only call this when multiple interupt requests are recevied
        if (this.irqsPending > 1) {
            this.iQueue.sort(function (a, b) {
                return a.IRQNum - b.IRQNum;
            });
        }
        else {
            //pass
        }
    }
    /**Each pulse, check the amount of interupts recd. */
    irqChecker() {
        return this.iQueue.length;
    }
    pulse() {
        this.irqsPending = this.irqChecker();
    }
}
exports.InterruptController = InterruptController;
//# sourceMappingURL=InterruptController.js.map