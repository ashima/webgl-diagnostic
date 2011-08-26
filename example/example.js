function $$(i) { return document.getElementById(i); }

var out = {
  canvasid: "test-canvas", // string
  debug: { trouble: false,
	   supported: true }, // { trouble: bool; supported: bool } option
  // unit -> unit
  reset: function () {
    $$("change-webgl").style.display = "none";
    $$("upgrade-webgl").style.display = "none";
    $$("plugin-webgl").style.display = "none";
    $$("plugin-webgl-pluginlist").innerHTML = "";
    $$("experimental-plugin-webgl").style.display = "none";
    $$("experimental-change-webgl").style.display = "none";
    $$("trouble-webgl").style.display = "none";
    $$("trouble-webgl-anon").style.display = "none";
    $$("trouble-webgl-known").style.display = "none";
    $$("trouble-webgl-nodriver").style.display = "none";
    $$("trouble-webgl-driver").style.display = "none";
    $$("ok-webgl").style.display = "none";
    $$("ok-webgl-experimental").style.display = "none";
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
    $$("change-webgl-browser").innerHTML = b.name+" "+b.version;
    $$("change-webgl-platform").innerHTML = p.id;
    $$("change-webgl-browserlist").innerHTML = bl.join("");
    $$("change-webgl").style.display = "block";
  },
  // browser -> url -> unit
  upgrade: function(b,url) {
    $$("upgrade-webgl-browser").innerHTML = b.name+" "+b.version;
    $$("upgrade-webgl-link").innerHTML =
      "<a href='"+url+"'>"+$$("upgrade-webgl-link").innerHTML+"</a>";
    $$("upgrade-webgl").style.display = "block";
  },
  // browser -> url label -> unit
  plugin: function (b,link) {
    $$("plugin-webgl-browser").innerHTML = b.name+" "+b.version;
    $$("plugin-webgl-pluginlist").innerHTML =
      $$("plugin-webgl-pluginlist").innerHTML
      +"<a href='"+link.v.download+"'>"+link.label+"</a>";
    $$("plugin-webgl").style.display = "block";
  },
  // browser -> url label -> unit
  experimental_plugin: function (b,link) { }, // TODO
  // browser -> url label -> unit
  experimental_change: function (b,link) { }, // TODO
  // browser -> url -> url label option -> unit
  trouble: function(b,url,driver) {
    if (b == null) {
      $$("trouble-webgl-anon").style.display = "block";
    } else {
      var s = $$("trouble-webgl-support");
      s.innerHTML = "<a href='"+url+"'>"+s.innerHTML+"</a>";
      $$("trouble-webgl-browser").innerHTML = b.name;
      $$("trouble-webgl-known").style.display = "block";
    }

    if (driver == null) {
      $$("trouble-webgl-nodriver").style.display = "block";
    } else {
      var l = $$("trouble-webgl-driver-link");
      l.innerHTML = "<a href='"+driver.v+"'>"+l.innerHTML+"</a>";
      $$("trouble-webgl-driver-vendor").innerHTML = driver.label;
      $$("trouble-webgl-driver").style.display = "block";
    }
    $$("trouble-webgl").style.display = "block";
  },
  // unit -> unit
  ok: function() {
    if (WebGLDiagnostic.context_id != "webgl") {
      // TODO: can't use id for multilingual messages
      $$("ok-webgl-experimental").style.display = "block";
    }
    $$("ok-webgl").style.display = "block";
  }
};
