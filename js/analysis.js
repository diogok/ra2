
function analysis(name,fun) {
  var dwcs='http://cncflora.jbrj.gov.br/dwc_services/api/v1';

  reqwest({
    url: dwcs+'/search/gbif?field=scientificName&value='+encodeURIComponent(params.name),
    type: 'jsonp',
    success: function(resp) {
      var data = {
        name: params.name,
        count: resp.count
      };
      reqwest({
          url: dwcs+'/fix',
          method: 'post',
          type:'json',
          contentType: 'application/json',
          crossOrigin: true,
          data: JSON.stringify(resp.results),
          success: function(resp) {
            console.log(resp);
            reqwest({
              url:dwcs+'/analysis/eoo',
              method: 'post',
              type:'json',
              contentType: 'application/json',
              crossOrigin: true,
              data: JSON.stringify(resp.results),
              success: function(resp) {
              }
            });
          }
        });
      fun({occurrences:[]});
    }
  });
}

