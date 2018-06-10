function drawRivers(myData) {



    group.selectAll("path")
        .data(topojson.feature(myData, myData.objects.all_total_basins).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", function (d) {
            var keyriver = d.properties.river;
            var filter = riversNames.filter(function (obj) {
                return obj.key == keyriver;
            });

            return filter[0].value + " river"
        })
        .attr("fill", "none")
        .attr("stroke", function (d) {
                d.properties.a_DEPTH5 = +d.properties.a_DEPTH5;
                d.properties.a_WIDTH5 = +d.properties.a_WIDTH5;
            var keyriver = d.properties.river;
            var filter = riversNames.filter(function (obj) {
                return obj.key == keyriver;
            });

                // return BlWhScale(d.properties.a_DEPTH5 * 5);

            if(filter[0].key == "Дунай"){
                return  plasmaScale(d.properties.a_DEPTH5 * 5);
            }
            else if   (filter[0].key == "Дніпро") {
                return viridisScale(d.properties.a_DEPTH5 * 5);
            }
            else if   (filter[0].key == "Дон") {
                return greenScale(d.properties.a_DEPTH5 * 5);
            }
            else if   (filter[0].key == "Вісла") {
                return spectralScale(d.properties.a_DEPTH5 * 5);
            }
            else if   (filter[0].key == "Дністер") {
                return BlWhScale(d.properties.a_DEPTH5 * 5);
            }
            else if   (filter[0].key == "Південний Буг") {
                return infernoScale(d.properties.a_DEPTH5 * 5);
            }
}
        )
        .attr("fill-opacity", 0.5)
        .attr("stroke-width", function (d) {
            return +d.properties.a_WIDTH5 / 50 + "px";
        });
}