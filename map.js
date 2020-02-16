function readTextFile()
{
    file = 'data/zipcodes.geojson';
    numRows = 10;
    var rawFile = new XMLHttpRequest();
    var answer = "";
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                answer = allText;
            }
        }
    }
    rawFile.send(null);

    var obj = JSON.parse(answer);
    var feats = obj.features;
    var len = feats.length;
    var table = "<table align='center'>";
    table += "<tr>" + "<th align='center'>" + "ZIP Code" + "</th>" + "<th align='right'>" + "Money" + "</th>" + "</tr>";
    for (var i = 0; i < len; i++) {
        table += "<tr>";
        table += "<td>";
        table += feats[i].properties.zipcode;
        table += "</td>";
        table += "<td>";
        table += feats[i].properties.count;
        table += "</td>"
        table += "</tr>";
    }
    table += "</table>";

    document.getElementById('ziptable').innerHTML = table;
}
