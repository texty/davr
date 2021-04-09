/**
 * Created by yevheniia on 20.06.18.
 */

var callTable = function (key) {
    var file = "data/contaminants_2018.csv";

    d3.csv(file, function (error, data) {
        if (error) throw error;

        data.forEach(function (d) {
            d.year2018 = +d.year2018;
        });
        var table = d3.select("#tableContainer")
            .append("table")
            .attr('id', 'contaminantsTable');

// Append the table header and body.
        var tableHead = table.append('thead'),
            tableBody = table.append('tbody');

// Add the table header content.
        tableHead.append('tr').selectAll('th')
            .data(["ЄДРПОУ", "Назва", "Викиди, млн куб."]).enter()
            .append('th')
            .text(function (d) {
                return d;
            });

// Add the table body rows.
        var rows = tableBody.selectAll('tr')
            .data(data.filter(function (d) {
                return d.region === key
            }))
            .enter()
            .append('tr')
            .attr("id", function (d) {
                return "id"+d.companyID
            });

        rows.append('td')
            .text(function (d) {
                return d.companyID;
            });

        rows.append('td')
            .text(function (d) {
                return d.companyNAME;
            });

        rows.append('td')
            .text(function (d) { return d.year2018; })
            .style("text-align", "center");


        table.selectAll("tbody tr")
            .sort(function (a, b) {
                return d3.descending(a.year2018, b.year2018);
            });

    });
};