/** Require pulse for all clockListners
 * - This allows all specified clocklisteners to have their own implementation of ```pulse();```
 * - The pulse method will be called to correctly time operations.
 */
export interface ClockListener {
  /** Notify all clock attached hardware when a pulse occurs */
  pulse(): void;
}
