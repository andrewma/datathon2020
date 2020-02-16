const csvToJson = require('csvtojson')
const csv = require('fast-csv');
const fs = require('fs')


const csvFilePath = './data/2017_Gaz_zcta_national.txt'

const toLookupJson = (zipcodes) => {
    lookupJson = {};
    zipcodes.forEach(zipcode => {
        lookupJson[zipcode.GEOID] = {
            lon: Number(zipcode.INTPTLONG),
            lat: Number(zipcode.INTPTLAT)
        }
    })
    return lookupJson;
}

csvToJson({
    delimiter: '\t'
})
.fromFile(csvFilePath)
.then((zipcodes) => {
    return toLookupJson(zipcodes)
})
.then(data => {
    fs.writeFile('./data/zipcodeLookups.json', JSON.stringify(data), (err) => {
        if (err) console.error(err);
    })
})


// const toGeojson = (zipcodes, writeFilePath) => {
//     const lookupZipcodes = require('./data/zipcodeLookups.json');

//     const geojson = {
//         "type": "FeatureCollection",
//         "features": []
//     };
  
//     zipcodes.forEach(zipcode => {
   
//         const foundZipcode = lookupZipcodes[zipcode.zipcode];
    
//         if (foundZipcode) {
//             const point = {
//                 type: 'Feature',
//                 properties: {
//                     zipcode: zipcode.zipcode,
//                     count: zipcode.count
//                 },
//                 geometry: {
//                     type: 'Point',
//                     coordinates: [foundZipcode.lon, foundZipcode.lat],
//                 }
//             }
//             geojson.features.push(point);
//         }
//     })
//     fs.writeFile( writeFilePath, JSON.stringify(geojson), (err) => {
//         if (err) console.error(err);
//     });
// }


const zipcodeCsvToJson = (sourceFilepath, zipcodeLookupsFilepath, outputFilepath, zipcodeField, customProperties) => {
    const geojson = {
        "type": "FeatureCollection",
        "features": []
    };
    const fails = [];
    const fourDigitZips = [];
    let fourDigitCounter = 0;
    let successCounter = 0;

    const lookupZipcodes = require(zipcodeLookupsFilepath);

    const readStream = fs.createReadStream(sourceFilepath);
    const csvStream = csv({objectMode: true, headers: true})
        .on('data', (data) => {
            // if (successCounter > 0) return;
            // console.log(data)

            let zipcode = data[zipcodeField];
            const count = Number(data[1]);

            // Add zeroes to 4-digit zipcodes
            if (zipcode.length === 4) {
                zipcode = '0' + zipcode;
                fourDigitZips.push(zipcode);
                fourDigitCounter++
            }

            // Get the coordinates for the zipcode from the lookup
            const foundZipcode = lookupZipcodes[zipcode];
            
            // Create a feature and add it to the final geojson
            if (foundZipcode) {
                successCounter++
                const coordinates = [Number(foundZipcode.lon), Number(foundZipcode.lat)];
                const customProps = {};
                customProperties.forEach((prop) => {
                    customProps[prop.field] = prop.transform ? prop.transform(data[prop.field]) : data[prop.field];
                });
                const feature = {
                    type: 'Feature',
                    properties: {
                        zipcode,
                        count
                    },
                    geometry: {
                        type: 'Point',
                        coordinates
                    }
                };
                Object.assign(feature.properties, customProps);
                // console.log(feature)
                geojson.features.push(feature);
            } else {
                // Handle zipcodes without coordinates in the lookup
                fails.push(zipcode);
            }
        })
        .on('end', () => {
            // Write geojson to file
            fs.writeFile(outputFilepath, JSON.stringify(geojson), (err) => {
                if (err) console.error(err);
            });
        debugReport()

        });
    const debugReport = () => {
        //Debug
        console.warn('\x1b[36m\x1b[7m\x1b[1m%s\x1b[0m', '\n   failscount:   \n\n','\x1b[1m', fails.length, '\x1b[0m');
        console.warn('\x1b[36m\x1b[7m\x1b[1m%s\x1b[0m', '\n     fails:   \n', '\x1b[1m', JSON.stringify(fails, null, 2), '\x1b[0m');
        console.warn('\x1b[35m\x1b[7m\x1b[1m%s\x1b[0m', '\n    four digits:   \n', '\x1b[1m', JSON.stringify(fourDigitZips, null, 2), '\x1b[0m');
        
        console.warn('\x1b[35m\x1b[7m\x1b[1m%s\x1b[0m', '\n   number of four digit zipcodes:   \n\n','\x1b[1m', fourDigitCounter, '\x1b[0m');
        console.warn('\x1b[33m\x1b[7m\x1b[1m%s\x1b[0m', '\n   Success:   \n\n','\x1b[1m', successCounter, '\x1b[0m');
    }

    readStream.pipe(csvStream);
};

const zipcodeCountProperties = [{ field: 'count', transform: Number }]

// zipcodeCsvToJson('./data/ZipCodeCount.csv', './data/zipcodeLookups.json', './data/zipcodes.geojson', 'zipcode', zipcodeCountProperties );

const affiliateProperties = [
    { field: 'number', transform: Number },
    { field: 'affiliate' },
    { field: 'tier', transform: Number },
    { field: 'city'},
    { field: 'approximate', transform: Boolean}
];

//zipcodeCsvToJson('./data/affiliates.csv', './data/zipcodeLookups.json', './data/affiliates.geojson', 'zipcode', affiliateProperties);

module.exports = {
    toLookupJson,
    zipcodeCsvToJson
}

$(document).ready(function() {
    $('form').on('submit', function(event) {
      $.ajax({
         data : {
            firstName : $('#firstName').val(),
            lastName: $('#lastName').val(),
                },
            type : 'POST',
            url : '/process'
           })
       .done(function(data) {
         $('#output').text(data.output).show();
     });
     event.preventDefault();
     });
});