var halfRadius = 2;

var size = d3.scaleSqrt()
    .domain([0, 1])
    .range([0, halfRadius]);

var pie = d3.pie()
    .sort(null)
    .value(function (d) {
        return 5;
    });

var reds = ["#570c49", "#84126e", "#DD1FB9", "#EC76D5", "#f094df"];
var green = "#199eb1";

var counties = $.ajax({
    url: "data/ukr_shape.geojson",
    // url: "data/all_total_basins.geojson",
    dataType: "json",
    success: console.log("County data successfully loaded."),
    error: function(xhr) {
        alert(xhr.statusText)
    }
});

$.when(counties).done(function() {
    var danubeMap = L.map('danube-m')
        .setView([47, 26], 7);

L.geoJSON(counties.responseJSON).addTo(danubeMap);

    danubeMap.dragging.disable();
    danubeMap.doubleClickZoom.disable();
    danubeMap.scrollWheelZoom.disable();
    danubeMap.getContainer().addEventListener('click', function () {
        danubeMap.dragging.enable();
    });


    // danubeMap.touchZoom.disable();

    // danubeMap.boxZoom.disable();
    // danubeMap.keyboard.disable();
    // if (danubeMap.tap) danubeMap.tap.disable();



    var DanubeSvg = d3.select("#danube-m").select("svg").append('g').attr("class", "flowers");


    d3.csv("data/lastDayMeanValueAllKey2.csv", function (error, points) {
       var danubeData = points.filter(function (d) {return d.river === "Дунай"});
        var nested = d3.nest()
            .key(function (d) {
                return d.id
            })
            .entries(danubeData);


        var feature = DanubeSvg.selectAll(".petal")
            .data(nested)
            .enter().append('g')
            .attr("transform", function (d) {
             d.LatLng = new L.LatLng(d.values[0].lat, d.values[0].lon);
                return "translate("+
                    danubeMap.latLngToLayerPoint(d.LatLng).x +","+
                    danubeMap.latLngToLayerPoint(d.LatLng).y +")";
             })
            .each(function (d, i) {
                d3.select(this).selectAll('.petal')
                    .data(pie(d.values
                        .filter(function (d) {
                                return d.size > 0;
                            }
                        )))
                    .enter()
                    .append("path")
                    .attr("transform", function (d) {
                        return r((d.startAngle + d.endAngle) / 2);
                    })

                    .attr("d", petalPath)
                    .style("stroke", "white")
                    .style("stroke-width", "0.1px")
                    .style("fill", function (d) {
                        //якщо не кисень
                        if(d.data.key != "Кисень.розчинений.МгО2.дм3") {
                            if (d.data.size > 0.9) {
                                // return PointColorsRed(d.data.size);
                                return reds[2]
                            }
                            else {
                                // return "#49E858"
                                return green
                            }
                        }

                        //якщо кисень
                        if(d.data.key === "Кисень.розчинений.МгО2.дм3") {
                            if (d.data.size > 0.9) {
                                return green;
                            }
                            else {
                                // return "#49E858"
                                return reds[2]
                            }


                        }

                    })
            });

        danubeMap.on("moveend", update);
        update();
        function update() {
            feature.attr("transform",
                function(d) {
                    return "translate("+
                        danubeMap.latLngToLayerPoint(d.LatLng).x +","+
                        danubeMap.latLngToLayerPoint(d.LatLng).y +")";
                }
            )
        }
    });


    var basemap = L.tileLayer('', {
        attribution: '',
        subdomains: 'abcd',
        maxZoom: 8,
        minZoom: 7
    }).addTo(danubeMap);


    var danube = L.tileLayer('tiles/DanubeTiles/DanubeTiles/{z}/{x}/{y}.png', {
        maxZoom: 8,
        minZoom: 7,
        tms: false,
        attribution: ''
    }).addTo(danubeMap);

    $(danube.getContainer()).addClass('danube river');

    // L.control.layers({'Basemap':'Leaflet'},{'DanubeTiles':mytile}).addTo(danubeMap);

});

    /*----- DNISTER ------*/
var countiesDanube = $.ajax({
    url: "data/ukr_shape.geojson",
    // url: "data/all_total_basins.geojson",
    dataType: "json",
    success: console.log("County data successfully loaded."),
    error: function(xhr) {
        alert(xhr.statusText)
    }
});

$.when(countiesDanube).done(function() {
    var dnisterMap = L.map('dnister-m')
        .setView([48, 27], 7);


    dnisterMap.dragging.disable();
    dnisterMap.doubleClickZoom.disable();
    dnisterMap.scrollWheelZoom.disable();
    dnisterMap.getContainer().addEventListener('click', function () {
        dnisterMap.dragging.enable();
    });

    L.geoJSON(countiesDanube.responseJSON).addTo(dnisterMap);


    var dnisterSvg = d3.select("#dnister-m").select("svg").append('g').attr("class", "flowers");


    d3.csv("data/lastDayMeanValueAllKey2.csv", function (error, dnisterPoints) {
        var dnisterData = dnisterPoints.filter(function (d) {
            return d.river === "Дністер"
        });
        var nested = d3.nest()
            .key(function (d) {
                return d.id
            })
            .entries(dnisterData);


        var feature = dnisterSvg.selectAll(".petal")
            .data(nested)
            .enter().append('g')
            .attr("transform", function (d) {
                d.LatLng = new L.LatLng(d.values[0].lat, d.values[0].lon);
                return "translate(" +
                    dnisterMap.latLngToLayerPoint(d.LatLng).x + "," +
                    dnisterMap.latLngToLayerPoint(d.LatLng).y + ")";
            })
            .each(function (d, i) {
                d3.select(this).selectAll('.petal')
                    .data(pie(d.values
                        .filter(function (d) {
                                return d.size > 0;
                            }
                        )))
                    .enter()
                    .append("path")
                    .attr("transform", function (d) {
                        return r((d.startAngle + d.endAngle) / 2);
                    })

                    .attr("d", petalPath)
                    .attr("class", "petal-mob")
                    .style("stroke", "white")
                    .style("stroke-width", "0.1px")
                    .style("fill", function (d) {
                        //якщо не кисень
                        if(d.data.key != "Кисень.розчинений.МгО2.дм3") {
                            if (d.data.size > 0.9) {
                                // return PointColorsRed(d.data.size);
                                return reds[2]
                            }
                            else {
                                // return "#49E858"
                                return green
                            }
                        }

                        //якщо кисень
                        if(d.data.key === "Кисень.розчинений.МгО2.дм3") {
                            if (d.data.size > 0.9) {
                                return green;
                            }
                            else {
                                // return "#49E858"
                                return reds[2]
                            }


                        }

                    })
                    .on("click", function (d) {
                        alert(d.name)
                    })
            });

        dnisterMap.on("moveend", update);
        update();
        function update() {
            feature.attr("transform",
                function (d) {
                    return "translate(" +
                        dnisterMap.latLngToLayerPoint(d.LatLng).x + "," +
                        dnisterMap.latLngToLayerPoint(d.LatLng).y + ")";
                }
            )
        }
    });


    var dnisterBasemap = L.tileLayer('', {
        attribution: '',
        subdomains: 'abcd',
        maxZoom: 8,
        minZoom: 7
    }).addTo(dnisterMap);


    var dnister = L.tileLayer('tiles/DnisterTiles/DnisterTiles/{z}/{x}/{y}.png', {
        maxZoom: 8,
        minZoom: 7,
        tms: false,
        attribution: ''
    }).addTo(dnisterMap);

    $(dnister.getContainer()).addClass('dnister river');

    // L.control.layers({'Basemap': 'Leaflet'}, {'DnisterTiles': mytile}).addTo(dnisterMap);


});


/*----- Wisla ------*/
var wislaCounties = $.ajax({
    url: "data/ukr_shape.geojson",
    // url: "data/all_total_basins.geojson",
    dataType: "json",
    success: console.log("County data successfully loaded."),
    error: function(xhr) {
        alert(xhr.statusText)
    }
});

$.when(wislaCounties).done(function() {
    var wislaMap = L.map('wisla-m')
        .setView([50.5, 23], 7);

    wislaMap.dragging.disable();
    wislaMap.doubleClickZoom.disable();
    wislaMap.scrollWheelZoom.disable();
    wislaMap.getContainer().addEventListener('click', function () {
        wislaMap.dragging.enable();
    });

    L.geoJSON(countiesDanube.responseJSON).addTo(wislaMap);

    var wislaSvg = d3.select("#wisla-m").select("svg").append('g').attr("class", "flowers");


    d3.csv("data/lastDayMeanValueAllKey2.csv", function (error, wislaPoints) {
        var wislaData = wislaPoints.filter(function (d) {
            return d.river === "Вісла"
        });
        var nested = d3.nest()
            .key(function (d) {
                return d.id
            })
            .entries(wislaData);


        var feature = wislaSvg.selectAll(".petal")
            .data(nested)
            .enter().append('g')
            .attr("transform", function (d) {
                d.LatLng = new L.LatLng(d.values[0].lat, d.values[0].lon);
                return "translate(" +
                    wislaMap.latLngToLayerPoint(d.LatLng).x + "," +
                    wislaMap.latLngToLayerPoint(d.LatLng).y + ")";
            })
            .each(function (d, i) {
                d3.select(this).selectAll('.petal')
                    .data(pie(d.values
                        .filter(function (d) {
                                return d.size > 0;
                            }
                        )))
                    .enter()
                    .append("path")
                    .attr("transform", function (d) {
                        return r((d.startAngle + d.endAngle) / 2);
                    })

                    .attr("d", petalPath)
                    .style("stroke", "white")
                    .style("stroke-width", "0.1px")
                    .style("fill", function (d) {
                        //якщо не кисень
                        if(d.data.key != "Кисень.розчинений.МгО2.дм3") {
                            if (d.data.size > 0.9) {
                                // return PointColorsRed(d.data.size);
                                return reds[2]
                            }
                            else {
                                // return "#49E858"
                                return green
                            }
                        }

                        //якщо кисень
                        if(d.data.key === "Кисень.розчинений.МгО2.дм3") {
                            if (d.data.size > 0.9) {
                                return green;
                            }
                            else {
                                // return "#49E858"
                                return reds[2]
                            }


                        }

                    })
            });

        wislaMap.on("moveend", update);
        update();
        function update() {
            feature.attr("transform",
                function (d) {
                    return "translate(" +
                        wislaMap.latLngToLayerPoint(d.LatLng).x + "," +
                        wislaMap.latLngToLayerPoint(d.LatLng).y + ")";
                }
            )
        }
    });


    var dnisterBasemap = L.tileLayer('', {
        attribution: '',
        subdomains: 'abcd',
        maxZoom: 8,
        minZoom: 7
    }).addTo(wislaMap);


    var wisla = L.tileLayer('tiles/WislaTiles/WislaTiles/{z}/{x}/{y}.png', {
        maxZoom: 8,
        minZoom: 7,
        tms: false,
        attribution: ''
    }).addTo(wislaMap);

    $(wisla.getContainer()).addClass('wisla river');

    // L.control.layers({'Basemap': 'Leaflet'}, {'DnisterTiles': mytile}).addTo(wislaMap);


});




/*----- Bug ------*/
var bugCounties = $.ajax({
    url: "data/ukr_shape.geojson",
    // url: "data/all_total_basins.geojson",
    dataType: "json",
    success: console.log("County data successfully loaded."),
    error: function(xhr) {
        alert(xhr.statusText)
    }
});

$.when(bugCounties).done(function() {
    var bugMap = L.map('bug-m')
        .setView([48, 30], 7);

    bugMap.dragging.disable();
    bugMap.doubleClickZoom.disable();
    bugMap.scrollWheelZoom.disable();
    bugMap.getContainer().addEventListener('click', function () {
        bugMap.dragging.enable();
    });

    L.geoJSON(bugCounties.responseJSON).addTo(bugMap);


    var bugSvg = d3.select("#bug-m").select("svg").append('g').attr("class", "flowers");


    d3.csv("data/lastDayMeanValueAllKey2.csv", function (error, bugPoints) {
        var bugData = bugPoints.filter(function (d) {
            return d.river === "Південний Буг"
        });
        var nested = d3.nest()
            .key(function (d) {
                return d.id
            })
            .entries(bugData);


        var feature = bugSvg.selectAll(".petal")
            .data(nested)
            .enter().append('g')
            .attr("transform", function (d) {
                d.LatLng = new L.LatLng(d.values[0].lat, d.values[0].lon);
                return "translate(" +
                    bugMap.latLngToLayerPoint(d.LatLng).x + "," +
                    bugMap.latLngToLayerPoint(d.LatLng).y + ")";
            })
            .each(function (d, i) {
                d3.select(this).selectAll('.petal')
                    .data(pie(d.values
                        .filter(function (d) {
                                return d.size > 0;
                            }
                        )))
                    .enter()
                    .append("path")
                    .attr("transform", function (d) {
                        return r((d.startAngle + d.endAngle) / 2);
                    })

                    .attr("d", petalPath)
                    .style("stroke", "white")
                    .style("stroke-width", "0.1px")
                    .style("fill", function (d) {
                        //якщо не кисень
                        if(d.data.key != "Кисень.розчинений.МгО2.дм3") {
                            if (d.data.size > 0.9) {
                                // return PointColorsRed(d.data.size);
                                return reds[2]
                            }
                            else {
                                // return "#49E858"
                                return green
                            }
                        }

                        //якщо кисень
                        if(d.data.key === "Кисень.розчинений.МгО2.дм3") {
                            if (d.data.size > 0.9) {
                                return green;
                            }
                            else {
                                // return "#49E858"
                                return reds[2]
                            }


                        }

                    })
            });

        bugMap.on("moveend", update);
        update();
        function update() {
            feature.attr("transform",
                function (d) {
                    return "translate(" +
                        bugMap.latLngToLayerPoint(d.LatLng).x + "," +
                        bugMap.latLngToLayerPoint(d.LatLng).y + ")";
                }
            )
        }
    });


    var bugBasemap = L.tileLayer('', {
        attribution: '',
        subdomains: 'abcd',
        maxZoom: 8,
        minZoom: 7
    }).addTo(bugMap);


    var bug = L.tileLayer('tiles/BugTiles/BugTiles/{z}/{x}/{y}.png', {
        maxZoom: 8,
        minZoom: 7,
        tms: false,
        attribution: ''
    }).addTo(bugMap);

    $(bug.getContainer()).addClass('wisla river');

    // L.control.layers({'Basemap': 'Leaflet'}, {'DnisterTiles': mytile}).addTo(wislaMap);


});


/*----- Dnipro ------*/
var dniproCounties = $.ajax({
    url: "data/ukr_shape.geojson",
    // url: "data/all_total_basins.geojson",
    dataType: "json",
    success: console.log("County data successfully loaded."),
    error: function(xhr) {
        alert(xhr.statusText)
    }
});

$.when(dniproCounties).done(function() {
    var dniproMap = L.map('dnipro-m')
        .setView([49, 32], 7);

    dniproMap.dragging.disable();
    dniproMap.doubleClickZoom.disable();
    dniproMap.scrollWheelZoom.disable();
    dniproMap.getContainer().addEventListener('click', function () {
        dniproMap.dragging.enable();
    });

    L.geoJSON(dniproCounties.responseJSON).addTo(dniproMap);

    var dniproSvg = d3.select("#dnipro-m").select("svg").append('g').attr("class", "flowers");


    d3.csv("data/lastDayMeanValueAllKey2.csv", function (error, dniproPoints) {
        var dniproData = dniproPoints.filter(function (d) {
            return d.river === "Дніпро"
        });
        var nested = d3.nest()
            .key(function (d) {
                return d.id
            })
            .entries(dniproData);


        var feature = dniproSvg.selectAll(".petal")
            .data(nested)
            .enter().append('g')
            .attr("transform", function (d) {
                d.LatLng = new L.LatLng(d.values[0].lat, d.values[0].lon);
                return "translate(" +
                    dniproMap.latLngToLayerPoint(d.LatLng).x + "," +
                    dniproMap.latLngToLayerPoint(d.LatLng).y + ")";
            })
            .each(function (d, i) {
                d3.select(this).selectAll('.petal')
                    .data(pie(d.values
                        .filter(function (d) {
                                return d.size > 0;
                            }
                        )))
                    .enter()
                    .append("path")
                    .attr("transform", function (d) {
                        return r((d.startAngle + d.endAngle) / 2);
                    })

                    .attr("d", petalPath)
                    .style("stroke", "white")
                    .style("stroke-width", "0.1px")
                    .style("fill", function (d) {
                        //якщо не кисень
                        if(d.data.key != "Кисень.розчинений.МгО2.дм3") {
                            if (d.data.size > 0.9) {
                                // return PointColorsRed(d.data.size);
                                return reds[2]
                            }
                            else {
                                // return "#49E858"
                                return green
                            }
                        }

                        //якщо кисень
                        if(d.data.key === "Кисень.розчинений.МгО2.дм3") {
                            if (d.data.size > 0.9) {
                                return green;
                            }
                            else {
                                // return "#49E858"
                                return reds[2]
                            }


                        }

                    })
            });

        dniproMap.on("moveend", update);
        update();
        function update() {
            feature.attr("transform",
                function (d) {
                    return "translate(" +
                        dniproMap.latLngToLayerPoint(d.LatLng).x + "," +
                        dniproMap.latLngToLayerPoint(d.LatLng).y + ")";
                }
            )
        }
    });


    var bugBasemap = L.tileLayer('', {
        attribution: '',
        subdomains: 'abcd',
        maxZoom: 8,
        minZoom: 7
    }).addTo(dniproMap);


    var dnipro = L.tileLayer('tiles/DniproTiles/DniproTiles/{z}/{x}/{y}.png', {
        maxZoom: 8,
        minZoom: 7,
        tms: false,
        attribution: ''
    }).addTo(dniproMap);

    $(dnipro.getContainer()).addClass('wisla river');



});


/*----- Don ------*/
var donCounties = $.ajax({
    url: "data/ukr_shape.geojson",
    // url: "data/all_total_basins.geojson",
    dataType: "json",
    success: console.log("County data successfully loaded."),
    error: function(xhr) {
        alert(xhr.statusText)
    }
});

$.when(donCounties).done(function() {
    var donMap = L.map('don-m')
        .setView([49, 37], 7);

    donMap.dragging.disable();
    donMap.doubleClickZoom.disable();
    donMap.scrollWheelZoom.disable();
    donMap.getContainer().addEventListener('click', function () {
        donMap.dragging.enable();
    });

    L.geoJSON(donCounties.responseJSON).addTo(donMap);


    var donSvg = d3.select("#don-m").select("svg").append('g').attr("class", "flowers");


    d3.csv("data/lastDayMeanValueAllKey2.csv", function (error, donPoints) {
        var donData = donPoints.filter(function (d) {
            return d.river === "Дон"
        });
        var nested = d3.nest()
            .key(function (d) {
                return d.id
            })
            .entries(donData);


        var feature = donSvg.selectAll(".petal")
            .data(nested)
            .enter().append('g')
            .attr("transform", function (d) {
                d.LatLng = new L.LatLng(d.values[0].lat, d.values[0].lon);
                return "translate(" +
                    donMap.latLngToLayerPoint(d.LatLng).x + "," +
                    donMap.latLngToLayerPoint(d.LatLng).y + ")";
            })
            .each(function (d, i) {
                d3.select(this).selectAll('.petal')
                    .data(pie(d.values
                        .filter(function (d) {
                                return d.size > 0;
                            }
                        )))
                    .enter()
                    .append("path")
                    .attr("transform", function (d) {
                        return r((d.startAngle + d.endAngle) / 2);
                    })

                    .attr("d", petalPath)
                    .style("stroke", "white")
                    .style("stroke-width", "0.1px")
                    .style("fill", function (d) {
                        //якщо не кисень
                        if(d.data.key != "Кисень.розчинений.МгО2.дм3") {
                            if (d.data.size > 0.9) {
                                // return PointColorsRed(d.data.size);
                                return reds[2]
                            }
                            else {
                                // return "#49E858"
                                return green
                            }
                        }

                        //якщо кисень
                        if(d.data.key === "Кисень.розчинений.МгО2.дм3") {
                            if (d.data.size > 0.9) {
                                return green;
                            }
                            else {
                                // return "#49E858"
                                return reds[2]
                            }


                        }

                    })
            });

        donMap.on("moveend", update);
        update();
        function update() {
            feature.attr("transform",
                function (d) {
                    return "translate(" +
                        donMap.latLngToLayerPoint(d.LatLng).x + "," +
                        donMap.latLngToLayerPoint(d.LatLng).y + ")";
                }
            )
        }
    });


    var donBasemap = L.tileLayer('', {
        attribution: '',
        subdomains: 'abcd',
        maxZoom: 7,
        minZoom: 7
    }).addTo(donMap);


    var don = L.tileLayer('tiles/DonTiles/DonTiles/{z}/{x}/{y}.png', {
        maxZoom: 7,
        minZoom: 7,
        tms: false,
        attribution: ''
    }).addTo(donMap);

    $(don.getContainer()).addClass('don river');



});





d3.selectAll("#danube-m > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-overlay-pane > svg:nth-child(1)").attr("pointer-events", "all");








































var flowefsize = 4;

function petalPath(d) {
    var angle = (d.endAngle - d.startAngle) / 3,
        s = polarToCartesian(-angle, halfRadius),
        e = polarToCartesian(angle, halfRadius),
    // r = size(d.data.size),

        r = size(flowefsize),

        m = {x: halfRadius + r, y: 0},
        c1 = {x: halfRadius + r / 2, y: s.y},
        c2 = {x: halfRadius + r / 2, y: e.y};
    return "M0,0Q" + Math.round(c1.x) + "," + Math.round(c1.y * 6) + " " + Math.round(m.x + r) + "," + Math.round(m.y) + "Q" + Math.round(c2.x) + "," + Math.round(c2.y * 6) + " " + Math.round(0) + "," + Math.round(0) + "Z";
};


function r(angle) {
    return "rotate(" + (angle / Math.PI * 180) + ")";
}

function polarToCartesian(angle, radius) {
    return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
    };
}

