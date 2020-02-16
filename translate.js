const csv = require('csv-parser');
const fs = require('fs');

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data))
  } catch (err) {
    console.error(err)
  }
}

module.exports.getJsonObject = () => {
  map = {}
  fs.createReadStream('data/heatmap_data.csv')
    .pipe(csv())
    .on('data', (row) => {
      map["" + row['ZIP']] = row['MONEY']
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
      var jsf = require("./codes")
      cpy = JSON.parse(JSON.stringify(jsf.obj))

      features = jsf.obj["features"]
      var sum = 0
      for (var i = 0; i < features.length; i++) {
        var zip = parseInt(features[i]["properties"]["zipcode"]).toString();
        if (map[zip] != undefined) {
          features[i]["properties"]["count"] = map[zip]
        } else {
          features[i]["properties"]["count"] = 0
        }
      }
      var filtered = features.filter(function(value, index, arr){
          return value["properties"]["count"] > 0;
      });
      jsf.obj["features"] = filtered
      storeData(jsf.obj, "./data/zipcodes.geojson")
      jsf.obj = cpy
  });
}
