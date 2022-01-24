import { Hardware } from "./Hardware";
import { ClockListener } from "./imp/ClockListener";
import { MMU } from "./MMU";
import { Interupt } from "./imp/interupt";
import { ASCII } from "../utility/ascii";
import { System } from "../System";
import { op } from "../utility/opCode";

var colors = require("../../node_modules/colors/lib/index");

/**For access to non-static MMU Methods*/
const MMU_CPU = new MMU(1, "MMU / CPU", false);
const ascii = new ASCII(); //Unread, but do not delete

/** The powerhouse */
export class Cpu extends Hardware implements ClockListener, Interupt {
  //Interupt members
  public IRQNum: number = 0;
  public inputBuffer: number[] = [];
  public outputBuffer: number[] = [];
  public IRQname: string = "CPU Interupt";

  /**The clock cycles the CPU has executed */
  public cpuClockCount: number = 0;

  //CPU Registers

  /**Program Counter */
  private pc: number = 0x0000;
  /**Stack Pointer. Used hold pointers for 2 byte Operations */
  private sp: number = 0x0000;
  /**Instruction Register. Holds the Op Code for the current instruction  */
  private ir: number = 0x00;
  /**X register */
  private xReg: number = 0x00;
  /**Y Register */
  private yReg: number = 0x00;
  /**Status register
   * - 0: carry flag
   * - 1: zero flag
   * - 2: interupt mask
   * - 3: decimal flag (not used)
   * - 4: break flag
   * - 5: no name and always set to 1
   * - 6: overflow flag
   * - 7: Negative flag
   */
  private sReg: number = null;
  /**Accumulator */
  private acc: number = 0x00;
  /**Step. Holds the data used for pipeline logic */
  private step: number = 0;

  //=====Logical and debugging members=====//

  /** Array to store pipelineLog attributes, updated each pulse */
  private pipelineLog: any = [];
  /** Status of operation. Still running = true */
  private OpComplete: boolean = false;

  //we have to use hardwareName becuase name is a built in typscript thing
  constructor(hardwareID: number, hardwareName: string, debug: boolean) {
    super(hardwareID, hardwareName, debug);

    this.restartPipeline();
    this.log(this, colors.green("Pipeline initiated and reset"));
  }

  //========== CPU Methods ==========//

  /** Get hexadecimal 2’s complement
   * - Subtract the number from FF
   * - Add 1
   * @param data Number you wish to get 2's Comp of
   * @returns offset value
   */
  private getOffset(data: number): number {
    return 0xff - data + 1;
  }

  /** Log the CPU Pipeline steps */
  private writePipeLineLog(): void {
    //data we want to store
    let pipelineState: any = {
      Cycle: this.cpuClockCount,
      PC: MMU_CPU.hexLog(this.pc, 2),
      SP: MMU_CPU.hexLog(this.sp, 2),
      IR: MMU_CPU.hexLog(this.ir, 1),
      byte1: MMU_CPU.hexLog(MMU.decodedByte1, 1),
      byte2: MMU_CPU.hexLog(MMU.decodedByte2, 1),
      ACC: MMU_CPU.hexLog(this.acc, 1),
      xReg: MMU_CPU.hexLog(this.xReg, 1),
      YReg: MMU_CPU.hexLog(this.yReg, 1),
      sReg: MMU_CPU.hexLog(this.sReg, 1),
      Step: this.step,
    };

    this.pipelineLog.push(pipelineState);
  }

  /**Logic based off sReg
   * - Handles errors, overflow and other sReg commands
   */
  private getStatus(): void {
    switch (this.sReg) {
      case null:
        //pass. no work to do
        break;
      case 0:
        this.log(this, "Carry Flag thrown");
        break;
      case 1:
        this.log(this, "Zero Flag thrown");
        break;
      case 2:
        this.log(this, "Interupt Recd.");
        break;
      case 3:
        this.log(this, "Decimal Flag thrown");
        break;
      case 4:
        this.log(this, "Brk Flag thrown. Shutting down");
        System.stopSystem();
        break;
      case 5:
        this.log(this, "sReg bit 5 coming in a later release");
        break;
      case 6:
        this.errorLog(this, `Warning! Overflow`);
        break;
      case 7:
        this.errorLog(this, `Warning, Negative flag`);
        break;
      default:
        this.errorLog(this, "Cannot read sReg");
        break;
    }
  }

  /**Logic based off sReg
   * - Handles errors, overflow and other sReg commands
   */
  private monitorRegisters(): void {
    /**Array of 16 bit registers to quickly evaluate in sReg*/
    let twoByteRegArr: number[] = [this.pc, this.sp];

    /**Array of 8 bit registers to quickly evaluate in sReg*/
    let oneByteRegArr: number[] = [this.ir, this.xReg, this.yReg];

    /**All CPU and MMU Registers */
    let allRegArr: number[] = twoByteRegArr.concat(oneByteRegArr);

    //check all registers and make sure they are within bounds
    oneByteRegArr.forEach((reg) => {
      if (reg > 0xff) {
        this.sReg = 6;
      }
    });

    //check all registers and make sure they are within bounds
    twoByteRegArr.forEach((reg) => {
      if (reg > 0xffff) {
        this.sReg = 6;
      }
    });

    allRegArr.forEach((reg) => {
      if (reg < 0) {
        this.sReg = 7;
      }
    });
  }

  /** Get next opCode instruction.
   * - Always step 1.
   * - Uses the Program counter to select memory location.
   * - Before reading, INC the program counter.
   */
  private fetch(): void {
    //only skip on the first execution
    if (this.cpuClockCount > 1) {
      this.pc++;
    }

    //Set the IR to the current data at the address in the PC
    this.ir = MMU_CPU.read(this.pc);

    //if (this.debug) console.time(`Running ${MMU_CPU.hexLog(this.ir, 1)}`);
  }

  /** Decode the operands for an instruction
   * @param operands how many operands the opcode has (0-2)
   * @param register data (register) to read from if operands is 0
   */
  private decode(operands: number, data?: number): void {
    //one byte decode
    if (operands === 0) {
      data == undefined
        ? this.errorLog(this, "Provide data in decode")
        : (MMU.decodedByte1 = data);
    }

    //one byte decode
    else if (operands === 1) {
      this.pc++;
      MMU.decodedByte1 = MMU_CPU.read(this.pc);
    }

    //two byte decode
    else if (operands === 2) {
      this.pc++;
      if (MMU.decodedByte1 === null) {
        MMU.decodedByte1 = MMU_CPU.read(this.pc);
      } else {
        MMU.decodedByte2 = MMU_CPU.read(this.pc);

        //Set the Stack Pointer with 16 bit data address
        this.sp = MMU_CPU.createPointer(MMU.decodedByte1, MMU.decodedByte2);
      }
    }
  }

  /** Check for IRQ Requests, Sets OpComplete to true */
  private checkInterrupt(): void {
    if (this.inputBuffer.length !== 0) this.sReg = 2;

    //end the pipeline and restart, or handle interupt
    this.OpComplete = true;

    //if (this.debug) console.timeEnd(`Running ${MMU_CPU.hexLog(this.ir, 1)}`);
  }

  /** resets pipeline Logic for when a operation is done*/
  private restartPipeline(): void {
    //Re initialize all members
    this.step = 0;
    this.OpComplete = false;

    //Initiate these with null for decode logic
    MMU.decodedByte1 = null;
    MMU.decodedByte2 = null;
  }

  /** Load the accumulator with a constant */
  private LDA(): void {
    switch (this.step) {
      case 2:
        this.decode(1);
        break;

      case 3:
        this.acc = MMU.decodedByte1;
        break;

      case 4:
        this.checkInterrupt();
        break;

      default:
        this.errorLog(this, "Error in LDA");
        break;
    }
  }

  /**Load the accumulator from memory */
  private LDA_Mem(): void {
    switch (this.step) {
      case 2:
        this.decode(2);
        break;

      case 3:
        this.decode(2);
        break;

      //Load ACC from stack pointer
      case 4:
        this.acc = MMU_CPU.read(this.sp);
        break;

      case 5:
        this.checkInterrupt();
        break;

      default:
        this.errorLog(this, "Error in LDA_Mem");
        break;
    }
  }

  /** store the ACC In memory at pointer address */
  private STA(): void {
    switch (this.step) {
      case 2:
        this.decode(2);
        break;

      case 3:
        this.decode(2);
        break;

      //store ACC at stack pointer addr
      case 4:
        MMU_CPU.write(this.sp, this.acc);
        break;

      case 5:
        this.checkInterrupt();
        break;

      default:
        this.errorLog(this, "Error in STA");
        break;
    }
  }

  /**Load ACC From xReg */
  private TXA(): void {
    switch (this.step) {
      case 2:
        this.decode(0, this.xReg);
        break;

      case 3:
        this.acc = MMU.decodedByte1;
        break;

      case 4:
        this.checkInterrupt();
        break;

      default:
        this.errorLog(this, "Error in TXA");
        break;
    }
  }

  /**Load ACC From yReg */
  private TYA(): void {
    switch (this.step) {
      case 2:
        this.decode(0, this.yReg);
        break;

      case 3:
        this.acc = MMU.decodedByte1;
        break;

      case 4:
        this.checkInterrupt();
        break;

      default:
        this.errorLog(this, "Error in TYA");
        break;
    }
  }

  /** Add with carry */
  private ADC(): void {
    switch (this.step) {
      case 2:
        this.decode(2);
        break;

      case 3:
        this.decode(2);
        break;

      case 4:
        this.acc = MMU_CPU.read(this.sp) + this.acc;
        break;

      case 5:
        this.checkInterrupt();
        break;

      default:
        this.errorLog(this, "Error in ADC");
        break;
    }
  }

  /** Load xReg from constant */
  private LDX(): void {
    switch (this.step) {
      case 2:
        this.decode(1);
        break;

      case 3:
        this.xReg = MMU.decodedByte1;
        break;

      case 4:
        this.checkInterrupt();
        break;

      default:
        this.errorLog(this, "Error in LDX");
        break;
    }
  }

  /** Load xReg from memory */
  private LDX_Mem(): void {
    switch (this.step) {
      case 2:
        this.decode(2);
        break;

      case 3:
        this.decode(2);
        break;

      case 4:
        this.xReg = MMU_CPU.read(this.sp);
        break;

      case 5:
        this.checkInterrupt();
        break;

      default:
        this.errorLog(this, "Error in LDX_Mem");
        break;
    }
  }

  /** Load xRegister from Acc */
  private TAX(): void {
    switch (this.step) {
      case 2:
        this.decode(0, this.acc);
        break;

      case 3:
        this.xReg = MMU.decodedByte1;
        break;

      case 4:
        this.checkInterrupt();
        break;

      default:
        this.errorLog(this, "Error in TAX");
        break;
    }
  }

  /** Load yReg from constant */
  private LDY(): void {
    switch (this.step) {
      case 2:
        this.decode(1);
        break;

      case 3:
        this.yReg = MMU.decodedByte1;
        break;

      case 4:
        this.checkInterrupt();
        break;

      default:
        this.errorLog(this, "Error in LDY");
        break;
    }
  }

  /** Load yRegister from memory addr */
  private LDY_Mem(): void {
    switch (this.step) {
      case 2:
        this.decode(2);
        break;

      case 3:
        this.decode(2);
        break;

      case 4:
        this.yReg = MMU_CPU.read(this.sp);
        break;

      case 5:
        this.checkInterrupt();
        break;

      default:
        this.errorLog(this, "Error in LDY_Mem");
        break;
    }
  }

  /** Load yReg from Accumulator */
  private TAY(): void {
    switch (this.step) {
      case 2:
        this.decode(0, this.acc);
        break;

      case 3:
        this.yReg = MMU.decodedByte1;
        break;

      case 4:
        this.checkInterrupt();
        break;

      default:
        this.errorLog(this, "Error in TAY");
        break;
    }
  }

  /** No Operation */
  private NOP(): void {
    switch (this.step) {
      case 2:
        break;

      case 3:
        this.checkInterrupt();
        break;

      default:
        this.errorLog(this, "Error in NOP");
        break;
    }
  }

  /** Coffee anyone? */
  private BRK(): void {
    switch (this.step) {
      case 2:
        //execute
        this.sReg = 4;
        break;

      case 3:
        this.checkInterrupt();
        break;

      default:
        this.errorLog(this, "Error in BRK");
        break;
    }
  }

  /** Compare x to a byte in memory, set zFLag if equal */
  private CPX(): void {
    switch (this.step) {
      case 2:
        this.decode(2);
        break;

      case 3:
        this.decode(2);
        break;

      case 4:
        if (this.xReg === MMU_CPU.read(this.sp)) {
          this.sReg = 1; //set zFlag
        }
        break;

      case 5:
        this.checkInterrupt();
        break;

      default:
        this.errorLog(this, "Error in CPX");
        break;
    }
  }

  /** branch n Bytes if zflag is set */
  private BNE(): void {
    switch (this.step) {
      case 2:
        this.decode(1);
        break;

      case 3:
        if (this.sReg !== 1) {
          let offset = this.getOffset(MMU.decodedByte1);
          this.pc -= offset;
        }

        break;

      case 4:
        this.checkInterrupt();
        break;

      default:
        this.errorLog(this, "Error in BNE");
        break;
    }
  }

  /** Increment the value of a byte */
  private INC(): void {
    switch (this.step) {
      case 2:
        this.decode(2);
        break;

      case 3:
        this.decode(2);
        break;

      case 4:
        this.acc = MMU_CPU.read(this.sp);
        break;

      case 5:
        this.acc++;
        break;

      case 6:
        MMU_CPU.write(this.sp, this.acc);
        break;

      case 7:
        this.checkInterrupt();
        break;

      default:
        this.errorLog(this, "Error in INC");
        break;
    }
  }

  /** Sys call */
  private SYS(): void {
    switch (this.step) {
      case 2:
        if (this.xReg === 1 || this.xReg === 2) {
          MMU.decodedByte1 = this.yReg;
        } else if (this.xReg === 3) {
          this.errorLog(this, "SYS 3 will be coming in a later release");
        }

        break;

      case 3:
        if (this.xReg === 1) {
          process.stdout.write(this.yReg.toString());
        } else if (this.xReg === 2) {
          let data = ASCII.getChar(MMU.decodedByte1);
          process.stdout.write("" + data); //must concat with a string or error will ensue
        }

        break;

      case 4:
        this.checkInterrupt();
        break;

      default:
        this.errorLog(this, "Error in SYS");
    }
  }

  /**Implements all CPU methods for better better logic flow */
  private runPipeline(): void {
    //Always step 1. Fetch the opcode
    if (this.step === 1) {
      this.fetch();
      this.writePipeLineLog(); //Skip the block below, but we still want to write to the log
      return;
    }

    //Read the IR, end execute the correct step for each OpCode
    switch (this.ir) {
      case op.LDA:
        this.LDA();
        break;

      case op.LDA_Mem:
        this.LDA_Mem();
        break;

      case op.STA:
        this.STA();
        break;

      case op.TXA:
        this.TXA();
        break;

      case op.TYA:
        this.TYA();
        break;

      case op.ADC:
        this.ADC();
        break;

      case op.LDX:
        this.LDX();
        break;

      case op.LDX_Mem:
        this.LDX_Mem();
        break;

      case op.TAX:
        this.TAX();
        break;

      case op.LDY:
        this.LDY();
        break;

      case op.LDY_Mem:
        this.LDY_Mem();
        break;

      case op.TAY:
        this.TAY();
        break;

      case op.NOP:
        this.NOP();
        break;

      case op.BRK:
        this.BRK();
        break;

      case op.CPX:
        this.CPX();
        break;

      case op.BNE:
        this.BNE();
        break;

      case op.INC:
        this.INC();
        break;

      case op.SYS:
        this.SYS();
        break;

      default:
        this.errorLog(this, `Illegal value in IR: ${this.ir.toString(16)}`);
        this.errorLog(this, `Forcing Shutdown`);
        this.sReg = 4; //throw breakflag
        break;
    }
  }

  /** Called each clock pulse From Interface ```clockListener```
   * - Simulate CPU Pipeline
   */
  pulse(): void {
    //see the initial state of the CPU
    if (this.cpuClockCount === 0) console.log(colors.blue.bold("Output: "));

    //increment for each pulse
    this.cpuClockCount++;
    this.step++;

    //handle instructions
    this.runPipeline();

    //set sReg is any issues detected
    this.monitorRegisters();

    //check CPU status
    this.getStatus();

    //Write to the pipeline log after each pulse
    this.writePipeLineLog();

    //Restart Pipline process after logic is set to completed
    if (this.OpComplete) this.restartPipeline();
  }
}
