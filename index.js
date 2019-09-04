//this part will get the html from a given url and return it as a string, saved to the variable data
var https = require('https');
let data;
var options = {
  host: 'memegen.link',
  path: '/examples'
};
var request = https.request(options, function(res) {
  data = '';
  res.on('data', function(chunk) {
    data += chunk;
  });
  res.on('end', function() {
    main(data);
  });
});
request.on('error', function(e) {
  console.log(e.message);
});
request.end();

function main(data) {
  matches = data.match(/"\/.+watermark=none" style/g); //call the string method "match" on the data variable
  firstTen = matches.slice(0, 10); //slice result to the first first 10 urls
  firstTenCropped = firstTen.map(url => url.slice(1, -7)); //apply the slice method to every element of the firstTen array, i.e. use a map to slice of the unnecessary "style"-tag at the end of each url
  firstTenFullUrl = firstTenCropped.map(
    https => (https = `https://memegen.link${https}`) //add the protocoll to the sliced urls
  );
  console.log('files saved');

  //loop for downloading the content behind each link and then saving it to a file
  for (i = 0; i < 10; i++) {
    const fs = require('fs');

    const file = fs.createWriteStream(`file${i}.jpg`);
    const requestNew = https.get(firstTenFullUrl[i], function(response) {
      response.pipe(file);
    });
  }
}
