map.on("load", function () {
  map.resize();
  getChoropleth();
});

function getChoropleth() {
  $.ajax({
    type: "GET",
    url:
      "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni-latest.json",
    datatype: "json",
    success: function (response) {
      plotChoropleth(JSON.parse(response));
    },
  });
}
function plotChoropleth(data) {
  for (var i = 0; i < regioni.features.length; i++) {
    for (var j = 0; j < data.length; j++) {
      if (
        data[j].denominazione_regione ==
        regioni.features[i].properties.Regione
      ) {
        regioni.features[i].properties.covid = data[j].totale_positivi;
        regioni.features[i].properties.data = data[j];
      }
    }
  }

  map.addSource("province", {
    type: "geojson",
    data: regioni,
  });

  map.addLayer({
    id: "covid",
    source: "province",
    type: "fill",
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "covid"],
        100,
        "#FFF",
        1000,
        "#FFFB33 ",
        10000,
        "#ee7f01 ",
        100000,
        "#e2001a ",
      ],
      "fill-opacity": 0.5,
    },
  });
  map.addLayer({
    id: "borders",
    source: "province",
    type: "line",
    paint: {
      "line-color": [
        "interpolate",
        ["linear"],
        ["get", "covid"],
        100,
        "#FFF",
        1000,
        "#FFFB33 ",
        10000,
        "#ee7f01 ",
        100000,
        "#e2001a ",
      ],
      "line-width": 3,
      "line-offset":2
    },
  });
  var popup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: false,
  });

  map.on("click", "covid", function (e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = "pointer";

    var coordinates = e.lngLat;
    dataJson=JSON.parse(e.features[0].properties.data)
    var content = '<h4><i class="fas fa-map-marked-alt"></i>'+dataJson.denominazione_regione+'</h4>'+
                    '<p><i class="fas fa-virus"></i>totale casi: '+dataJson.totale_positivi+'</p>'+
                    '<p><i class="far fa-calendar-alt"></i> aggiornato al  '+dataJson.data+'</p>';
    var description = e.features[0].properties.covid;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML(content).addTo(map);
  });

//   map.on("mouseleave", "covid", function () {
//     map.getCanvas().style.cursor = "";
//     popup.remove();
//   });
}
