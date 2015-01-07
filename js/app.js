
function app() {

  route("/index",function() {
    render('index-tmpl',{}).to('#content');
  });

  route("/search",function(params){
    render('search-tmpl',{}).to('#content');

    navigate("/specie")
    return;

  });

  route("/specie",function(params){
    render('specie-tmpl',{}).to('#content');

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

    document.getElementById('open-map').onclick = function(){
      var div = document.createElement("div");
      div.setAttribute("id","map");
      document.getElementById('map-in').appendChild(div);

      var map = L.map('map').setView([51.505, -0.09], 13);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
      L.marker([51.5, -0.09]).addTo(map);

      document.getElementById('open-map').remove();
    }
  });

  route("/map",function(params) {
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

