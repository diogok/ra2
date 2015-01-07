
function render(tmpl,data){
  var t = document.getElementById(tmpl);
  var content = t.content.cloneNode(true);

  var els = content.querySelectorAll(".data");
  for(var i=0;i<els.length;i++) {
    for(var k in data) {
      if(typeof data[k]=='string' || typeof data[k]=='number') {
        var reg = new RegExp('{{'+k+'}}','g');
        els[i].innerHTML = els[i].innerHTML.replace(reg,data[k]);
      }
    }
  }

  var el = document.importNode(content,true);

  var r = {
    el: el,
    data: data,
    parent: null,
    to: function(element) {
      var parent = document.querySelector(element);
      parent.innerHTML='';
      var appended = parent.appendChild(el);
      r.parent = parent;
      return r;
    },
    into: function(element) {
      var parent = document.querySelector(element);
      var appended = parent.appendChild(el);
      r.parent = parent;
      return r;
    }
  }
  return r;
}

