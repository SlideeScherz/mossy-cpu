"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASCII = void 0;
var colors = require("../../node_modules/colors/lib/index");
/** Class to decode from Hex to Character and back
 * -Must also be static so we do not create an Alias
 */
class ASCII {
    constructor() {
        ASCII.setMap();
        console.log(colors.green("[Utility: ASCII] Created ASCII map. Elements: " + ASCII.ASCIIMap.size));
    }
    /** Create a map with ASCII characters and their corresponding hex code
     * - Used excel to concatenate a table i found
     * - ref: https://www.lookuptables.com/text/ASCII-table
     */
    static setMap() {
        this.ASCIIMap.set(0x0, "NUL");
        this.ASCIIMap.set(0x1, "SOH");
        this.ASCIIMap.set(0x2, "STX");
        this.ASCIIMap.set(0x3, "ETX");
        this.ASCIIMap.set(0x4, "EOT");
        this.ASCIIMap.set(0x5, "ENQ");
        this.ASCIIMap.set(0x6, "ACK");
        this.ASCIIMap.set(0x7, "BEL");
        this.ASCIIMap.set(0x8, "BS");
        this.ASCIIMap.set(0x9, "HT");
        this.ASCIIMap.set(0x0a, "LF");
        this.ASCIIMap.set(0x0b, "VT");
        this.ASCIIMap.set(0x0c, "FF");
        this.ASCIIMap.set(0x0d, "CR");
        this.ASCIIMap.set(0x0e, "SO");
        this.ASCIIMap.set(0x0f, "SI");
        this.ASCIIMap.set(0x10, "DLE");
        this.ASCIIMap.set(0x11, "DC1");
        this.ASCIIMap.set(0x12, "DC2");
        this.ASCIIMap.set(0x13, "DC3");
        this.ASCIIMap.set(0x14, "DC4");
        this.ASCIIMap.set(0x15, "NAK");
        this.ASCIIMap.set(0x16, "SYN");
        this.ASCIIMap.set(0x17, "ETB");
        this.ASCIIMap.set(0x18, "CAN");
        this.ASCIIMap.set(0x19, "EM");
        this.ASCIIMap.set(0x1a, "SUB");
        this.ASCIIMap.set(0x1b, "ESC");
        this.ASCIIMap.set(0x1c, "FS");
        this.ASCIIMap.set(0x1d, "GS");
        this.ASCIIMap.set(0x1e, "RS");
        this.ASCIIMap.set(0x1f, "US");
        this.ASCIIMap.set(0x20, " "); //Space
        this.ASCIIMap.set(0x21, "!");
        this.ASCIIMap.set(0x22, '"');
        this.ASCIIMap.set(0x23, "#");
        this.ASCIIMap.set(0x24, "$");
        this.ASCIIMap.set(0x25, "%");
        this.ASCIIMap.set(0x26, "&");
        this.ASCIIMap.set(0x27, "'");
        this.ASCIIMap.set(0x28, "(");
        this.ASCIIMap.set(0x29, ")");
        this.ASCIIMap.set(0x2a, "*");
        this.ASCIIMap.set(0x2b, "+");
        this.ASCIIMap.set(0x2c, ",");
        this.ASCIIMap.set(0x2d, "-");
        this.ASCIIMap.set(0x2e, ".");
        this.ASCIIMap.set(0x2f, "/");
        this.ASCIIMap.set(0x30, "0");
        this.ASCIIMap.set(0x31, "1");
        this.ASCIIMap.set(0x32, "2");
        this.ASCIIMap.set(0x33, "3");
        this.ASCIIMap.set(0x34, "4");
        this.ASCIIMap.set(0x35, "5");
        this.ASCIIMap.set(0x36, "6");
        this.ASCIIMap.set(0x37, "7");
        this.ASCIIMap.set(0x38, "8");
        this.ASCIIMap.set(0x39, "9");
        this.ASCIIMap.set(0x3a, ":");
        this.ASCIIMap.set(0x3b, ";");
        this.ASCIIMap.set(0x3c, "<");
        this.ASCIIMap.set(0x3d, "=");
        this.ASCIIMap.set(0x3e, ">");
        this.ASCIIMap.set(0x3f, "?");
        this.ASCIIMap.set(0x40, "@");
        this.ASCIIMap.set(0x41, "A");
        this.ASCIIMap.set(0x42, "B");
        this.ASCIIMap.set(0x43, "C");
        this.ASCIIMap.set(0x44, "D");
        this.ASCIIMap.set(0x45, "E");
        this.ASCIIMap.set(0x46, "F");
        this.ASCIIMap.set(0x47, "G");
        this.ASCIIMap.set(0x48, "H");
        this.ASCIIMap.set(0x49, "I");
        this.ASCIIMap.set(0x4a, "J");
        this.ASCIIMap.set(0x4b, "K");
        this.ASCIIMap.set(0x4c, "L");
        this.ASCIIMap.set(0x4d, "M");
        this.ASCIIMap.set(0x4e, "N");
        this.ASCIIMap.set(0x4f, "O");
        this.ASCIIMap.set(0x50, "P");
        this.ASCIIMap.set(0x51, "Q");
        this.ASCIIMap.set(0x52, "R");
        this.ASCIIMap.set(0x53, "S");
        this.ASCIIMap.set(0x54, "T");
        this.ASCIIMap.set(0x55, "U");
        this.ASCIIMap.set(0x56, "V");
        this.ASCIIMap.set(0x57, "W");
        this.ASCIIMap.set(0x58, "X");
        this.ASCIIMap.set(0x59, "Y");
        this.ASCIIMap.set(0x5a, "Z");
        this.ASCIIMap.set(0x5b, "[");
        this.ASCIIMap.set(0x5c, "\\"); //check
        this.ASCIIMap.set(0x5d, "]");
        this.ASCIIMap.set(0x5e, "^");
        this.ASCIIMap.set(0x5f, "_");
        this.ASCIIMap.set(0x60, "`");
        this.ASCIIMap.set(0x61, "a");
        this.ASCIIMap.set(0x62, "b");
        this.ASCIIMap.set(0x63, "c");
        this.ASCIIMap.set(0x64, "d");
        this.ASCIIMap.set(0x65, "e");
        this.ASCIIMap.set(0x66, "f");
        this.ASCIIMap.set(0x67, "g");
        this.ASCIIMap.set(0x68, "h");
        this.ASCIIMap.set(0x69, "i");
        this.ASCIIMap.set(0x6a, "j");
        this.ASCIIMap.set(0x6b, "k");
        this.ASCIIMap.set(0x6c, "l");
        this.ASCIIMap.set(0x6d, "m");
        this.ASCIIMap.set(0x6e, "n");
        this.ASCIIMap.set(0x6f, "o");
        this.ASCIIMap.set(0x70, "p");
        this.ASCIIMap.set(0x71, "q");
        this.ASCIIMap.set(0x72, "r");
        this.ASCIIMap.set(0x73, "s");
        this.ASCIIMap.set(0x74, "t");
        this.ASCIIMap.set(0x75, "u");
        this.ASCIIMap.set(0x76, "v");
        this.ASCIIMap.set(0x77, "w");
        this.ASCIIMap.set(0x78, "x");
        this.ASCIIMap.set(0x79, "y");
        this.ASCIIMap.set(0x7a, "z");
        this.ASCIIMap.set(0x7b, "{");
        this.ASCIIMap.set(0x7c, "|");
        this.ASCIIMap.set(0x7d, "}");
        this.ASCIIMap.set(0x7e, "~");
        this.ASCIIMap.set(0x7f, "DEL");
    }
    /** Use to take memory and covert it to screen in SYS call
     * - Pass in a hexcode and receive its string hex
     * - Lookup time O(1)
     * @param key Hex number to parse map
     * @returns string character
     */
    static getChar(key) {
        for (let element of this.ASCIIMap.entries()) {
            //once the key matches return its key value
            if (element[0] == key) {
                return element[1];
            }
        }
    }
    /** Send input to memory
     * - Utilized in ```Keyboard.ts```
     * - Enter a string character and get its hex Code
     * - Lookup time O(1)
     * @param charcter String character to return its hex value
     * @returns Hexcode
     */
    static getHex(charcter) {
        for (let element of this.ASCIIMap.entries()) {
            //once the key matches return its key value
            if (element[1] == charcter) {
                return element[0];
            }
        }
    }
}
exports.ASCII = ASCII;
//hashmap to quickly sort and return ASCII codes, and its hex value
ASCII.ASCIIMap = new Map();
//# sourceMappingURL=ascii.js.map