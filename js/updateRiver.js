var mymap = new L.Map('mapid', {
    'center': [0, 0],
    'zoom': 0
});

$.ajax({
    // url with your geojson data file
    'url': 'data/all_total_basins.geojson',
    // return json object, not as string
    'dataType': 'json',
    // on success handle result
    'success': function (result) {
        // Initialize GeoJSON layer and add to map
        var layer = new L.GeoJSON(result).addTo(mymap);
        // Fit map to bounds of your GeoJSON
        mymap.fitBounds(layer.getBounds());
    }
});