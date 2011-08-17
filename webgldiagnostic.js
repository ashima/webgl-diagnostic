function WebGLDiagnostic() {}

// string is haystack, subString is needle array
// versionSearch is version label, prop is alternative property existence test
// p is 0-indexed priority to delay very common needle searches
WebGLDiagnostic.browsers = {
    "Chrome" :
    { string: navigator.userAgent, subString: ["Chrome"],
      name: "Google Chrome",
      urls:
      { trouble: "http://www.google.com/support/chrome/bin/answer.py?answer=1220892",
	download: "http://www.google.com/chrome/",
	upgrade: "http://www.google.com/support/chrome/bin/answer.py?answer=95346"} },

    "OmniWeb" :
    { string: navigator.userAgent, subString: ["OmniWeb"],
      versionSearch: "OmniWeb/", name: "OmniWeb" },

    "Safari" :
    { string: navigator.vendor, subString: ["Apple"],
      versionSearch: "Version", name: "WebKit Developer Build",
      urls:
      { trouble: "http://www.webkit.org/blog/603/webgl-now-available-in-webkit-nightlies/",
	download: "http://www.webkit.org/",
	upgrade: "http://www.webkit.org/" },
      platforms:
      { "iPhone/iPod": { trouble: "http://www.apple.com/support/iphone/",
			 upgrade: "http://www.apple.com/ios/"},
	"iPad": { trouble: "http://www.apple.com/support/ipad/",
		  upgrade: "http://www.apple.com/ios/"},
	"Mac": { trouble: "http://www.webkit.org/blog/603/webgl-now-available-in-webkit-nightlies/",
		 upgrade: "http://www.webkit.org/"}
      }},

    "Android" :
    { string: navigator.userAgent, subString: ["Android"],
      name: "Google Android" },

    "Opera" :
    { prop: window.opera, name: "Opera" },
    
    "iCab" :
    { string: navigator.vendor, subString: ["iCab"], name: "iCab" },
    
    "Konqueror" :
    { string: navigator.vendor, subString: ["KDE"],
      name: "Konqueror" },
    
    "Camino" :
    { string: navigator.vendor, subString: ["Camino"],
      name: "Camino" },

    // for newer Netscapes (6+)
    "Netscape" :
    { string: navigator.userAgent, subString: ["Netscape","Navigator"],
      versionSearch: "Netscape",
      name: "Netscape Navigator" },

    "Explorer" :
    { string: navigator.userAgent, subString: ["MSIE"],
      versionSearch: "MSIE", name: "Microsoft Internet Explorer",
      urls:
      { trouble: "http://www.google.com/support/chrome/bin/answer.py?answer=1220892",
	download: "http://code.google.com/chrome/chromeframe/",
	upgrade: "http://code.google.com/chrome/chromeframe/" } },

    "Firefox" :
    { p: 1, string: navigator.userAgent, subString: ["Firefox"],
      name: "Mozilla Firefox",
      urls: { trouble: "https://support.mozilla.com/en-US/kb/how-do-i-upgrade-my-graphics-drivers",
	      download: "http://www.mozilla.com/en-US/firefox/new/",
	      upgrade: "http://www.mozilla.com/en-US/firefox/new/" } },

    "Mozilla" :
    { p: 2, string: navigator.userAgent, subString: ["Gecko"],
      versionSearch: "rv", name: "Mozilla Suite" },

    // for older Netscapes (4-)
    "OldNetscape" :
    { p: 3, string: navigator.userAgent, subString: ["Mozilla"],
      versionSearch: "Mozilla", name: "Netscape Navigator" },

    "unknown" :
    { p: 4, string: navigator.userAgent, subString: [],
      name: "Unknown Browser" }
};

WebGLDiagnostic.platforms = {
    "Windows" : { string: navigator.platform, subString: ["Win"],
		  browsers: ["Chrome","Firefox"] },
    "Mac" : { string: navigator.platform, subString: ["Mac"],
	      browsers: ["Chrome","Firefox","Safari"] },
    "iPhone/iPod" : { string: navigator.userAgent, subString: ["iPhone"],
		      browsers: ["Firefox"] },
    "iPad" : { string: navigator.platform, subString: ["iPad"],
	       browsers: ["Firefox"] },
    "Android" : { string: navigator.userAgent, subString: ["Android"],
		  browsers: ["Firefox"] },
    "Linux" : { string: navigator.platform, subString: ["Linux"],
		browsers: ["Firefox","Chrome"] },
    "unknown" : { string: navigator.platform, subString: [],
		  browsers: ["Firefox","Chrome","Safari"] }
};

WebGLDiagnostic.browserHasWebGLVersion = function(browser) {
    if (browser.urls) { return true; }
    else { return false; }
};

WebGLDiagnostic.browserWithIdVersion = function(id,browser) {
    browser.id = id;
    var i, idx, vstart,
        vs = browser.versionSearch || id,
        vstrs = [navigator.userAgent,navigator.appVersion];
    for (i = 0; i < vstrs.length; i++) {
	idx = vstrs[i].indexOf(vs);
	if (idx >= 0) {
	    vstart = idx + vs.length + 1;
	    browser.version = parseFloat(vstrs[i].substring(vstart));
	    return browser;
	}
    }
    browser.version = 0;
    return browser;
};

WebGLDiagnostic.platformWithIdBrowsers = function(id,platform) {
    var i;
    platform.id = id;
    for (i = 0; i < platform.browsers.length; i++) {
	platform.browsers[i] = this.browsers[platform.browsers[i]];
	platform.browsers[i].id = i;
    }
    return platform;
};

WebGLDiagnostic.tableSize = function(table) {
    var k, count = 0;
    for (k in table) { if (table.hasOwnProperty(k)) { count++; } }
    return count;
};

WebGLDiagnostic.detectBrowser = function() {
    var diag = this, cr;
    function check(p,bd) {
	var bn, bv, delay = {};
	for (bn in bd) {
	    bv = bd[bn];
	    if (typeof(bv.p) == "undefined") { bv.p = 0; }
	    if (p >= bv.p) {
		if (bv.string) {
		    for (var i = 0; i < bv.subString.length; i++) {
			if (bv.string.indexOf(bv.subString[i]) != -1) {
			    return diag.browserWithIdVersion(bn,bv);
			}
		    }
		} else if (bv.prop) {
		    return diag.browserWithIdVersion(bn,bv);
		}
	    } else { delay[bn] = bv; }
	}
	if (diag.tableSize(delay) > 0) { return check(p+1,delay); }
	else { return null; }
    }
    cr = check(0,this.browsers);
    if (cr) { return cr; }
    else { return this.browserWithIdVersion("unknown",this.browsers["unknown"]); }
};

WebGLDiagnostic.detectPlatform = function() {
    var diag = this, cr;
    function check(pd) {
	var pn, pv;
	for (pn in pd) {
	    pv = pd[pn];
	    if (pv.string) {
		for (var i=0; i < pv.subString.length; i++) {
		    if (pv.string.indexOf(pv.subString[i]) != -1) {
			return diag.platformWithIdBrowsers(pn,pv);
		    }
		}
	    }
	}
	return null;
    }
    cr = check(this.platforms);
    if (cr) { return cr; }
    else { return this.platformWithIdBrowsers("unknown",this.platforms["unknown"]); }
};

WebGLDiagnostic.context_ids = [
"webgl","experimental-webgl","moz-webgl","webkit-3d" ];

WebGLDiagnostic.exts = [
"OES_texture_float","OES_texture_half_float","WEBKIT_lose_context",
"OES_standard_derivatives","OES_vertex_array_object" ];

WebGLDiagnostic.drivers = {
    "nvidia":"http://www.nvidia.com/Download/index.aspx",
    "ati":"http://support.amd.com/us/gpudownload/Pages/index.aspx",
    "osx":"http://www.apple.com/macosx/"};

WebGLDiagnostic.caps = {
    "renderbuffer_depth":function(gl) {
	var rbdepth, db = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER,db);
	gl.renderbufferStorage(gl.RENDERBUFFER,
			       gl.DEPTH_COMPONENT16,
			       1,1);
	rbdepth = gl.getRenderbufferParameter(gl.RENDERBUFFER,
					      gl.RENDERBUFFER_DEPTH_SIZE);
	gl.deleteRenderbuffer(db);
	return rbdepth;
    }
};

WebGLDiagnostic.isWebGLSupported = function() {
  return "WebGLRenderingContext" in window;
};

WebGLDiagnostic.webGLContext = function(canvasid) {
  var gl, c = document.getElementById(canvasid), i;

  for ( i=0; i < this.context_ids.length; i++) {
      try { gl = c.getContext(this.context_ids[i]); }
      catch (x) { return null; }
      if (gl != null) { this.context_id = this.context_ids[i]; return gl; }
  }
  return gl;
};

WebGLDiagnostic.driverLink = function(canvasid) {
    var gl = this.webGLContext(canvasid), renderer, v;
  if (!gl) { return null; }
  renderer = gl.getParameter(gl.RENDERER);

  if (navigator.userAgent.match(/Mac OS X/)) {
    if (navigator.userAgent.match(/Mac OS X 10[\s\S]6/)) {
      return null;
    } else {
      return this.drivers["osx"];
    }
  }

  for (v in this.drivers) {
    if ((new RegExp(v, "i")).test(renderer)) {
      return this.drivers[v];      
    }
  }
  return null;
};

WebGLDiagnostic.report = function(canvasid) {
    var info = "", gl, webglFunctional, params, vpdims, i, cap;

    info += "WebGL Support: ";
    
    function getExt(gl,ext) {
	if (gl.getExtension) {
            return (gl.getExtension(ext) != null);
	} else {
            return false;
	}
    }

    if (this.isWebGLSupported()) {
	info += "yes";
	
	gl = this.webGLContext(canvasid);
	
	webglFunctional = gl != null;
	
	if (webglFunctional) {
	    params = [
		["Version", gl.VERSION],
		["Vendor", gl.VENDOR],
		["Renderer", gl.RENDERER],
		["Shading Language", gl.SHADING_LANGUAGE_VERSION],
		["Max Texture Size", gl.MAX_TEXTURE_SIZE],
		["Subpixel bits", gl.SUBPIXEL_BITS],
		["Red bits", gl.RED_BITS],
		["Green bits", gl.GREEN_BITS],
		["Blue bits", gl.BLUE_BITS],
		["Alpha bits", gl.ALPHA_BITS],
		["Depth bits", gl.DEPTH_BITS],
		["Stencil bits", gl.STENCIL_BITS],
		["Max Vertex Attribs", gl.MAX_VERTEX_ATTRIBS],
		["Max Vertex Uniforms", gl.MAX_VERTEX_UNIFORM_VECTORS],
		["Max Varyings", gl.MAX_VARYING_VECTORS],
		["Max Combined Textures", gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS],
		["Max Vertex Textures", gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS],
                ["Max Textures", gl.MAX_TEXTURE_IMAGE_UNITS],
                ["Max Fragment Uniforms", gl.MAX_FRAGMENT_UNIFORM_VECTORS],
                ["Max Cube Map Size", gl.MAX_CUBE_MAP_TEXTURE_SIZE],
                ["Max Renderbuffer Size", gl.MAX_RENDERBUFFER_SIZE]
	    ];

	    info += " ("+this.context_id+")\n";
	    
	    for (i=0; i < params.length; i++) {
		info += params[i][0]+": "+gl.getParameter(params[i][1])+"\n";
	    }
	    
	    vpdims = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
	    if (vpdims != null) { vpdims = vpdims[0]+" x "+vpdims[1]; }
	    info += "Max Viewport Dims: "+vpdims+"\n";
	    
	    for (cap in this.caps) {
		info += cap+": "+this.caps[cap](gl)+"\n";
	    }
	    
	    info += "\n";

	    for (i=0; i < this.exts.length; i++) {
		info += this.exts[i]+": "+getExt(gl,this.exts[i])+"\n";
	    }
	} else {
	    info += " (but cannot acquire context)\n";
	}
    } else {
	info += "no\n";
    }
    info += "\n";
    info += "User Agent: "+navigator.userAgent+"\n";
    info += "Browser vendor: "+navigator.vendor+"\n";
    info += "Browser version: "+navigator.appVersion+"\n";
    info += "Browser language: "+navigator.language+"\n";
    info += "Available resolution: "+screen.availWidth+" x "+screen.availHeight+"\n";
    info += "Screen resolution: "+screen.width+" x "+screen.height+"\n";
    info += "Color depth: "+screen.colorDepth+"\n";
    info += "Pixel depth: "+screen.pixelDepth+"\n";
    
    return info;
};
