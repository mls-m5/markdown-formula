"use strict";

(function() {
    let tables = document.getElementsByTagName("table");
    let context = {};

    function getText(table, i, j) {
        let col = table.rows[i].cells[j];
        let text = col.innerText.trim();
        return text;
    }

    // Convert to number if number
    function convert(text) {
        if (isNaN(text)) {
            return text;
        } else {
            return Number(text);
        }
    }

    function evaluateCell(cell) {
        if (typeof cell==="undefined") {
            throw "cell does not exist";
        }

        let i = cell.row;
        let j = cell.col;

        if (!cell.hasOwnProperty("tempValue")) {
            cell.tempValue = cell.innerText.trim();
        }

        let oldCell = context.cell;
        context.cell = cell;

        if (typeof cell.tempValue === "string" && cell.tempValue.startsWith("=")) {
            let old = cell.tempValue;
            try {
                cell.innerText = cell.tempValue = run(cell.tempValue.substring(1), i, j, context);
            }
            catch(e) {
                cell.innerText = cell.tempValue = "<i>invalid formula <i> + cell.tempValue";
            }
            if (typeof cell.tempValue === "undefined") {
                throw "";
            }
        }

        context.cell = oldCell;

        return convert(cell.innerText);
    }


    function evaluateTable(table) {
        for (let i = 0; i < table.rows[0].cells.length; ++i) {
            let name = table.rows[0].cells[i].innerText;

            let j = i; // To not capture changing value
            context[name] = function(row) {
                if (typeof row === "undefined") {
                    row = context.cell.row;
                }

                return evaluateCell(table.rows[row].cells[j], row, j);
            }
        }

        // Save previous text for autofill
        let prevText = {};
        let shouldAutoFill = {};

        for (let i = 0; i < table.rows.length; ++i) {
            let row = table.rows[i];

            for (let j = 0; j < row.cells.length; ++j) {
                let col = row.cells[j];
                col.row = i;
                col.col = j;

                let text = col.innerText.trim();
                if (text === "...") {
                    shouldAutoFill[j] = true;
                }
                else if (text.length > 0) {
                    shouldAutoFill[j] = false;
                }

                if (text === "" || text === "...") {
                    if (shouldAutoFill[j]) {
                        text = prevText[j];
                        if (text[0] === "=") {
                            col.innerText = text; //run(text.substring(1));
                        } else {
                            text = +text + 1;
                            col.innerText = text;
                        }
                    }
                }
                prevText[j] = text;
            }

        }

        for (let i = 0; i < table.rows.length; ++i) {
            let row = table.rows[i];
            for (let j = 0; j < row.cells.length; ++j) {
                let cell = row.cells[j];
                evaluateCell(cell);
            }
        }
    }

    function start() {
        for (let i = 0; i < tables.length; ++i) {
            evaluateTable(tables[i]);
        }
    }

    document.addEventListener('readystatechange', event => {
        // When HTML/DOM elements are ready:
        if (event.target.readyState === "interactive") { //does same as:  ..addEventListener("DOMContentLoaded"..
            start();
        }
    });


    function run(code, row, col, context) {
        try {
            let keys = Object.keys(context);

            return Function("row", "col", keys, "return " + code)(row, col, ...Object.values(context));
        }
        catch(e) {
            console.log("could not run code: ", code)
            return "<invalid formula>";
        }
    }

})();
