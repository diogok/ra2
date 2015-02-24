
function charts(data) {
  quality_summary(data.quality);
  quality_all(data.quality);
  occurrences(data);
}

function quality_summary(info) {
  var labels = [];
  var data   = [];

  for(var l in info) {
    if(typeof info[l] == 'number') {
      labels.push(l);
      data.push(info[l].toFixed(2));
    }
  }

  var ctx = document.getElementById("quality-summary").querySelector('canvas').getContext("2d");
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
  return new Chart(ctx).Radar(data, options);
}


function quality_all(info) {
  var labels = [];

  for(var l in info) {
    if(typeof info[l] == 'number') {
      labels.push(l);
    }
  }

  for(var l in labels.slice(0,-1)) {
    var div = document.createElement('div');
    div.setAttribute('class','pure-u-md-1-3');
    div.innerHTML = '<h4>'+labels[l]+'</h4>';
    var canvas2 = document.createElement('canvas');
    div.appendChild(canvas2);
    document.getElementById('quality-details').appendChild(div);

    var ctx2 = canvas2.getContext("2d");
    var data2 = [
      {
        label: 'Very Good (5)',
        color: 'rgba(100,200,100,0.5)',
        highlight: 'rgba(100,200,100,0.8)',
        value: 0
      },
      {
        label: 'Good (4)',
        color: 'rgba(100,180,100,0.5)',
        highlight: 'rgba(100,180,100,0.8)',
        value: 0
      },
      {
        label: 'Medium (3)',
        color: 'rgba(100,160,100,0.5)',
        highlight: 'rgba(100,160,100,0.8)',
        value: 0
      },
      {
        label: 'Bad (2)',
        color: 'rgba(100,140,100,0.5)',
        highlight: 'rgba(100,140,100,0.8)',
        value: 0
      },
      {
        label: 'Very Bad (1)',
        color: 'rgba(100,120,100,0.5)',
        highlight: 'rgba(100,120,100,0.8)',
        value: 0
      },
      {
        label: 'None (0)',
        color: 'rgba(100,100,100,0.5)',
        highlight: 'rgba(100,100,100,0.8)',
        value: 0
      }
    ];

    for(var i in info.grades) {
      var grade = info.grades[i][labels[l]];
      if(typeof grade == 'number'){
        data2[5 - grade].value += 1;
      }
    }

    new Chart(ctx2).Pie(data2,{});
  }
}

function occurrences(data) {
  var ctx = document.getElementById("occs-chart").querySelector('canvas').getContext("2d");
  var options= {scaleBeginAtZero : true, scaleShowGridLines : true};
  var data   = {
    labels: ['All','Recent','Historic'],
    datasets: [
      {
        label: 'Occurrences',
        fillColor: 'rgba(100,100,100,0.5)',
        highlightFill: 'rgba(100,100,100,0.8)',
        data: [data.occurrences.count,data.occurrences.count_recent,data.occurrences.count_historic]
      },
      {
        label: 'Points',
        fillColor: 'rgba(100,200,100,0.5)',
        highlightFill: 'rgba(100,200,100,0.8)',
        data: [data.points.count,data.points.count_recent,data.points.count_historic]
      }
    ]
  };
  console.log(data);
  return new Chart(ctx).StackedBar(data, options);
}

