# VT100
Utility library for writing vt100 escape codes to the terminal

## Example

```Javascript
const {VT100,SGR} = require('@ruinedme/vt100');

const writer = new VT100();
writer.SGR([SGR.FOREGROUND_RED, SGR.BOLD]).write('This text is bold and red!');
writer.SGR([SGR.DEFAULT]).write(); // reset text back to defaults
```
