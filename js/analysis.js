
var dwcs='http://cncflora.jbrj.gov.br/dwc_services/api/v1';

if(location.hostname =='localhost') dwcs='http://localhost:3000/api/v1';

function analysis(name,fun) {

  get_occurrences(name,function(occurrences) {
      if(occurrences.length < 1000 || confirm("This species have more than 1000 ocurrences, some calculations may be limited and take up to two minutes.")) {
        get_analysis(occurrences,function(analysis){
          data = analysis;

          data["name"] = name;

          data['risk-assessment'] = analysis['risk-assessment'][0];
          data['risk-assessment'].date = new Date().toLocaleString();

          data["category"] = data['risk-assessment']['category'];

          for(var i in analysis) {
            if(typeof analysis[i] == 'object') {
              for(var k in analysis[i]) {
                if(typeof analysis[i][k] == 'number') {
                   //analysis[i][k] = analysis[i][k].toFixed(2).toLocaleString();
                } else if(typeof analysis[i][k] == 'object') {
                  for(var o in analysis[i][k]) {
                    if(typeof analysis[i][k][o] == 'number') {
                      analysis[i][k][o] = analysis[i][k][o].toFixed(2).toLocaleString();
                    }
                  }
                }
              }
            }
          }

          get_iucn(name,function(iucn){
            if(iucn != null) {
              data["risk-assessment"].iucn =iucn;
            } else {
              data["risk-assessment"].iucn = {category:'N/A'}
            }
            fun(data);
          });

        });
      } else {
        fun(false);
      }
    }
  );
}

function get_occurrences(name,fun,occs,offset) {
  var limit = 1200;
  //if(location.hostname=='localhost') limit=300;

  reqwest({
    url: dwcs+'/search/gbif?fixes=true&limit='+limit+'&field=scientificName&value='+encodeURIComponent(name),
    type: 'jsonp',
    success: function(resp) {
      fun(resp.results);
    }
  });
};

function clean(occs,fun) {
  reqwest({
    url: dwcs+'/fix'
    , type: 'json'
    , method: 'post'
    , contentType: 'application/json'
    , crossOrigin: true
    , data: JSON.stringify(occs)
    , success: function(resp) {
      fun(resp);
    }
  });
};


function get_analysis(occs,fun) {
  reqwest({
    url: dwcs+'/analysis/all'
    , type: 'json'
    , method: 'post'
    , contentType: 'application/json'
    , crossOrigin: true
    , data: JSON.stringify(occs)
    , success: function(resp) {
      fun(resp);
    }
  });
};

function get_iucn(name,fun) {
  var url = "http://api.iucnredlist.org/index/species/"+encodeURIComponent(name.replace(" ","-"))+".js"
  reqwest({
    url: url
    , type: 'jsonp'
    , method: 'get'
    , success: function(resp) {
      if(resp[0]) {
        fun(resp[0]);
      } else {
        fun(null);
      }
    }
  });
}

