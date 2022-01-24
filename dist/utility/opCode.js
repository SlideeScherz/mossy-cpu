"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.op = void 0;
/**Legal Operation Codes */
var op;
(function (op) {
    op[op["LDA"] = 169] = "LDA";
    op[op["STA"] = 141] = "STA";
    op[op["TXA"] = 138] = "TXA";
    op[op["TYA"] = 152] = "TYA";
    op[op["INC"] = 238] = "INC";
    op[op["SYS"] = 255] = "SYS";
    op[op["ADC"] = 109] = "ADC";
    op[op["LDX"] = 162] = "LDX";
    op[op["TAX"] = 170] = "TAX";
    op[op["BNE"] = 208] = "BNE";
    op[op["LDY"] = 160] = "LDY";
    op[op["TAY"] = 168] = "TAY";
    op[op["NOP"] = 234] = "NOP";
    op[op["BRK"] = 0] = "BRK";
    op[op["CPX"] = 236] = "CPX";
    op[op["LDX_Mem"] = 174] = "LDX_Mem";
    op[op["LDY_Mem"] = 172] = "LDY_Mem";
    op[op["LDA_Mem"] = 173] = "LDA_Mem";
})(op = exports.op || (exports.op = {}));
//# sourceMappingURL=opCode.js.map