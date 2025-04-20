const { stdin, stdout } = require('node:process');

const SEQUENCE = {
    ESC: '\x1b', // ^[
    CSI: '\x9b', // ^[[
    DCS: '\x90', // ^[P
    OSC: '\x9d', // ^[]
    BEL: '\x07',
    DEL: '\x7f',
};

/**
 * options for calling VT100.SGR()
 * 
 * NOTE: not all values work with all terminals
 * @example
 * // Set italic red font
 * let vtWriter = new VT100();
 * vtWriter().SGR([SGR.ITALICS,SGR.FOREGROUND_RED]).write();
 * console.log('this text shuold be red and italic');
 * 
 * // reset the text
 * vtWriter().SGR([SGR.DEFAULT]).write();
 * console.log('this text should not have any formatting now');
 */
const SGR = {
    /** Rests all attributes to default */
    DEFAULT: 0,
    /** Apply brightness/intensity flag to foreground color */
    BOLD: 1,
    /** Lowers brightness of foreground color */
    DIM: 2,
    /** Add italics formatting */
    ITALICS: 3,
    /** Add underline formatting */
    UNDERLINE: 4,
    /** Makes foreground blink (not widely supported) */
    BLINKING: 5,
    /** Reverses background and foreground colors. (Use POSITIVE to restore) */
    NEGATIVE: 7,
    /** Makes text hidden */
    HIDDEN: 8,
    /** Add strikethrough formatting */
    STRIKETHROUGH: 9,
    /** Add double underline formatting (not widely supported) */
    DOUBLE_UNDERLINE: 21,
    /** Remove BOLD formatting */
    BOLD_RESET: 22,
    /** Remove DIM foramtting */
    DIM_RESET: 22,
    /** Remove ITALIC formatting */
    ITALIC_RESET: 23,
    /** Remove UNDERLINE and DOUBLE_UNDERLINE formatting */
    UNDERLINE_RESET: 24,
    /** Remove BLINKING formatting */
    BLINKING_RESET: 25,
    /** Remove NEGATIVE formatting */
    POSITIVE: 27,
    /** Remove HIDDEN formatting */
    HIDDEN_RESET: 28,
    /** Remove STRIKETHROUGH formatting */
    STRIKETHROUGH_RESET: 29,
    /** Set font color */
    FOREGROUND_BLACK: 30,
    /** Set font color */
    FOREGROUND_RED: 31,
    /** Set font color */
    FOREGROUND_GREEN: 32,
    /** Set font color */
    FOREGROUND_YELLOW: 33,
    /** Set font color */
    FOREGROUND_BLUE: 34,
    /** Set font color */
    FOREGROUND_MAGENTA: 35,
    /** Set font color */
    FOREGROUND_CYAN: 36,
    /** Set font color */
    FOREGROUND_WHITE: 37,
    /** Allows for setting a wider range of colors
     *  EXTENDED_RGB or EXTENDED_256 must follow the use of this option
     * @see SGR.EXTENDED_RGB and 
     * @see SGR.EXTENDED_256 for details on how to use them
     */
    FOREGROUND_EXTENDED: 38,
    /** Set font to the default terminal color */
    FOREGROUND_DEFAULT: 39,
    /** Set background color */
    BACKGROUND_BLACK: 40,
    /** Set background color */
    BACKGROUND_RED: 41,
    /** Set background color */
    BACKGROUND_GREEN: 42,
    /** Set background color */
    BACKGROUND_YELLOW: 43,
    /** Set background color */
    BACKGROUND_BLUE: 44,
    /** Set background color */
    BACKGROUND_MAGENTA: 45,
    /** Set background color */
    BACKGROUND_CYAN: 46,
    /** Set background color */
    BACKGROUND_WHITE: 47,
    /** Allows for setting a wider range of colors
     *  EXTENDED_RGB or EXTENDED_256 must follow the use of this option
     * @see SGR.EXTENDED_RGB and
     * @see SGR.EXTENDED_256 for details on how to use them
     */
    BACKGROUND_EXTENDED: 48,
    /** Set background to the default terminal color */
    BACKGROUND_DEFAULT: 49,
    /**
     * Sets color mode to truecolor (Not all terminals support this)
     * Accepts r,g,b values to set the font/background color
     * @example
     * let vtWriter = new VT100();
     * vtWriter.SGR([SGR.FOREGROUND_EXTENDED, SGR.EXTENDED_RGB,0,255,255]); // Set font color to Cyan
     */
    EXTENDED_RGB: 2,
    /**
     * Sets color mode to 256 (Not all terminals support this)
     * Accepts a value from 0-255 to set the font/background color
     * @link {@see https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit} for table reference
     * @example
     * let vtWriter = new VT100();
     * vtWriter.SGR([SGR.FOREGROUND_EXTENDED, SGR.EXTENDED_256,51]); // Set font color to Cyan
     */
    EXTENDED_256: 5

};

const DECSET = {
    SHOW_CURSOR: 25,
    USE_ALT_BUFFER: 1049,
    SAVE_SCREEN: 47,
};

/**
 * Specify character set for VT100.CHARSET()
 */
const CHARSET = {
    US_ASCII: 'B',
    LINE: '0',
};

/**
 * Class for writing ANSI control sequences to stdout.
 * 
 * Note: Not all functions will work with all terminals.
 */
class VT100 {
    #output = '';
    constructor() { }

    /**
     * CURSOR UP
     * 
     * Move cursor up N lines, default is 1
     * @param {number} lines Number of lines to move cursor
     * @returns {this}
     */
    CUU(lines = 1) {
        this.#output += `${SEQUENCE.CSI}${line}'A'`;
        return this;
    }

    /**
     * CURSOR DOWN
     * 
     * Move cursor down N lines, default is 1
     * @param {number} lines  Number of lines to move cursor
     * @returns {this}
     */
    CUD(lines = 1) {
        this.#output += `${SEQUENCE.CSI}${line}'B'`;
        return this;
    }

    /**
     * CURSOR FORWARD
     * 
     * Move cursor right N columns, default is 1
     * @param {number} columns  Number of lines to move cursor
     * @returns {this}
     */
    CUF(columns = 1) {
        this.#output += `${SEQUENCE.CSI}${line}'C'`;
        return this.#output;
    }

    /**
     * CURSOR BACKWARD
     * 
     * Move cursor left N columns, default is 1
     * @param {number} columns  Number of lines to move cursor
     * @returns {this}
     */
    CUB(columns = 1) {
        this.#output += `${SEQUENCE.CSI}${line}'D'`;
        return this.#output;
    }

    /**
     * CURSOR NEXT LINE
     * 
     * Move cursor to the beginning of the line, down N lines, default is 1
     * @param {number} lines Number of lines to move cursor
     * @returns {this}
     */
    CNL(lines = 1) {
        this.#output += `${SEQUENCE.CSI}${line}'E'`;
        return this.#output;
    }

    /**
     * CURSOR PREVIOUS LINE
     * 
     * Move cursor to the beginning of the line, up N lines, default is 1
     * @param {number} lines Number of lines to move cursor
     * @returns {this}
     */
    CPL(lines = 1) {
        this.#output += `${SEQUENCE.CSI}${line}'E'`;
        return this.#output;
    }

    /**
     * CURSOR POSITION
     * 
     * MOVE CURSOR TO ROW,COLUMN
     * @param {number} row The row to move to
     * @param {number} column The column to move to
     * @returns {this}
     */
    CUP(row, column) {
        this.#output += `${SEQUENCE.CSI}${row};${column}H`;
        return this;
    }

    /**
     * ERASE IN DISPLAY
     * 
     * mode 0 = current position to end of display
     * 
     * mode 1 = beginning of display to position
     * 
     * mode 2 = full display
     * 
     * Will default to 2 if provided mode is not valid
     * @param {number} mode 
     * @returns {this}
     */
    ED(mode) {
        if (mode < 0 || mode > 2) mode = 2;
        this.#output += `${SEQUENCE.CSI}${mode}J`;
        return this;
    }

    /**
     * ERASE IN LINE
     * 
     * mode 0 = current position to end of line
     * 
     * mode 1 = beginning of line to position
     * 
     * mode 2 = full line
     * 
     * Will default to 2 if provided mode is not valid
     * @param {number} mode 
     * @returns {this}
     */
    EK(mode) {
        if (mode < 0 || mode > 2) mode = 2;
        this.#output += `${SEQUENCE.CSI}${mode}K`;
        return this;
    }

    /**
     * SCROLL UP
     * 
     * Scroll text up by N. New lines fill from bottom
     * @param {number} lines number of lines to scroll
     * @returns {this}
     */
    SU(lines = 1) {
        this.#output += `${SEQUENCE.CSI}${lines}S`;
        return this;
    }

    /**
     * SCROLL DOWN
     * 
     * Scroll text down by N. New lines fill from top
     * @param {number} lines number of lines to scroll
     * @returns {this}
     */
    SD(lines = 1) {
        this.#output += `${SEQUENCE.CSI}${lines}T`;
        return this;
    }

    /**
     * INSERT CHARACTER
     * 
     * Insert N spaces at current position, shifts existing text to the right
     * @param {number} spaces number of spaces to insert
     * @returns {this}
     */
    ICH(spaces = 1) {
        this.#output += `${SEQUENCE.CSI}${spaces}@`;
        return this;
    }

    /**
     * DELETE CHARACTER
     * 
     * Delete N characters at current position, shifting space characters in from right edge
     * @param {number} spaces number of spaces to delete
     * @returns {this}
     */
    DCH(spaces = 1) {
        this.#output += `${SEQUENCE.CSI}${spaces}P`;
        return this;
    }

    /**
     * ERASE CHARACTER
     * 
     * Overwrite N characters from current position with a space character
     * @param {number} spaces number of spaces to overwrite
     * @returns {this}
     */
    ECH(spaces = 1) {
        this.#output += `${SEQUENCE.CSI}${spaces}X`;
        return this
    }

    /**
     * INSERT LINES
     * 
     * Insert N lines at current position
     * @param {number} lines 
     * @returns 
     */
    IL(lines = 1) {
        this.#output += `${SEQUENCE.CSI}${lines}L`;
        return this;
    }

    /**
     * DELETE LINES
     * 
     * Delete N lines at current position
     * @param {number} lines 
     * @returns 
     */
    DL(lines = 1) {
        this.#output += `${SEQUENCE.CSI}${lines}M`;
        return this;
    }

    /**
     * SET GRAPHICS RENDITION
     * 
     * Set format of screen and text 
     * @param {number[]} params 
     * @returns {this}
     */
    SGR(params) {
        this.#output += `${SEQUENCE.CSI}${params.join(';')}m`
        return this;
    }

    /**
     * SAVE CURSOR
     * 
     * Save cursor position in memory
     * @returns {this}
     */
    DECSC() {
        this.#output += `${SEQUENCE.ESC}7`;
        return this;
    }

    /**
     * RESTORE CURSOR
     * 
     * Restore cursor position from memory
     * @returns {this}
     */
    DECSR() {
        this.#output += `${SEQUENCE.ESC}8`;
        return this;
    }

    /**
     * REQUEST CURSOR POSITION
     * 
     * Retrieves the cursor's current position in the terminal as {row,column}
     * 
     * Unlike other functions, this sequence returns a value.
     * As such this will immediately write to stdout and return the parsed response as {row, column} object
     * @returns {Promise<{row: number, column: number}>}
     */
    GETPOS() {
        // anyway to do this syncronously?
        return new Promise((resolve, reject) => {
            stdin.setRawMode(true);
            stdin.resume();
            stdin.once('data', (data) => {
                stdin.setRawMode(false);
                stdin.pause();
                const match = data.toString().match(/\[(\d+);(\d+)R/);
                if (match) {
                    const row = parseInt(match[1], 10);
                    const column = parseInt(match[2], 10);
                    resolve({ row, column });
                } else {
                    reject(new Error('Could not parse cursor postion'));
                }
            });
            stdout.write(`${SEQUENCE.CSI}6n`);
        });
    }

    /**
     * DEC PRIVATE MODE SET
     * 
     * Set various private mode functions
     * @see DECSET for options
     * @param {number} mode 
     * @returns 
     */
    DECSET(mode) {
        this.#output += `${SEQUENCE.CSI}?${mode}h`;
        return this;
    }

    /**
     * DEC PRIVATE MODE RESET
     * 
     * Unset corresponding DECSET settings
     * @param {number} mode 
     * @returns 
     */
    DECRST(mode) {
        this.#output += `${SEQUENCE.CSI}?${mode}l`;
        return this;
    }

    CHARST(mode) {
        this.#output += `${SEQUENCE.ESC}(${mode}`;
        return this;
    }

    /**
     * Append msg to buffer, but does not immediately write to stdout
     * @param {string} msg msg to append
     * @returns {this}
     */
    append(msg) {
        this.#output += msg;
        return this;
    }
    /**
     * writes buffer to stdout and clears buffer.
     * @param {string?} msg Optionally write a string to stdout after applying sequences
     * @param {boolean?} resetSGR Reset all SGR options after writing
     */
    write(msg,resetSGR) {
        stdout.write(this.#output);
        this.#output = '';
        if (msg) {
            stdout.write(msg);
        }
        if (resetSGR){
            stdout.write(`${SEQUENCE.CSI}0m`);
        }
    }
}

module.exports = {
    VT100,
    SGR,
    DECSET,
    CHARSET,
};
