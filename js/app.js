
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
        if(!data){
          unloading();
          location.hash="#/index";
          return;
        }
        render('specie-tmpl',data).to('#content');
        chart(data.quality);
        var layers = { };
        for(var i in data) {
          if(typeof data[i] == 'object') {
            if(typeof data[i]['geo'] == 'object') {
              //layers[i] = data[i]['geo'];
            } else {
              for(var k in data[i]) {
                if(typeof data[i][k] == 'object' && typeof data[i][k]['geo'] == 'object') {
                  layers[i+" "+k] = data[i][k]['geo'];
                }
              }
            }
          }
        }
        map(data.points.all,layers);
        unloading();
    });

    function chart(info) {
      var labels = [];
      var data   = [];

      for(var l in info) {
        labels.push(l);
        data.push(info[l].toFixed(2));
      }

      var ctx = document.getElementById("chart").getContext("2d");
      var options= {};
      var data   = {
        labels: labels,
        datasets: [
          {
            label: "Data",
            data: data
          }

        ]
      };
      var qualityChart = new Chart(ctx).Radar(data, options);
    }

    function map(occurrences,data) {
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
        var m = L.marker([occurrences[i].decimalLatitude, occurrences[i].decimalLongitude]);
        /* // TOO BIG!
        var html = "<table>";
        for(var k in occurrences[i]) {
          html += "<tr><td>"+k+"</td><td>"+occurrences[i][k]+"</td></tr>";
        }
        html += "</table>";
        m.bindPopup(html);
        */
        (function(occ,m) {
          m.on('click',function(e){
            console.log("clicked occurrence:",occ);
          });
        })(occurrences[i],m);
        markers.addLayer(m);
      }
      map.addLayer(markers);

      var layers={};

      for(var i in data) {
        layers[i] = L.geoJson(data[i]).addTo(map);
      }

      L.control.layers(base,layers).addTo(map);
      L.control.scale().addTo(map);

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

