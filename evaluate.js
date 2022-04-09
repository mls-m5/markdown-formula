
function run(code) {
    try {
        return eval(code);
    }
    catch(e) {
        console.log("could not run code: ", code)
        return "<invalid formula>";
    }
}
