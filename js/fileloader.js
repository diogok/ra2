
function file_loader(sel,fun,append) {

  var dropper = document.querySelector(sel);

  dropper.addEventListener('dragover',stop,false);
  dropper.addEventListener('dragleave',stop,false);
  dropper.addEventListener("drop",drop,false);

  function drop(e) {
    stop(e);
    dropper.className = 'reading';

    var done=0;
    var todo=0;
    var files = e.target.files || e.dataTransfer.files;
    var ready=false;
    for (var i = 0; i< files.length; i++) {
      if(files[i].type=='text' || files[i].type == 'application/json' || files[i].type == '' || files[i].type == 'text/csv') {
        todo++;
        (function(c){ // this is some ugly...
          var reader = new FileReader();
          reader.onload = function(e){
            // TODO: should I check readyState?
            files[c].content = e.target.result;
            done++;
            console.log(todo,done);
            if(ready && done == todo) {
              dropper.className='';
              fun(files);
            }
          };
          reader.readAsText(files[i]);
        })(i); // ... very ugly, workaround.
      }
    }
    ready=true;
    if(todo ==0 || done==todo){
      dropper.className='';
      fun(files);
    }
  }

  function stop(e) {
      e.preventDefault();
      //e.stopPropagation();
      dropper.className = (e.type == "dragover" ? "hover" : "");
  };

  if(append) {
    var chooser = document.createElement("input");
    chooser.setAttribute("type","file");
    chooser.setAttribute("multiple","true");
    chooser.setAttribute("name","file");
    chooser.addEventListener("change",drop,false);
    chooser.style.display='none';

    dropper.appendChild(chooser);

    dropper.onclick = function() {
      chooser.click();
    };
  }

};

function default_loader(files){
  // TODO: check if all valid input files
  // TODO: convert types
  for(var i=0;i<files.length;i++) {
    try {
      if(files[i].type == 'text/csv') {
        files[i].data = Papa.parse(files[i].content,{header:true}).data;
      } else if(files[i].type =='application/json'){
        files[i].data = JSON.parse(files[i].content);
      } else if (files[i].type == '' && files[i].name.match(/\.geojson$/)) {
        var geo = JSON.parse(files[i].content);
        files[i].data = [];
        for(var c=0;c<geo.features.length;c++) {
          var data = {};
          for(var k in geo.features[c].properties) {
            data[k] = geo.features[c].properties[k];
          }
          if(geo.features[c].geometry.type == 'Point') {
            data.decimalLongitude = geo.features[c].geometry.coordinates[0];
            data.decimalLatitude = geo.features[c].geometry.coordinates[1];
          }
          files[i].data.push(data);
        }
      } else {
        console.log('what is this file?',files[i]);
      }
    } catch(e) {
      console.log('something is wrong:',e);
    }
  }
};

