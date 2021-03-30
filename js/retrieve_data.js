/**
 * Created by yevheniia on 30.03.21.
 */

var all_flower_data;
function retrieve_all_flower_data(cb) {
    if (all_flower_data) return cb(all_flower_data);

    return d3.csv("data/allFlowerData_2020_4.csv", function(err, data){
        if (err) throw err;

        data.forEach(function (d) {
            d.date = parseTime(d.date);
            d.value = +d.value;
        });

        var nested_data = d3.nest()
            .key(function(d){return d.id})
            .object(data);

        all_flower_data = nested_data;
        if (cb) return cb(nested_data);
        return;
    })
}
