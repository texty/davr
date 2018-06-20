/**
 * Created by yevheniia on 20.06.18.
 */

var file = "data/contaminantsByRegion.csv";

d3.csv(file, function (error, data) {
    if (error) throw error;

    var table = d3.select("#contaminants")
        .append("table")
        .attr('class', 'contaminantsTable');

// Append the table header and body.
    var tableHead = table.append('thead'),
        tableBody = table.append('tbody');

// Add the table header content.
    tableHead.append('tr').selectAll('th')
        .data(["Область", "ЄДРПОУ", "Назва", "Викиди, млн куб."]).enter()
        .append('th')
        .text(function (d) {
            return d;
        });

// Add the table body rows.
    var rows = tableBody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr');
    // .attr("id", function (d) {
    //     return d.id
    // }) ;


    rows.append('td')
        .attr("id", function (d) {
            return d.id
        })
        .text(function (d) {
            return d.id;
        });


    rows.append('td')
        .text(function (d) {
            return d.name;
        });

    rows.append('td')
        .text(function (d) {
            return d.value;
        });

});