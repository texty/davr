function drawSmallMaps(file, id) {
    d3.json(file, function (error, data) {

        var riversNames = [
            // {key:"Дунай", value:"danube", lat: "24.53", lon:"48.45", scale:"10000"},
            {key:"Дунай", value:"danube", lat: "20.00", lon:"48.30", scale:"2700"},
            {key:"Дністер", value:"dnister", lat: "26.53",  lon:"49.00", scale:"4000"},
            {key:"Дніпро", value:"dnipro", lat: "30.53", lon:"52.45", scale:"3000"},
            {key:"Дон", value:"don", lat: "41.53", lon:"51.55", scale:"3000"},
            {key:"Південний Буг", value:"southernbug", lat: "30.53", lon:"49.00", scale:"4000"},
            {key:"Вісла", value:"wisla", lat: "21.53", lon:"53.00", scale:"4000"}
        ];


        var filteredArray = riversNames.filter(function( obj ) {
            return "#"+obj.value === id;
        });

        var river = filteredArray[0].key;
        var lat = Number(filteredArray[0].lat);
        var lon = Number(filteredArray[0].lon);
        var scale = Number(filteredArray[0].scale);


        var smallprojection = d3.geoMercator()
            .scale(scale)
            .rotate([0, 0, 0])
            // .center([30.53, 50.45])
            .center([lat, lon]);

        var colorScale = d3.scaleQuantile() //синя шкала для річок
            .range(colorbrewer.Blues[4])
            .domain([0,4]);


        var path = d3.geoPath()
            .projection(smallprojection);


        var src = id.replace("#", '');
        console.log(src);

        var src = "img/"+src+".png";

        /*додаємо карту у відповідний контейнер*/
        var map = d3.select(id)
            // .append("img")
            // .attr("src", src)
            // .attr("class", "preview ")
            
  /*small maps as svg*/
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 960 800")
        ;



        var g = map.append("g");

        g.selectAll("path")
            .data(topojson.feature(data, data.objects.all_total_basins).features
                .filter(function (d) {
                    return d.properties.river === river
                }))
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", filteredArray[0].value)
            .attr("class", "smallriver")
            .attr("fill", "none")
            .attr("stroke", function (d) {
                    d.properties.a_DEPTH5 = +d.properties.a_DEPTH5;
                    d.properties.a_WIDTH5 = +d.properties.a_WIDTH5;
                    return BlWhScale(d.properties.a_DEPTH5 * 5);
                }
            )
             .attr("fill-opacity", 0.5)
            .attr("stroke-width", function (d) {
                return +d.properties.a_WIDTH5 / 30 + "px";
            });

        
        /*фільтрує річки і квіточки на великій карті в алежності від обраної річки*/
        
      //      map.on("click", function() {
      //          bigMap.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
      //
      //          // projection
      //          //     .scale(1500)
      //          //     .center([27.53, 47.00]);
      //          //
      //          // group.selectAll("path")
      //          //     .attr("d", path);
      //
      //
      //       d3.selectAll(".river")
      //           .style("display", "none")
      //           .each(function() {
      //           var currentPath = this;
      //           if(currentPath.classList.contains(filteredArray[0].value)){
      //               d3.select(currentPath).style("display", "block")
      //           }
      //       });
      //
      //
      //       d3.selectAll(".petal")
      //           .style("display", "none")
      //           .each(function() {
      //               var currentPath = this;
      //               if(currentPath.classList.contains(filteredArray[0].value)){
      //                   d3.select(currentPath).style("display", "block")
      //               }
      //           });
      // })

    })
}