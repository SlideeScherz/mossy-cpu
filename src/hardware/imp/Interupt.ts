/** Interface that forces all imterupt members to declare required vars for interupt routine */
export interface Interupt {
  /** The priority of the interrupt */
  IRQNum: number;
  /** Input buffer.
   * - Optional. Examples which may not need are Keyboard
   */
  inputBuffer?: number[];
  /** Output buffer */
  outputBuffer: number[];
  /** Interupt name. Should be different from the name of the hardware */
  IRQname: string;
}
