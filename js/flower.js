var width = 500,
    height = 500,
    halfRadius = 20;  // length of petal & therefore size of digram overall

var size = d3.scaleSqrt()
    .domain([0, 1])
    .range([0, halfRadius]);

var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var PointColorsRed = d3.scaleQuantile()
    .range(colorbrewer.Reds[9])
    .domain([0,9]);

var myPetalData = [
    {id:1, name:"a", size:1},
    {id:2, name:"b", size:2},
    {id:2, name:"c", size:2.5},
    {id:3, name:"d", size:.1},
    {id:4, name:"e", size:2},
    {id:5, name:"f", size:2.5},
    {id:6, name:"g", size:5}
]

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return 5; });

var path = d3.arc()
    .outerRadius(halfRadius - 10)
    .innerRadius(0);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

// var arc = svg.selectAll(".arc")
//     .data(pie(myPetalData))
//     .enter().append("g")
//     .attr("class", "arc")
//     .append("path")
//     .attr("d", path)
//     .style("fill", function(k) {
//         return PointColorsRed(k.data.name); })
//     .style("stroke", "grey");


var petal = svg.selectAll(".petal")
    .data(pie(myPetalData))
    .enter().append("path")
    .attr("class", "petal")
    .attr("transform", function(d) {
        return r((d.startAngle + d.endAngle) / 2); })
    .attr("d", petalPath)
    // .attr("d", "path")
    .style("stroke", "grey")
    .style("fill", "pink");

function petalPath(d) {
    var angle = (d.endAngle - d.startAngle)/2.2 ,
        s = polarToCartesian(-angle, halfRadius),
        e = polarToCartesian(angle, halfRadius),
        r = size(d.data.size),
        m = {x: halfRadius+ r, y: 0},
        c1 = {x: halfRadius + r , y: s.y},
        c2 = {x: halfRadius + r , y: e.y};
    return "M0,0Q" + Math.round(c1.x) + "," + Math.round(c1.y * 2) + " " + Math.round(m.x + r) + "," + Math.round(m.y) + "Q" + Math.round(c2.x) + "," + Math.round(c2.y * 2) + " " + Math.round(0) + "," + Math.round(0) + "Z";
    // return "M0,0L" + Math.round(s.x) + "," + Math.round(s.y) + "Q" + Math.round(c1.x) + "," + Math.round(c1.y) + " " + Math.round(m.x) + "," + Math.round(m.y) + "L" + Math.round(m.x) + "," + Math.round(m.y) + "Q" + Math.round(c2.x) + "," + Math.round(c2.y) + " " + Math.round(e.x) + "," + Math.round(e.y) + "Z";

};

function petalFill(d, i) {
    return d3.hcl(i / myPetalData.length * 360, 60, 70);
};

function petalStroke(d, i) {
    return d3.hcl(i / myPetalData.length * 360, 60, 40);
};

function r(angle) {
    return "rotate(" + (angle / Math.PI * 180) + ")";
}

function polarToCartesian(angle, radius) {
    return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
    };
};



//petal path
// <svg>
// <path fill="#FFFFFF" stroke="#000000" stroke-miterlimit="10" d="M21,34.328C21,15.693,32.477,0.515,50.124,0.515
// C67.77,0.515,79,16.928,79,34.328c0,17.399-29,65.157-29,65.157S21,52.962,21,34.328z"/>
// </svg>