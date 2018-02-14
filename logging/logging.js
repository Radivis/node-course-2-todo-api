/* LogCon is similar to "DefCon"
LogCon 6: Relaxed operation, don't log anything
LogCon 5: Regular operation, log critical errors
LogCon 4: Light debugging operation, log errors
LogCon 3: Moderate debugging operation, log errors and warnings
LogCon 2: Heavy debugging operation, log errors, warnings, and important comments
LogCon 1: Apocylyptic debugging operation, log f**king everything!
*/
const logCon = 2;

// level 1: comment
// level 2: important comment
// level 3: warning
// level 4: error
// level 5: critical error
function log(level, text, revealCaller) {
  // Level argument at beginning can be omitted and is defaulted to 1
  if (typeof level !== "number") {
    revealCaller = text;
    text = level;
    level = 1;
  } else if (level > 5) {
    level = 5; // keep the logging level reasonable
  }

  var printFunction;
  var levelDescription;
  switch(level) {
    case 5:
      levelDescription = "critical error";
      printFunction = console.error;
      break;
    case 4:
      levelDescription = "error";
      printFunction = console.error;
      break;
    case 3:
      levelDescription = "warning";
      printFunction = console.warn;
      break;
    case 2:
      levelDescription = "notification";
      printFunction = console.log;
    default:
      levelDescription = "remark";
      printFunction = console.log;
  }

  if (level >= logCon) {
    let time = new Date(Date.now()).toLocaleString();
    var caller;
    if (revealCaller) {
      caller = log.caller.name + log.caller.toString();
    } else {
      caller = "";
    }
    printFunction(`${time} ${caller}(${levelDescription}): ${text}`);
  }
  // text is returned regardless of LogCon or level!
  return text;
};

module.exports = {log};
