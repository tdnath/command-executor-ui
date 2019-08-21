(function() {
  var childProcess = require("child_process");
  var oldSpawn = childProcess.spawn;
  function mySpawn() {
      console.log('spawn called');
      console.log(arguments);
      var result = oldSpawn.apply(this, arguments);
      return result;
  }
  childProcess.spawn = mySpawn;
})();

var http = require("http");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
 
// Running Server Details.
var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("App listening at %s:%s Port", host, port)
});
 


app.get('/', function (req, res) {
  var html='';
  html +="<body>";
  html += "<form action='/output'  method='post' name='form1'>";
  html += "Give the Command:</p><input type='text' name='command'>";
  html += "<input type='submit' value='submit'>";
  html += "</form>";
  html += "</body>";
  res.send(html);
});


const { spawn } = require('child_process');

app.post('/output', urlencodedParser, function (req, res){
    
    cmd = req.body.command
    console.log(cmd);
  

    let body = [];
    try {
        const child = spawn('bash');
        child.stdin.end(`${cmd}`);
        console.log(`Command with bash: "${cmd}"`);
          child.stdout.setEncoding('utf8');

        child.stdout.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
            console.log(body);
              
        });
        
        child.stderr.on('close',(err) => {
              console.log('err');
              console.log(err);
        });
        
        child.on('error', function( err ){
            console.log(err);
            throw err;
          });

        child.on('close', (code) => {
            res.write(body.toString());
            res.end();
            console.log(`child process exited with code ${code}`);
        });
        
        child.once('exit', code => {
            // exit
            console.log(code);
        });
          
    } catch(err) {
      console.log(err);
    }
 });
