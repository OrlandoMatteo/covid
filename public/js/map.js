map.on("load", function () {
  map.resize();
  geteChoropleth();
});

function geteChoropleth() {
  $.ajax({
    type: "GET",
    url:
      "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-province-latest.json",
    datatype: "json",
    success: function (response) {
      plotChoropleth(JSON.parse(response));
    },
  });
}
function plotChoropleth(data) {
  for (var i = 0; i < geojson.features.length; i++) {
    for (var j = 0; j < data.length; j++) {
      if (
        data[j].codice_provincia ==
        geojson.features[i].properties.prov_istat_code_num
      ) {
        geojson.features[i].properties.covid = data[j].totale_casi;
        geojson.features[i].properties.data = data[j];
      }
    }
  }

  map.addSource("province", {
    type: "geojson",
    data: geojson,
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
        "#FFFB33",
        1000,
        "#FFFB33 ",
        10000,
        "#FF4633 ",
        100000,
        "#850E0E ",
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
        "#FFFB33",
        1000,
        "#FFFB33 ",
        10000,
        "#FF4633 ",
        100000,
        "#850E0E ",
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
    var content = '<h4><i class="fas fa-map-marked-alt"></i>'+dataJson.denominazione_provincia+'</h4>'+
                    '<p><i class="fas fa-virus"></i>totale casi: '+dataJson.totale_casi+'</p>'+
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
