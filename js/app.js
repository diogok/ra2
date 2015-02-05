
function app() {
  var gbif="http://api.gbif.org/v1";

  route("/index",function() {
    render('index-tmpl',{}).to('#content');
  });

  route("/search",function(params){
    loading();
    render('search-tmpl',{}).to('#content');

    reqwest({
      url: gbif+'/species/suggest?rank=SPECIES&q='+encodeURIComponent(params.query)+'&callback=?',
      type: 'jsonp',
      success: function(data) {
        unloading();
        document.querySelector("#result ul").innerHTML = "";
        for(var i=0;i<data.length;i++) {
          var name = data[i].canonicalName;
          var tmpl = render('result-tmpl',{name:name});
          var link = tmpl.el.querySelector("a");
          link.setAttribute('href',link.getAttribute('href')+name);
          link.innerHTML=name;
          tmpl.into('#result ul');
        }
      },
      error: function(a,b) {
        document.getElementById("result").innerHTML = "Sorry, nothing found.";
      }
    });

    return;
  });

  route("/specie",function(params){
    loading();

    analysis(params.name,function(data){
        console.log(data);
        render('specie-tmpl',data).to('#content');
        chart(data);
        map(data.points,{EOO: data.eoo_polygon, AOO: data.aoo_polygon, Populations: data.populations_polygon});
        unloading();
    });

    function chart(occurrences) {
      var ctx = document.getElementById("chart").getContext("2d");
      var options= {};
      var data   = {
        labels: ["Precision","Completeness","Accuracy","Foo","Bar"],
        datasets: [
          {
            label: "Data",
            data:[50,20,30,40,10]
          }
        ]
      };
      var qualityChart = new Chart(ctx).Radar(data, options);
    }

    function map(occurrences,polis) {
      var div = document.createElement("div");
      div.setAttribute("id","map");
      document.getElementById('map-in').appendChild(div);

      //var map = L.map('map',{crs:L.CRS.EPSG3857}).setView([51.505, -0.09], 1);
      var map = L.map('map').setView([51.505, -0.09], 1);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);

      var land = L.tileLayer('http://{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png')//.addTo(map);
      var ocm = L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png').addTo(map);
      var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png')//.addTo(map);

      var base = { Landscape: land, OpenCycleMap: ocm, OpenStreetMap: osm };

      var markers = new L.MarkerClusterGroup();

      for(var i=0;i<occurrences.length;i++) {
        markers.addLayer(L.marker([occurrences[i].decimalLatitude, occurrences[i].decimalLongitude]));
      }

      var layers={Points: markers};

      for(var i in polis) {
        console.log(i,polis[i]);
        layers[i] = L.geoJson(polis[i]).addTo(map);
      }

      L.control.layers(base,layers).addTo(map);
      L.control.scale().addTo(map);

      map.addLayer(markers);
    };
  });

  routeStart();
  routeBind();
  unloading();

  function loading() {
    document.getElementById('loading').style.display='block';
  }

  function unloading() {
    document.getElementById('loading').style.display='none';
  }
}

