
var dwcs='http://dwc-01-1.diogok.cont.tutum.io:8080/api/v1';
var gbif="http://api.gbif.org/v1";

var limit = (20 * 300);

if(location.hostname =='localhost') dwcs='http://localhost:3000/api/v1';

function analysis_by_data(data,fun) {
  clean(data,function(occs){
    get_analysis_by_data(occs,loaded(null,fun));
  });
};

function analysis_by_name(name,fun) {
  get_count(name,function(n){
    if(n < limit || confirm('This specie have '+n+' occurrences, but only '+limit+' will be loaded, and that may take up to a minute. Continue?')) {
      get_analysis_by_name(name,loaded(name,fun));
    } else {
      fun(null);
    }
  });
}

function loaded(name,fun){
  return function(analysis) {
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

    if(name!=null) {
      get_iucn(name,function(iucn){
        if(iucn != null) {
          data["risk-assessment"].iucn =iucn;
        } else {
          data["risk-assessment"].iucn = {category:'N/A'}
        }
        fun(data);
      });
    } else {
      fun(data);
    }
  }
}



function get_count(name,fun) {
  reqwest({
    url: gbif+'/occurrence/search?limit=1&scientificName='+encodeURIComponent(name)+'&offset=0',
    type: 'jsonp',
    success: function(resp) {
      fun(resp.count);
    }
  });
}


function get_analysis_by_name(name,fun) {
  var url1 = dwcs+'/search/gbif?fixes=true&limit='+limit+'&field=scientificName&value='+encodeURIComponent(name)
  reqwest({
      url: dwcs+'/analysis/all?url='+encodeURIComponent(url1)
    , type: 'jsonp'
    , method: 'get'
    , success: function(resp) {
      fun(resp);
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


function get_analysis_by_data(occs,fun) {
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

