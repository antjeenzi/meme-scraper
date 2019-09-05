//this part calls a package that will get the full html code from a given url and return it as one long string, saved to the variable "data"
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

//this part will use a package to decode encoded/broken html urls
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

function main(data) {
  //call the string method "match" on the data variable (that now contains the full page as one html string)
  matches = data.match(/"\/.+watermark=none" style/g);

  //calls the decode package (see above) on every element of the matches map, i.e. on every url that's now singled out
  matchesDecoded = matches.map(matchUrl => entities.decode(matchUrl));

  //cuts the result of all urls to just the first 10 urls using the slice method
  firstTen = matchesDecoded.slice(0, 10);

  //apply the slice method to every element of the firstTen array, i.e. use a map to slice of the unnecessary "style"-tag at the end of each url
  firstTenCropped = firstTen.map(url => url.slice(1, -7));

  //add the protocoll to the sliced urls
  firstTenFullUrl = firstTenCropped.map(
    https => (https = `https://memegen.link${https}`)
  );
  console.log('files saved');

  //creates a folder "memes" if it doesn't exist yet
  const fs = require('fs');
  const dir = './memes';

  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  } catch (err) {
    console.error(err);
  }

  //loop for downloading the content behind each link and then saving it to a file
  for (i = 0; i < 10; i++) {
    const fs = require('fs');

    const file = fs.createWriteStream(`./memes/memes${i}.jpg`);
    const requestNew = https.get(firstTenFullUrl[i], function(response) {
      response.pipe(file);
    });
  }
}
