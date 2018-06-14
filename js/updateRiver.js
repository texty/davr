var width = 960,
    height = 500;

var color = d3.scaleThreshold()
    .range(["#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177","#49006a"])
    .domain([250, 500, 750, 1000, 1250, 1500, 1750, 2000]);

// all these pixel ratio bits used to support full resolution on high-density (retina) devices
var devicePixelRatio = window.devicePixelRatio || 1;

var canvas = d3.select("body").append("canvas")
    .attr("width", width * devicePixelRatio)
    .attr("height", height * devicePixelRatio)
    .style("width", width + "px")
    .style("height", height + "px").node();

var context = canvas.getContext("2d");
context.scale(devicePixelRatio, devicePixelRatio);

var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");


d3.queue()
    .defer(d3.json, "data/all_total_basins.json")
    .defer(d3.json, "data/ukr_shape.geojson")
    .await(ready);

function ready(error, rivers, ukraine) {
    if (error) return console.warn(error);


    var path = d3.geoPath()
        .projection(d3.geoAlbersUsa())
        .context(context);

    var subset = topojson.feature(rivers, rivers.objects.all_total_basins).features.filter(function(d) {
        return d.properties;
    });

    context.fillStyle = "#fff";
    context.lineWidth = 5;
    // subset.forEach(function(d) {
    //     context.strokeStyle = "blue";
        context.beginPath();
        // path(d);
        context.fill();
        context.stroke();
    // });

    context.lineWidth = 1;
    path(topojson.mesh(rivers, rivers.objects.all_total_basins));
    context.stroke();
}











