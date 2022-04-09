"use strict";

(function() {
    let tables = document.getElementsByTagName("table");
    let currentRow = 0;

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
            return number(text);
        }
    }

    function evaluateCell(cell, i, j) {
        if (typeof cell==="undefined") {
            throw "cell does not exist";
        }

        if (!cell.hasOwnProperty("tempValue")) {
            cell.tempValue = cell.innerText.trim();
        }

        if (typeof cell.tempValue === "string" && cell.tempValue.startsWith("=")) {
            let old = cell.tempValue;
            try {
                cell.innerText = cell.tempValue = run(cell.tempValue.substring(1));
            }
            catch(e) {
                cell.innerText = cell.tempValue = "<i>invalid formula <i> + cell.tempValue";
            }
            if (typeof cell.tempValue === "undefined") {
                throw "";
            }
        }

        return cell.innerText;
    }


    function evaluateTable(table) {
        for (var i = 0; i < table.rows[0].cells.length; ++i) {
            let name = table.rows[0].cells[i].innerText;

            let j = i; // To not capture changing value
            window[name] = function(row) {
                if (typeof row === "undefined") {
                    row = window.row;
                }

                return evaluateCell(table.rows[row].cells[j]);
            }
        }

        // Save previous text for autofill
        let prevText = {};
        let shouldAutoFill = {};

        for (let i = 0; i < table.rows.length; ++i) {
            let row = table.rows[i];
            currentRow = i;
            window.row = i;
            for (let j = 0, col; col = row.cells[j], j < row.cells.length; ++j) {
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
                            col.innerText = run(text.substring(1));
                        } else {
                            text = +text + 1;
                            col.innerText = text;
                        }
                    }
                }
                prevText[j] = text;
            }

            for (let j = 0; j < row.cells.length; ++j) {
                let cell = row.cells[j];
                evaluateCell(cell, i, j);
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

})();