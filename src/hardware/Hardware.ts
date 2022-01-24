var colors = require("../../node_modules/colors/lib/index");

/** SuperClass for all hardware */
export class Hardware {
  //Members all hardware must have
  public id: number;
  public _name: string;
  public debug: boolean;

  //assign name and id to each object
  constructor(hardwareID: number, hardwareName: string, debug: boolean) {
    this.id = hardwareID;
    this._name = hardwareName;
    this.debug = debug;

    this.log(this, colors.green(`Created hardware ${hardwareName}`));
  }

  /** Print a log statement with the hardware and a personal message
   * @param hardware the current class the log is being called from
   * @param message string message to be outputted to terminal
   */
  public log(hardware: Hardware, message: string): void {
    let timeStamp = new Date().valueOf(); //local time and date

    console.log(
      `[HW: ${hardware._name} ID: ${hardware.id} @ ${timeStamp}] ${message}`
    );
  }

  /** Quick way to report errors to terminal
   * @param hardware hardware object
   * @param message custom messege to alert terminal
   */
  public errorLog(hardware: Hardware, message: string): void {
    console.log(colors.red.bold(`Error [HW: ${hardware._name}] ${message}`));
  }
}
