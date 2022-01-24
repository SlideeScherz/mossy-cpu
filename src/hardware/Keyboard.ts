import { System } from "../System";
import { ASCII } from "../utility/ASCII";
import { Hardware } from "./Hardware";
import { ClockListener } from "./imp/ClockListener";
import { Interupt } from "./imp/interupt";
import { InterruptController } from "./InterruptController";

const stdin = process.stdin;
const irqController = new InterruptController(1, "IRQ-Key", false);

/** Interface in which the user can give commands from the terminal */
export class Keyboard extends Hardware implements ClockListener, Interupt {
  //interrupt members
  public IRQNum: number = 2;
  public IRQname: string = "Key input given";
  public outputBuffer: number[] = [];

  constructor(hardwareID: number, hardwareName: string, debug: boolean) {
    super(hardwareID, hardwareName, debug);

    this.monitorKeys();
  }

  /** Async Method to receive key input.
   * - Character stream from stdin code (most of the contents of this function) taken from
   * https://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin
   * - This takes care of the simulation.
   * - Capture stdin from the console and retrieve the character.
   * - Then store in the buffer and trigger the interrupt.
   */
  private monitorKeys(): void {
    let rawMode: boolean = false;

    if (!rawMode) {
      this.log(
        this,
        "gitBash cannot run 'setRawMode', so default is set to disabled."
      );
      this.log(
        this,
        "To enable RawMode, in src/Keyboard.ts set rawMode to true"
      );
    }

    //toggle rawmode
    //stdin.setRawMode(rawMode);

    // resume stdin in the parent process (node app won't quit all by itself
    // unless an error or process.exit() happens)
    stdin.resume();

    // i don't want binary, do you?
    stdin.setEncoding(null);

    stdin.on(
      "data",
      function (key: { toString: () => string }) {
        let keyPressed: string = key.toString();

        let keyPressedHex: number = ASCII.getHex(keyPressed);

        // this let's us break out with ctrl-c for non node.js users
        if (key.toString() === "\u0003") {
          System.stopSystem();
        }

        // put the key value in the buffer
        this.outputBuffer.push(keyPressedHex);

        //required when running an asynchronous process in node that wishes to reference an instance of an object.
      }.bind(this)
    );
  }

  //Only send interupts on a clock pulse
  pulse(): void {
    //if there are any interupts, send them to IQR
    if (this.outputBuffer.length > 0) {
      irqController.acceptInterrupt(this);

      if (this.debug) console.log(`Sending interupt: ${this}`);
    }
  }
}
