/**
 * Created by yevheniia on 15.06.18.
 */
function drawBigFlower(IdForChart) {

    d3.selectAll('.particles').remove();
    d3.selectAll('.big-labels').remove();


    d3.csv("data/flowers.csv", function (error, flowers) {

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
            .attr("title", function (d) {return d.data.key;})
            .style("stroke", "#fff0f7")
            .style("fill", function (d) {
                if (d.data.size > 0.9) {
                    return PointColorsRed(d.data.size);
                }
                else {
                    return "#49E858"
                }
            })
            .on("click", function (d) {
                var keyIndicator = d.data.key;
                console.log(d);

                drawChart(IdForChart, keyIndicator)
            });

        
        
        // particles.append('text')
        //     .attr('class', 'big-labels')
        //     .attr('x', r(100))
        //     .text(function (d) {
        //         return d.data.key;
        //     })
        //     // .attr("transform", function (d) {
        //     //     return r((d.startAngle + d.endAngle) / 2);
        //     // })
        //     .attr("transform", function (d) {
        //         return "translate(" +
        //             (bigradius * Math.sin( ((d.endAngle - d.startAngle) / 2) + d.startAngle ) ) +
        //             ", " +
        //             ( -1 * bigradius * Math.cos( ((d.endAngle - d.startAngle) / 2) + d.startAngle ) ) +
        //             ")";
        //     })
        //     .style("fill", "white")
        //     .style("font-size", "9px");


    })


}


function bigPetalPath(d) {
    var angle = (d.endAngle - d.startAngle) / 2,
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
