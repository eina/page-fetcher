/**
 * Workflow 
 * 
 * 1. take command line arguments: URL, local file path
 * 2. want to see if i can log the command line arguments
 * 3. do a request from one of the args
 * 4. write to the file
 */
const request = require('request');
const fs = require('fs');
const readline = require('readline');

const args = process.argv.slice(2);
const url = args[0];
const path = args[1];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const writeToPath = (path, content) => {
  fs.writeFile(path, content, (error) => {
    if(error) {
      console.log('writeFile error: ', error)   
    } else {
      console.log('file created successfuly!')
    }
  })
}

// check if path is valid
if( !(/^(.(.*\.txt$|.*\.html))*$/g.test(path)) ) {
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