function drawBigFlower(IdForChart) {

    d3.selectAll('.particles').remove();
    d3.selectAll('.big-labels').remove();

    d3.csv("data/lastDayMeanValueAllKey2.csv", function (error, flowers) {
        var data = flowers.filter(function (d) {
            return d.id === IdForChart
        });


        var particles = flowerG.selectAll(".particles")
            .data(pie(data))
            .enter();
        
        particles.append("path")
            .attr('class', "particles")
            .attr("transform", function (d) { return r((d.startAngle + d.endAngle) / 2);  })
            .attr("d", bigPetalPath)
            .attr("title", function (d) {  return d.data.key; })
            .style("stroke", "#070707")
            .style("fill", function (d) {
                var eye = $("#texturePetals");
                if (!eye.hasClass("eye-clicked")) {
                    if (d.data.key != "Кисень.розчинений.МгО2.дм3") {
                        return d.data.size > 0.9 ? reds[2] : green;
                    } else if (d.data.key === "Кисень.розчинений.МгО2.дм3") {
                        return d.data.size > 0.9 ? green : reds[2];
                    }
                } else {
                    if (d.data.key != "Кисень.розчинений.МгО2.дм3") {
                        return d.data.size > 0.9 ? "url(#diagonal-stripe-1)": "url(#circles-1)";
                    } else  if (d.data.key === "Кисень.розчинений.МгО2.дм3") {
                        return d.data.size > 0.9 ? "url(#circles-1)": "url(#diagonal-stripe-1)"
                    }
                }
            })
            .on("click", function (d) {
                d3.selectAll(".particles")
                    .style({
                    "stroke-width": "1px",
                    "stroke": "#070707"
                });
                d3.select(this)
                    .style({
                        "stroke-width": "4px", 
                        "stroke": "#1765a0"
                    });


                
                var keyIndicator = d.data.key;

                var dataName = d.data.name;

                drawChart(IdForChart.toString(), keyIndicator, dataName)
            });
            // .on("mouseover", function (d) {
            //     if (!isTablet) {
            //         flowerhint.transition()
            //             .duration(200)
            //             .style("opacity", .9);
            //         flowerhint.html(d.data.key)
            //             .style("left", (d3.event.pageX) + "px")
            //             .style("top", (d3.event.pageY - 28) + "px");
            //     }
            // })
            // .on("mouseout", function (d) {
            //     if (!isTablet) {
            //         flowerhint.transition()
            //             .duration(200)
            //             .style("opacity", 0);
            //     }
            // });
    });
}


function bigPetalPath(d) {
    var angle = (d.endAngle - d.startAngle) / 3,
        s = polarToCartesian(-angle, bigradius),
        e = polarToCartesian(angle, bigradius),
        r = size(80),

        m = {x: bigradius + r, y: 0},
        c1 = {x: bigradius + r / 2, y: s.y},
        c2 = {x: bigradius + r / 2, y: e.y};
    return "M0,0Q" + Math.round(c1.x) + "," + Math.round(c1.y * 3) + " " + Math.round(m.x + r) + "," + Math.round(m.y) + "Q" + Math.round(c2.x) + "," + Math.round(c2.y * 3) + " " + Math.round(0) + "," + Math.round(0) + "Z";
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
/* end of flowers */

d3.select("#big-flower")
    .append("p")
    .attr("id", "bigFlowerIntro")
    .html('клікайте на пелюстки, аби побудувати <br> графік для різних показників');



