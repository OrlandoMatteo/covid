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

  var diff_pos=positivi[positivi.length - 1]-positivi[positivi.length - 2]
  if (diff_pos>0){
    $("#diff_pos")[0].classList.add("red")
    $("#diff_pos").html("+"+diff_pos.toString());
  }
  else{
    $("#diff_pos")[0].classList.add("green");
    $("#diff_pos").html(diff_pos.toString());
  }
  

  

  var nuovi_deceduti=deceduti[deceduti.length - 1]-deceduti[deceduti.length - 2]
  var ieri_deceduti=deceduti[deceduti.length - 2]-deceduti[deceduti.length - 3]
  var diff_deceduti=nuovi_deceduti-ieri_deceduti

  $("#nuovi_deceduti").html(nuovi_deceduti.toString());
  if (diff_deceduti>0){
    $("#diff_dec")[0].classList.add("red")
    $("#diff_dec").html("+"+diff_deceduti.toString());
  }
  else{
    $("#diff_dec")[0].classList.add("green")
    $("#diff_dec").html(diff_deceduti.toString());
  }

  var diff_terapia=terapia_intensiva[terapia_intensiva.length - 1]-terapia_intensiva[terapia_intensiva.length - 2]
  $("#nuovi_terapia_intensiva").html(
    terapia_intensiva[terapia_intensiva.length - 1].toString()
  );

  if (diff_terapia>0){
    $("#diff_int")[0].classList.add("red")
    $("#diff_int").html("+"+diff_terapia.toString());
  }
  else{
    $("#diff_int")[0].classList.add("green")
    $("#diff_int").html(diff_terapia.toString());
  }


  $("#rapporto_positivi_tamponi").html(
    positivi_tamponi[positivi_tamponi.length - 1].toFixed(2)
  );
  var diff_pos_tamp=positivi_tamponi[positivi_tamponi.length - 1]-positivi_tamponi[positivi_tamponi.length - 2]
  if (diff_pos_tamp>0){
    $("#diff_pos_tamp")[0].classList.add("red")
    $("#diff_pos_tamp").html("+"+diff_pos_tamp.toFixed(2));
  }
  else{
    $("#diff_pos_tamp")[0].classList.add("green")
    $("#diff_pos_tamp").html(diff_pos_tamp.toFixed(2));
  }
   var giorno=data[data.length-1].data

  var config = { responsive: true };
  var layout = {
    title: "Nuovi positivi",
    font: { family: "Capriola", size: 18 },
    annotations: [],
    margin: {
      autoexpand: false,
      l: 50,
      r: 50,
      t: 100
    }
  };
  var annotation= {
    xref: 'x',
    yref: 'y',
    x: giorno,
    y: positivi[positivi.length-1],
    xanchor: 'left',
    yanchor: 'right',
    text: positivi[positivi.length-1],
    font: {
      family: 'Capriola',
      size: 16,
      color: 'black'
    },
    showarrow: true
  };
  layout.annotations.push(annotation)


  Plotly.newPlot(
    positivi_div,
    [
      {
        x: date,
        y: positivi
      },
    ],
    layout,
    config
  );

  var layout = {
    title: "Deceduti",
    font: { family: "Capriola", size: 18 },
    annotations: [],
    margin: {
      autoexpand: false,
      l: 50,
      r: 50,
      t: 100
    }
  };
  var annotation= {
    xref: 'x',
    yref: 'y',
    x: giorno,
    y: deceduti[deceduti.length-1],
    xanchor: 'left',
    yanchor: 'right',
    text: deceduti[deceduti.length-1],
    font: {
      family: 'Capriola',
      size: 16,
      color: 'black'
    },
    showarrow: true
  };
  layout.annotations.push(annotation)
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
    annotations: [],
    margin: {
      autoexpand: false,
      l: 50,
      r: 50,
      t: 100
    }
  };
  var annotation= {
    xref: 'x',
    yref: 'y',
    x: giorno,
    y: terapia_intensiva[terapia_intensiva.length-1],
    xanchor: 'left',
    yanchor: 'right',
    text: terapia_intensiva[terapia_intensiva.length-1],
    font: {
      family: 'Capriola',
      size: 16,
      color: 'black'
    },
    showarrow: true
  };
  layout.annotations.push(annotation)
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
    annotations: [],
    margin: {
      autoexpand: false,
      l: 50,
      r: 50,
      t: 100
    }
  };
  var annotation= {
    xref: 'x',
    yref: 'y',
    x: giorno,
    y: positivi_tamponi[positivi_tamponi.length-1],
    xanchor: 'left',
    yanchor: 'right',
    text: positivi_tamponi[positivi_tamponi.length-1].toFixed(2),
    font: {
      family: 'Capriola',
      size: 16,
      color: 'black'
    },
    showarrow: true
  };
  layout.annotations.push(annotation)
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
