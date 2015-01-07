
_routes = {}
route = function(url,fun) {
    _routes[url] = fun;
};

function execute(url) {
    var parts = url.substring(1).split("?");
    var hash=parts[0];
    var query=parts[1];

    var params = {};
    
    var tmp = (query!=undefined? query : "").split("&")
                    .map(function(p) { return p.match(/([\w]+)=([^&]+)/);})
                    .filter(function(p) { return p != null && p.length==3;})
                    .map(function(p) { return p.slice(1);});
    for(var i=0;i<tmp.length;i++) {
        var key=tmp[i][0], value=tmp[i][1];
        params[key]=decodeURIComponent( value );
    }

    // TODO: deal with query strings
    for(var url in _routes) {
        var regex = RegExp("^"+url.replace(/:[^\/]+/g,"([^/]+)")+"$");
        var cap = hash.match(regex);
        if(cap != null) {
            params.self= cap[0];
            var vars = url.match(/:([^\/]+)/g);
            if(vars != null) {
                for(var v=0;v<vars.length;v++) {
                    params[vars[v].substring(1)] = cap[v+1];
                }
            }
            _routes[url](params);
            break;
        }
    }
};

oldFn = window.onhashchange ;

window.onhashchange = function() {
  var parts = location.hash.substring(1).split("?");
  var hash =parts[0];
  var page =hash.substring(1).replace("_","-").replace(/\//g,"-")
  var html =document.querySelector("html");

  html.setAttribute("id",page+'-page');

  var classs = html.getAttribute("class");
  if(classs) {
    classs = classs.replace(/[a-zA-Z0-9-_]*-section/,'')
  } else {
    classs = '';
  }

  var sections = page.split("-");
  for(var i=0;i<sections.length;i++) {
    classs += ' '+sections[i]+'-section';
  }
  html.setAttribute('class',classs);

  execute(location.hash);
  if(typeof oldFn == 'function') oldFn();
};


navigate = function(hash) {
    //location.hash="";
    setTimeout(function(){
        if(hash[0] == '#') hash=hash.substring(1);
        if(hash[0] != '/') hash="/"+hash;
        location.hash=hash;
    },100);
};

routeStart = function() {
    olH = location.hash;
    location.hash="";
    if(olH.length <= 1) olH='#/index'
    navigate(olH);
}

routeBind = function() {
  setInterval(function(){
    var forms = document.querySelectorAll('form');
    for(var i=0;i<forms.length;i++) {
      var form = forms[i];
      if(!form._got_route) {
        console.log('a',form);
        form.onsubmit = function() {
          var form = this;
          console.log('b',form);
          var url = form.getAttribute("action");
          if(!url.contains("?")) {
            url += "?";
          }
          console.log('c',url);
          var fields = document.querySelectorAll("input,select,textarea",form);
          console.log('d',fields);
          for(var i=0;i<fields.length;i++) {
            url += "&"+fields[i].getAttribute("name")+"="+encodeURIComponent(fields[i].value);
          }
          if(form.getAttribute('class') && form.getAttribute('class').contains("action")) {
            execute(url);
          } else {
            navigate(url);
          }
          return false;
        }
        form._got_route=true;
      }
    }

    var as=document.querySelectorAll("a");
    for(var i=0;i<as.length;i++) {
      var a = as[i];
      if(!a._got_route) {
        var go=function() {
          var a = this;
          if(a.getAttribute('class') && a.getAttribute('class').contains('action')) {
            execute(link.getAttribute("href"));
          } else {
            navigate(link.getAttribute("href"));
          }
          return false;
        };
        a.onclick=go;
        a.ontap=go;
        a._got_route=true;
      }
    }

  },1000/30);
}

