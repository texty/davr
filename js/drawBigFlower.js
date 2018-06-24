/**
 * Created by yevheniia on 15.06.18.
 */
function drawBigFlower(IdForChart) {

    d3.selectAll('.particles').remove();
    d3.selectAll('.big-labels').remove();


    // d3.csv("data/flowers.csv", function (error, flowers) {
    d3.csv("data/lastDayMeanValueAllKey2.csv", function (error, flowers) {
        var data = flowers.filter(function (d) {
            return d.id === IdForChart
        });


        var particles = flowerG.selectAll(".particles")
            .data(pie(data))
            .enter();
        particles.append("path")
            .attr('class', "particles")

            .attr("transform", function (d) {
                return r((d.startAngle + d.endAngle) / 2);
            })

            .attr("d", bigPetalPath)
            .attr("title", function (d) {
                return d.data.key;
            })
            .style("stroke", "#070707")
            .style("fill", function (d) {
                if(d.data.key != "Кисень.розчинений.МгО2.дм3") {
                    if (d.data.size > 0.9) {
                        return PointColorsRed(d.data.size);
                    }
                    else {
                        // return "#49E858"
                        return "#199eb1"
                    }
                }

                //якщо кисень
                if(d.data.key === "Кисень.розчинений.МгО2.дм3") {
                    if (d.data.size > 0.9) {
                        return "#199eb1";
                    }
                    else {
                        // return "#49E858"
                        return "#a50f15"
                    }


                }
            })
            .on("click", function (d) {
                d3.selectAll(".particles").style("stroke-width", "1px").style("stroke", "#070707");
                d3.select(this).style("stroke-width", "4px").style("stroke", "#1765a0");
                var keyIndicator = d.data.key;
                console.log(d);



                drawChart(IdForChart, keyIndicator)
            })
            .on("mouseover", function (d) {
                // d3.select(".hint").html("Клікніть </br> на пелюсток, </br> аби побудувати </br> графік");
                flowerhint.transition()
                    .duration(200)
                    .style("opacity", .9);

                flowerhint.html(d.data.key)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {

            }) ;

        // particles.append('text')
        //     .attr('class', 'big-labels')
        //     .attr('x', bigradius * 2)
        //     .text(function (d) {
        //         var label = indicatorNames.filter(function (obj) {
        //             return obj.key === d.data.key;
        //         });
        //         return label[0].abr;
        //     })
        //
        //     .attr("transform", function (d) {
        //         return r((d.startAngle + d.endAngle) / 2);
        //     })
        //     .style("fill", "white")
        //     .style("font-size", "10px");



        // particles.append('text')
        //     .attr('class', 'big-labels')
        //     .attr('x', bigradius * 2)
        //     .text(function (d) {
        //         var label = indicatorNames.filter(function (obj) {
        //             return obj.key === d.data.key;
        //         });
        //         return label[0].abr;
        //     })
        //
        //     .attr("transform", function (d) {
        //         return r((d.startAngle + d.endAngle) / 2);
        //     })
        //     .style("fill", "white")
        //     .style("font-size", "10px");


    })


}


function bigPetalPath(d) {
    var angle = (d.endAngle - d.startAngle) / 3,
        s = polarToCartesian(-angle, bigradius),
        e = polarToCartesian(angle, bigradius),
    // r = size(d.data.size),
        r = size(80),

        m = {x: bigradius + r, y: 0},
        c1 = {x: bigradius + r / 2, y: s.y},
        c2 = {x: bigradius + r / 2, y: e.y};
    return "M0,0Q" + Math.round(c1.x) + "," + Math.round(c1.y * 2) + " " + Math.round(m.x + r) + "," + Math.round(m.y) + "Q" + Math.round(c2.x) + "," + Math.round(c2.y * 2) + " " + Math.round(0) + "," + Math.round(0) + "Z";
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
/* end of flowers */


