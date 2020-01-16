const request = require('request');
const fs = require('fs');
const readline = require('readline');

const args = process.argv.slice(2);
const url = args[0];
const path = args[1];

console.log(args)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const writeToPath = (path, content) => {
  fs.writeFile(path, content, (error) => {
    if(error) {
      console.log('writeFile error: ', error)   
    } else {
      console.log(`Downloaded and saved 3261 bytes to ${path}`)
    }
  })
}



// check if path is valid
if( path && !(/^(.(.*\.txt$|.*\.html))*$/g.test(path)) ) {
  console.log('Error: invalid file type')
}

// check if there are inputs
if(args.length === 2) {
  // do the request
  request(url, (error, res, body) => {
    const status = res && res.statusCode;
    if(!error && status === 200) {
      // check if file to write in exists
      fs.access(path, fs.F_OK, (err) => {
        if(err) {
          // file does not exist, write to that file
          writeToPath(path, body);
          rl.close();
        } else {
          // file exists warn it'll be overwritten
          rl.question(`${path} already exists, overwrite file? (Y/n): `, (input) => {
              // check if user input is either 'Y' or 'y'
            if(input === '\u0059' || input === '\u0079') {
              // if no errors, write to the file
              console.log('overwriting!')
              writeToPath(path, body);
              rl.close();
            } else {
              rl.close();
            }
          })          
        }                     
      })

    } else {
      console.log('request error: ', error);
    }    
  })
}