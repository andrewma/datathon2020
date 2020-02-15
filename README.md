# Zipcode Heatmap


![Screenshot](https://user-images.githubusercontent.com/5750602/41453163-a60ba458-7042-11e8-90fb-e948fba61bb0.gif)

A Mapbox GL heatmap based on zipcodes

Zipcde coordinates are from the [US Census]('http://www.census.gov/geo/maps-data/data/gazetteer.html')

Zipcodes to map are currently hard-coded in the format:

```
const zipcodes = [
    {
        zipcode: '94618',
        count: 15
    },
    {
        zipcode: '94609',
        count: 8
    },
   //... etc
]
```

## Setup

- Add mapbox token in map.html as the value of `mapboxgl.accessToken`

- Download the zipcode data from the [US Census]('http://www.census.gov/geo/maps-da    ta/data/gazetteer.html') and unzip into the `data` dirctory (The name is currently hard-coded to 2017)

- Run process.js

- Run a simple server (because CORS)

```
python -m SimpleHTTPServer 8000
```

- Open localhost:8000/map.html in your browser

