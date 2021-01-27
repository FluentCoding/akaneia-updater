let child = require('child_process').execFile;

child("./xdelta3", ["-dfs", "../melee.iso", "../test_package/stable/patch.xdelta", "test.iso"], function(err, data) {
    if(err){
       console.error(err);
       return;
    }
 
    console.log(data.toString());
});