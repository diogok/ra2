
var dwcs='http://cncflora.jbrj.gov.br/dwc_services/api/v1';
var gbif="http://api.gbif.org/v1";

function analysis(name,fun) {

  get_occurrences(name,function(occurrences) {
      var points = occurrences.filter(function(a) {
          return (typeof a.decimalLatitude == 'number' && typeof a.decimalLongitude == 'number');
      });

      var to_calc  = points.map(function(occ) {
          return {decimalLatitude: occ.decimalLatitude, decimalLongitude: occ.decimalLongitude};
      });

      get_eoo(to_calc,function(eoo){
          get_aoo(to_calc,function(aoo){
            var data = {
              name: name,
              eoo: eoo.area.toFixed(2),
              aoo: aoo.area.toFixed(2),
              eoo_polygon: eoo.polygon,
              aoo_polygon: aoo.polygon,
              date: new Date().toLocaleString(),
              count: occurrences.length,
              count_points: points.length,
              occurrences: occurrences,
              points: points
            };

            fun(data);
          });
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
        get_occurrences(name,fun,result,offset + limit);
      }
    }
  });

};


function get_eoo(occs,fun) {

  /*
  reqwest({
    url: dwcs+'/analysis/eoo'
    , type: 'json'
    , method: 'post'
    , contentType: 'application/json'
    , crossOrigin: true
    , data: JSON.stringify(occs)
    , success: function(resp) {
      fun(resp);
    }
  });
  */

  fun({
    area: 125.32,
    polygon: {
      type: "Polygon",
      coordinates: [ [ [ 20.2913, 10.1002 ], [ 30.2895, 30.0826 ], [35.0, 35.0], [ 20.2913, 10.1002 ]] ]
    }
  })

};

function get_aoo(occs,fun) {
  var aoo = calc_aoo(occs);
  console.log(aoo);
  return fun(aoo);
  fun({
    area: 125.32,
    polygon: {
      type: "Polygon",
      coordinates: [ [ [ 30.2913, 20.1002 ], [ 40.2895, 40.0826 ], [45.0, 45.0], [ 30.2913, 30.1002 ]] ]
    }
  })
};



