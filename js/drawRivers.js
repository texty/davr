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
                return infernoScale(d.properties.a_DEPTH5 * 5);
            }
        )
        .attr("fill-opacity", 0.5)
        .attr("stroke-width", function (d) {
            return +d.properties.a_WIDTH5 / 150 + "px";
        });
}