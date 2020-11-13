function getData() {
  $.ajax({
    type: "GET",
    url:
      "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json",
    datatype: "json",
    success: function (response) {
      firstPlot(JSON.parse(response));
    },
  });
}

function firstPlot(data) {
  positivi_div = document.getElementById("nuovi_positivi");
  deceduti_div = document.getElementById("deceduti");
  terapia_div = document.getElementById("terapia_intensiva");
  pos_tamp_div = document.getElementById("positivi_tamponi");
  date = [];
  positivi = [];
  terapia_intensiva = [];
  deceduti = [];
  positivi_tamponi = [(data[0].nuovi_positvi * 100) / data[0].tamponi];
  data.forEach((element) => date.push(element.data));
  data.forEach((element) => positivi.push(element.nuovi_positivi));
  data.forEach((element) => terapia_intensiva.push(element.terapia_intensiva));
  data.forEach((element) => deceduti.push(element.deceduti));

  for (i = 1; i < data.length; i++) {
    tamp_giorn = data[i].tamponi - data[i - 1].tamponi;
    positivi_tamponi.push((data[i].nuovi_positivi * 100) / tamp_giorn);
  }

  $("#num_nuovi_positivi").html(positivi[positivi.length - 1].toString());
  $("#nuovi_deceduti").html(deceduti[deceduti.length - 1].toString());
  $("#nuovi_terapia_intensiva").html(
    terapia_intensiva[terapia_intensiva.length - 1].toString()
  );
  $("#rapporto_positivi_tamponi").html(
    positivi_tamponi[positivi_tamponi.length - 1].toFixed(2)
  );

  var layout = {
    title: "Nuovi positivi",
    font: { family: "Capriola", size: 18 },
  };
  var config = { responsive: true };

  Plotly.newPlot(
    positivi_div,
    [
      {
        x: date,
        y: positivi,
      },
    ],
    layout,
    config
  );

  var layout = {
    title: "Deceduti",
    font: { family: "Capriola", size: 18 },
  };
  Plotly.newPlot(
    deceduti_div,
    [
      {
        x: date,
        y: deceduti,
      },
    ],
    layout,
    config
  );

  var layout = {
    title: "Terapia Intensiva",
    font: { family: "Capriola", size: 18 },
  };
  Plotly.newPlot(
    terapia_div,
    [
      {
        x: date,
        y: terapia_intensiva,
      },
    ],
    layout,
    config
  );

  var layout = {
    title: "Positivi vs .tamponi",

    font: { family: "Capriola", size: 18 },
  };
  Plotly.newPlot(
    pos_tamp_div,
    [
      {
        x: date,
        y: positivi_tamponi,
      },
    ],
    layout,
    config
  );
}
function plotChoropleth(response) {
  locations = [];
  z = [];
  for (i = 0; i < response.features.length; i++) {
    locations.push(response.features[i].geometry);
    z.push(response.features[i].properties.covid);
  }
}
