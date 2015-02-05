
var dwcs='http://cncflora.jbrj.gov.br/dwc_services/api/v1';
dwcs='http://localhost:3000/api/v1';
var gbif="http://api.gbif.org/v1";

function analysis(name,fun) {

  get_occurrences(name,function(occurrences) {
      var points = occurrences.filter(function(a) {
          return (typeof a.decimalLatitude == 'number' && typeof a.decimalLongitude == 'number');
      });

      var to_calc  = points.map(function(occ) {
          return {decimalLatitude: occ.decimalLatitude, decimalLongitude: occ.decimalLongitude};
      });

      get_analysis(to_calc,function(analysis){
        var data = {
          name: name,
          eoo: analysis.eoo.area.toLocaleString(),
          aoo: analysis.aoo.area.toLocaleString(),
          populations: analysis.populations.area.toLocaleString(),
          n_populations: analysis.populations.n_populations,
          eoo_polygon: analysis.eoo.polygon,
          aoo_polygon: analysis.aoo.grid,
          populations_polygon: analysis.populations.populations,
          date: new Date().toLocaleString(),
          count: occurrences.length,
          count_points: points.length,
          occurrences: occurrences,
          points: points
        };

        fun(data);
      });

    }
  );
}

function get_occurrences(name,fun,occs,offset) {
  var limit = 300;
  if(typeof occs == 'undefined') {
    occs = [];
  }
  if(typeof offset == 'undefined') {
    offset = 0;
  }

  reqwest({
    url: gbif+'/occurrence/search?limit='+limit+'&scientificName='+encodeURIComponent(name)+'&offset='+offset,
    type: 'jsonp',
    success: function(resp) {
      var result = occs.concat(resp.results);
      if(resp.endOfRecords) {
        fun(result);
      } else {
        //get_occurrences(name,fun,result,offset + limit);
        fun(result);
      }
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



