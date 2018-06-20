/**
 * Created by yevheniia on 20.06.18.
 */



var callTable = function (key) {
    var file = "data/contaminantsByRegionEdited.csv";

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
            .data(["ЄДРПОУ", "Назва", "Викиди, млн куб."]).enter()
            .append('th')
            .text(function (d) {
                return d;
            });

// Add the table body rows.
        var rows = tableBody.selectAll('tr')
            .data(data.filter(function (d) {
                return d.regionName === key
            }))
            .enter()
            .append('tr');



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


        table.selectAll("tbody tr")
            .sort(function (a, b) {
                return d3.ascending(a.value, b.value);
            });

    });
};