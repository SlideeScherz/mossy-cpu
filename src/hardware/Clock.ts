import { Hardware } from "./Hardware";
import { ClockListener } from "./imp/ClockListener";

export class Clock extends Hardware {
  /** Array to hold all listeners to be cycled */
  public listeners: ClockListener[] = [];

  constructor(hardwareID: number, hardwareName: string, debug: boolean) {
    super(hardwareID, hardwareName, debug);
  }

  /** Pulse and cycle all ClockListeners in listeners array
   * - Call pulse method to all ClockListners children
   * - Listeners specified in ```./src/System```
   */
  cycle(): void {
    this.listeners.forEach((listener) => {
      listener.pulse();
      if (this.debug) this.log(this, `Pulsing: ${listener.constructor.name}`);
    });
  }
}
