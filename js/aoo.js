
// IT IS WRONG
function calc_aoo(occurrences) {

  var points = [];
  for(var i=0;i<occurrences.length;i++) {
    var lat = parseInt(occurrences[i].decimalLatitude * 100)
    var lng = parseInt(occurrences[i].decimalLongitude * 100)
    points.push([lat,lng]);
  }

  var max_lat = -9000;
  var max_lng = -18000;

  var min_lat = 9000;
  var min_lng = 18000;

  for(var i=0;i<points.length;i++) {
    max_lat = Math.max(max_lat,points[i][0]);
    max_lng = Math.max(max_lat,points[i][1]);
    min_lat = Math.min(min_lat,points[i][0]);
    min_lng = Math.min(min_lat,points[i][1]);
  }

  var grid_20km = [];

  var step=20;

  for(var lng=min_lng;lng<max_lng;lng+=step) {
    for(var lat=min_lat;lat<max_lat;lat+=step) {
      grid_20km.push([[lat,lng],[lat+step,lng],[lat+step,lng+step],[lat,lng+step]]);
    }
  }

  var grid_20km_match={};
  for(var g=0;g<grid_20km.length;g++) {
    for(var p=0;p<points.length;p++) {
      if(contains(grid_20km[g],points[p])) {
        var key = JSON.stringify(grid_20km[g]);
        if(typeof grid_20km_match[key] == 'undefined') {
          grid_20km_match[key] = {grid: grid_20km[g], points: []}
        }
        grid_20km_match[key].points.push(points[p]);
      }
    }
  }

  var data={
    area: 0.0,
    polygon: {
      type: 'MultiPolygon',
      coordinates: [ ]
    } 
  };

  for(var key in grid_20km_match) {

    var points = grid_20km_match[key].points;

    var grid_2km=[];

    var max_lat = -9000;
    var max_lng = -18000;
    var min_lat = 9000;
    var min_lng = 18000;

    for(var i=0;i<points.length;i++) {
      max_lat = Math.max(max_lat,points[i][0]);
      max_lng = Math.max(max_lat,points[i][1]);
      min_lat = Math.min(min_lat,points[i][0]);
      min_lng = Math.min(min_lat,points[i][1]);
    }

    var step=2;

    for(var lng=min_lng;lng<max_lng;lng+=step) {
      for(var lat=min_lat;lat<max_lat;lat+=step) {
        grid_2km.push([[lat,lng],[lat+step,lng],[lat+step,lng+step],[lat,lng+step]]);
      }
    }

    var grid_2km_match={};
    for(var g=0;g<grid_2km.length;g++) {
      for(var p=0;p<points.length;p++) {
        if(contains(grid_2km[g],points[p])) {
          var key = JSON.stringify(grid_2km[g]);
          if(typeof grid_2km_match[key] == 'undefined') {
            grid_2km_match[key] = {grid: grid_2km[g], points: []}
          }
          grid_2km_match[key].points.push(points[p]);
        }
      }
    }

    for(var k2 in grid_2km_match) {
      data.area += 4;
      data.polygon.coordinates.push( [ [ grid_2km_match[k2].grid.map(function(p){ return [p[0]/100,p[1]/100]; }) ] ] );
    }

  }

  return data;
}

function contains(cell,point) {
  return (
    point[0] >= cell[0][0]
    && 
    point[1] >= cell[0][1]
    &&
    point[0] <= cell[2][0]
    &&
    point[1] <= cell[2][1]
  );
}

