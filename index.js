var photo = require("passport-photo");
var gravatar = require("passport-photo-gravatar");
var newId = require("uuid-pure").newId;
var seq = require("seq");

photo.useDefault(gravatar({default:"identicon",forcedefault:true, size:50}));

var addresses = [];
for (var i = 0; i < 1000; i++) {
    addresses.push(newId(10) + "@" + newId(10) + ".com");
};

if(!require("path").existsSync("./output")) require("fs").mkdirSync("./output");
seq(addresses).parEach(function(add){
    var self = this;
    photo({email:add}, function(err, url){
        if(err) return self(err);
        var stream = require('request')(url);
        stream.pipe(require('fs').createWriteStream("./output/" + add + ".jpg"));
        stream.on("end", function(){
            console.log("loaded " + add);
            self();
        });
    });
}).seq(function(){
    console.log("done");
})