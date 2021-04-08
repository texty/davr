/**
 * Created by yevheniia on 29.03.21.
 */
var halfRadius_m = 2;

var size = d3.scaleSqrt()
    .domain([0, 1])
    .range([0, halfRadius_m]);

var pie_m = d3.pie()
    .sort(null)
    .value(function (d) {
        return 5;
    });

var reds = ["#570c49", "#84126e", "#DD1FB9", "#EC76D5", "#f094df"];
var green = "#199eb1";


d3.csv("data/lastDayMeanValueAllKey2.csv", function (error, points) {

    var drawItem = function(wrapper, coords, wrapper_id, river, path, clas){

        let counties = $.ajax({
            url: "data/ukr_shape.geojson",
            dataType: "json",
            success: console.log("County data successfully loaded."),
            error: function(xhr) {
                alert(xhr.statusText)
            }
        });

        $.when(counties).done(function() {


            var myRiverMap = L.map(wrapper)
                .setView(coords, 7);

            L.geoJSON(counties.responseJSON).addTo(myRiverMap);
            myRiverMap.dragging.disable();
            myRiverMap.doubleClickZoom.disable();
            myRiverMap.scrollWheelZoom.disable();
            myRiverMap.getContainer().addEventListener('click', function () {
                myRiverMap.dragging.enable();
            });

            var myRiverSvg = d3.select(wrapper_id).select("svg").append('g').attr("class", "flowers-m");

            var riverData = points.filter(function (d) {
                return d.river === river
            });
            var nested = d3.nest()
                .key(function (d) {
                    return d.id
                })
                .entries(riverData);


            var feature = myRiverSvg.selectAll(".petal-m")
                .data(nested)
                .enter().append('g')
                .attr("transform", function (d) {
                    d.LatLng = new L.LatLng(d.values[0].lat, d.values[0].lon);
                    return "translate(" +
                        myRiverMap.latLngToLayerPoint(d.LatLng).x + "," +
                        myRiverMap.latLngToLayerPoint(d.LatLng).y + ")";
                })
                .each(function (d, i) {
                    d3.select(this).selectAll('.petal-m')
                        .data(pie_m(d.values
                            .filter(function (d) {
                                    return d.size > 0;
                                }
                            )))
                        .enter()
                        .append("path")
                        .attr("transform", function (d) { return r((d.startAngle + d.endAngle) / 2);  })
                        .attr("d", petalPath_m)
                        .style("stroke", "white")
                        .style("stroke-width", "0.1px")
                        .style("fill", function (d) { return petalFill(d); })
                        .on("click", function(){ console.log("hey")})
                });
            
            

            myRiverMap.on("moveend", update);
            update();
            function update() {
                feature.attr("transform",
                    function (d) {
                        return "translate(" +
                            myRiverMap.latLngToLayerPoint(d.LatLng).x + "," +
                            myRiverMap.latLngToLayerPoint(d.LatLng).y + ")";
                    }
                )
            }

            L.tileLayer('', {
                attribution: '',
                subdomains: 'abcd',
                maxZoom: 8,
                minZoom: 7
            }).addTo(myRiverMap);


            let container = L.tileLayer(path, {
                maxZoom: 8,
                minZoom: 7,
                tms: false,
                attribution: ''
            }).addTo(myRiverMap);

            $(container.getContainer()).addClass(clas);

        })



    };

    drawItem('danube-m', [47, 26], "#danube-m", "Дунай", 'tiles/DanubeTiles/DanubeTiles/{z}/{x}/{y}.png', 'danube river');
    drawItem('dnister-m', [48, 27], "#dnister-m", "Дністер", 'tiles/DnisterTiles/DnisterTiles/{z}/{x}/{y}.png', 'dnister river');
    drawItem('wisla-m', [50.5, 23], "#wisla-m", "Вісла", 'tiles/WislaTiles/WislaTiles/{z}/{x}/{y}.png', 'wisla river');
    drawItem('bug-m', [48, 30], "#bug-m", "Південний Буг", 'tiles/BugTiles/BugTiles/{z}/{x}/{y}.png', 'bug river');
    drawItem('dnipro-m', [49, 32], "#dnipro-m", "Дніпро", 'tiles/DniproTiles/DniproTiles/{z}/{x}/{y}.png', 'dnipro river');
    drawItem('don-m', [49, 37], "#don-m", "Дон", 'tiles/DonTiles/DonTiles/{z}/{x}/{y}.png', 'don river');

});


// d3.selectAll("#danube-m > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-overlay-pane > svg:nth-child(1)").attr("pointer-events", "all");


var flowersize = 4;

function petalPath_m(d) {
    var angle = (d.endAngle - d.startAngle) / 3,
        s = polarToCartesian(-angle, halfRadius_m),
        e = polarToCartesian(angle, halfRadius_m),
        r = size(flowersize),
        m = {x: halfRadius_m + r, y: 0},
        c1 = {x: halfRadius_m + r / 2, y: s.y},
        c2 = {x: halfRadius_m + r / 2, y: e.y};
    return "M0,0Q" + Math.round(c1.x) + "," + Math.round(c1.y * 6) + " " + Math.round(m.x + r) + "," + Math.round(m.y) + "Q" + Math.round(c2.x) + "," + Math.round(c2.y * 6) + " " + Math.round(0) + "," + Math.round(0) + "Z";
}


function r(angle) {
    return "rotate(" + (angle / Math.PI * 180) + ")";
}


function polarToCartesian(angle, radius) {
    return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
    };
}

