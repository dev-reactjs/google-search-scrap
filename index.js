const fs = require("fs");
const SerpWow = require("google-search-results-serpwow");

// create the serpwow object, passing in our API key
let serpwow = new SerpWow("080005128E48424FB52DDFBD7539C757");
const readline = require("readline");

// creating interface to take input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// reading files to compare
// reading pattern file
fs.readFile("./files/pattern.txt", "utf8", (err, data) => {
  if (err) throw err;
  //storing pattern file lines in array
  let pattern = data.split("\n");
  // reading input file
  fs.readFile("./files/input.txt", "utf8", (err, data) => {
    if (err) throw err;
    // storing input file in array
    let input = data.split("\n");

    //comparision start
    if (pattern.length && input.length) {
      let mode1Output = [];
      let mode2Output = [];
      let mode3Output = [];
      for (let i = 0; i < pattern.length - 1; i++) {
        for (let j = 0; j < input.length - 1; j++) {

          //if both lines are same, then push it in array for mode one output
          if (pattern[i] === input[j]) mode1Output.push(input[j]);

          //if input line contains pattern line, then push it in array for mode one output
          if (input[j].includes(pattern[i])) mode2Output.push(input[j]);

          //comparing for third codition of edit distance 1
          if (
            pattern[i].length === input[j].length ||
            pattern[i].length === input[j].length + 1 ||
            pattern[i].length === input[j].length - 1
          ) {
            // if lines are same
            if (pattern[i] === input[j]) mode3Output.push(input[j]);

            // if lines have one mismatch value
            else {
              let bigger =
                pattern[i].length > input[j].length ? pattern[i] : input[j];
              let smaller =
                pattern[i].length < input[j].length ? pattern[i] : input[j];
              for (let k = 0; k < bigger.length; k++) {
                if (pattern[i][k] !== input[j][k]) {
                  let string =
                    bigger.substr(0, k - 1) +
                    bigger.substr(k, bigger.length - 1);
                  if (smaller === string) mode3Output.push(input[j]);
                  break;
                }
              }
            }
          }
        }
      }
      // logging output
      console.log("");
      console.log("-------------Both Files Matched-------------");
      console.log("*******************************************");
      console.log("Mode 1 Outputs: ");
      mode1Output.forEach(index => {
        console.log(index);
      });
      console.log("");
      console.log("Mode 2 Outputs: ");
      mode2Output.forEach(index => {
        console.log(index);
      });
      console.log("");
      console.log("Mode 3 Outputs: ");
      mode3Output.forEach(index => {
        console.log(index);
      });
      console.log("***********************************");
    } else {
      console.log("Files does not have content.");
    }
  });
});

// method to search google api.
rl.question("", name => {
  // taking query input
  console.log("Enter text string to perform web-search: ");
  async function getResult() {
    let result = await serpwow.json({
      q: name
    });

    // pretty-print the result
    console.log("Title", JSON.stringify(result.related_searches[0].query));
    console.log("Url", JSON.stringify(result.related_searches[0].link));
  }
  getResult();
});
