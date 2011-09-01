function $$(i) { return document.getElementById(i); }
var ns = "webgldiag-";
var pageids = {};
function insert(name,id) {
  if (typeof(pageids[name]) == "undefined") {
    pageids[name] = [];
  }
  pageids[name].push(id);
}
function map(name,fn) {
  var idl = pageids[name];
  if (typeof(idl) != "undefined") {
    for (var i = 0; i < idl.length; i++) {
      fn($$(ns+idl[i]));
    }
  }
}
function html(v) { return function (e) { e.innerHTML = v; }; }
function href(v) { return function (e) { e.href = v; }; }
function show(e) { e.style.display = "block"; }
function hide(e) { e.style.display = "none"; }

var out = {
  canvasid: "test-canvas", // string
  debug: { trouble: false,
	   supported: true }, // { trouble: bool; supported: bool } option
  // unit -> unit
  reset: function () {
    pageids["messages"] = ["change", "upgrade", "plugin",
			  "experimental-plugin", "experimental-change",
			  "trouble", "trouble-browser", "trouble-nobrowser",
			  "trouble-driver", "trouble-nodriver",
			  "ok", "ok-experimental"];
    map("messages",hide);
    pageids["lists"] = ["change-browser-list", "plugin-plugin-list"];
    map("lists",html(""));
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
    map("browser-name",html(b.name));
    map("browser-version",html(b.version));
    map("platform-name",html(p.id));
    html(bl.join(""))($$(ns+"change-browser-list"));
    show($$(ns+"change"));
  },
  // browser -> url -> unit
  upgrade: function(b,url) {
    map("browser-name",html(b.name));
    map("browser-version",html(b.version));
    map("browser-upgrade",href(url));
    show($$(ns+"upgrade"));
  },
  // browser -> url label -> unit
  plugin: function (b,link) { // called once for each plugin
    var la = "<li><a href='"+link.v.download+"'>"+link.label+"</a></li>";
    map("browser-name",html(b.name));
    map("browser-version",html(b.version));
    var e = $$(ns+"plugin-plugin-list");
    e.innerHTML = e.innerHTML + la;
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
      map("browser-name",html(b.name));
      map("browser-trouble",href(url));
      show($$(ns+"trouble-browser"));
    }

    if (driver == null) {
      show($$(ns+"trouble-nodriver"));
    } else {
      map("driver-upgrade",href(driver.v));
      map("driver-vendor",html(driver.label));
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
