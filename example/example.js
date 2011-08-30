function $$(i) { return document.getElementById(i); }
function nmap(name,fn) {
  var es = document.getElementsByName(name);
  for (var i = 0; i < es.length; i++) { fn(es[i]); }
}
function html(v) { return function (e) { e.innerHTML = v; }; }
function href(v) { return function (e) { e.href = v; }; }
function show(e) { e.style.display = "auto"; }
function hide(e) { e.style.display = "none"; }
var ns = "webgldiag-";

var out = {
  canvasid: "test-canvas", // string
  debug: { trouble: false,
	   supported: true }, // { trouble: bool; supported: bool } option
  // unit -> unit
  reset: function () {
    nmap(ns+"browser-list",html(""));
    nmap(ns+"plugin-list",html(""));
    hide($$(ns+"change"));
    hide($$(ns+"upgrade"));
    hide($$(ns+"plugin"));
    hide($$(ns+"experimental-plugin"));
    hide($$(ns+"experimental-change"));
    hide($$(ns+"trouble"));
    hide($$(ns+"trouble-browser"));
    hide($$(ns+"trouble-nobrowser"));
    hide($$(ns+"trouble-driver"));
    hide($$(ns+"trouble-nodriver"));
    hide($$(ns+"ok"));
    hide($$(ns+"ok-experimental"));
  },
  // platform -> browser -> unit
  change: function(p, b) {
    var bl = [];
    for (var i = 0; i < p.browsers.length; i++) {
      var d = WebGLDiagnostic.decisions[p.browsers[i]];
      var name = WebGLDiagnostic.browsers[p.browsers[i]].name;
      var url;
      if (d.platforms && d.platforms[p.id] && d.platforms[p.id].download) {
	url = d.platforms[p.id].download;
      } else {
	url = d.download;
      }
      bl[bl.length] = "<li><a href='"+url+"'>"+name+"</a></li>";
    }
    nmap(ns+"browser-name",html(b.name));
    nmap(ns+"browser-version",html(b.version));
    nmap(ns+"platform-name",html(p.id));
    nmap(ns+"browser-list",html(bl.join("")));
    show($$(ns+"change"));
  },
  // browser -> url -> unit
  upgrade: function(b,url) {
    nmap(ns+"browser-name",html(b.name));
    nmap(ns+"browser-version",html(b.version));
    nmap(ns+"browser-upgrade",href(url));
    show($$(ns+"upgrade"));
  },
  // browser -> url label -> unit
  plugin: function (b,link) { // called once for each plugin
    var la = "<li><a href='"+link.v.download+"'>"+link.label+"</a></li>";
    nmap(ns+"browser-name",html(b.name));
    nmap(ns+"browser-version",html(b.version));
    nmap(ns+"plugin-list",function (e) { e.innerHTML = e.innerHTML + la; });
    show($$(ns+"plugin"));
  },
  // browser -> url label -> unit
  experimental_plugin: function (b,link) { }, // TODO
  // browser -> url label -> unit
  experimental_change: function (b,link) { }, // TODO
  // browser -> url -> url label option -> unit
  trouble: function(b,url,driver) {
    if (b == null) {
      show($$(ns+"trouble-nobrowser"));
    } else {
      nmap(ns+"browser-name",html(b.name));
      nmap(ns+"browser-trouble",href(url));
      show($$(ns+"trouble-browser"));
    }

    if (driver == null) {
      show($$(ns+"trouble-nodriver"));
    } else {
      nmap(ns+"driver-upgrade",href(driver.v));
      nmap(ns+"driver-vendor",html(driver.label));
      show($$(ns+"trouble-driver"));
    }
    show($$(ns+"trouble"));
  },
  // unit -> unit
  ok: function() {
    if (WebGLDiagnostic.context_id != "webgl") {
      show($$(ns+"experimental-ok"));
    }
    show($$(ns+"ok"));
  }
};
