/**
 * @preserve Copyright 2011 David Sheets, Ashima Arts. All rights reserved.
 * Open source under an MIT-style license.
 * See https://github.com/ashima/webgl-diagnostic/ for more information.
 */
if (typeof(window["WebGLDiagnostic"])=="undefined") {
  WebGLDiagnostic = window["WebGLDiagnostic"] = {};
}

WebGLDiagnostic['caps'] = {
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

WebGLDiagnostic['_browserWithIdVersion'] = function(id,browser) {
    browser['id'] = id;
    var i, idx, vstart,
        vs = browser['versionSearch'] || id,
        vstrs = [navigator.userAgent,navigator.appVersion];
    for (i = 0; i < vstrs.length; i++) {
	idx = vstrs[i].indexOf(vs);
	if (idx >= 0) {
	    vstart = idx + vs.length + 1;
	    browser['version'] = parseFloat(vstrs[i].substring(vstart));
	    return browser;
	}
    }
    browser['version'] = 0;
    return browser;
};

WebGLDiagnostic['_platformWithId'] = function(id,platform) {
    platform['id'] = id;
    return platform;
};

WebGLDiagnostic['_tableSize'] = function(table) {
    var k, count = 0;
    for (k in table) { if (table.hasOwnProperty(k)) { count++; } }
    return count;
};

WebGLDiagnostic['detectBrowser'] = function() {
    var diag = this, cr;
    function check(p,bd) {
	var bn, bv, delay = {};
	for (bn in bd) {
	    bv = bd[bn];
	    if (typeof(bv['p']) == "undefined") { bv['p'] = 0; }
	    if (p >= bv['p']) {
		if (bv['string']) {
		    for (var i = 0; i < bv['subString'].length; i++) {
			if (bv['string'].indexOf(bv['subString'][i]) != -1) {
			    return diag['_browserWithIdVersion'](bn,bv);
			}
		    }
		} else if (bv['prop']) {
		    return diag['_browserWithIdVersion'](bn,bv);
		}
	    } else { delay[bn] = bv; }
	}
	if (diag['_tableSize'](delay) > 0) { return check(p+1,delay); }
	else { return null; }
    }
    cr = check(0,this['browsers']);
    if (cr) { return cr; }
    else { return null; }
};

WebGLDiagnostic['detectPlatform'] = function() {
    var diag = this, cr;
    function check(pd) {
	var pn, pv;
	for (pn in pd) {
	    pv = pd[pn];
	    if (pv['string']) {
		for (var i=0; i < pv['subString'].length; i++) {
		    if (pv['string'].indexOf(pv['subString'][i]) != -1) {
			return diag['_platformWithId'](pn,pv);
		    }
		}
	    }
	}
	return null;
    }
    cr = check(this['platforms']);
    if (cr) { return cr; }
    else {
      return this['_platformWithId']("unknown",this['platforms']["unknown"]);
    }
};

WebGLDiagnostic['detectDriver'] = function(canvasid) {
  var gl = this['webGLContext'](canvasid), renderer, v;
  if (!gl) { return null; }
  renderer = gl.getParameter(gl.RENDERER);

  if (navigator.userAgent.match(/Mac OS X/)) {
    return this['drivers']["osx"];
  }

  for (v in this['drivers']) {
    if ((new RegExp(v, "i")).test(renderer)) {
      return this['drivers'][v];
    }
  }
  return null;
};

WebGLDiagnostic['isWebGLSupported'] = function() {
  return "WebGLRenderingContext" in window;
};

WebGLDiagnostic['webGLContext'] = function(canvasid) {
  var gl, c = document.getElementById(canvasid), i;

  for ( i=0; i < this['context_ids'].length; i++) {
      try { gl = c.getContext(this['context_ids'][i]); }
      catch (x) { return null; }
      if (gl != null) { this['context_id'] = this['context_ids'][i]; return gl; }
  }
  return gl;
};

WebGLDiagnostic['report'] = function(canvasid) {
    var info = "", gl, webglFunctional, params, vpdims, i, cap;

    info += "WebGL Support: ";

    function getExt(gl,ext) {
	if (gl.getExtension) {
            return (gl.getExtension(ext) != null);
	} else {
            return false;
	}
    }

    if (this['isWebGLSupported']()) {
	info += "yes";

	gl = this['webGLContext'](canvasid);

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

	    info += " ("+this['context_id']+")\n";

	    for (i=0; i < params.length; i++) {
		info += params[i][0]+": "+gl.getParameter(params[i][1])+"\n";
	    }

	    vpdims = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
	    if (vpdims != null) { vpdims = vpdims[0]+" x "+vpdims[1]; }
	    info += "Max Viewport Dims: "+vpdims+"\n";

	    for (cap in this['caps']) {
		info += cap+": "+this['caps'][cap](gl)+"\n";
	    }

	    info += "\n";

	    for (i=0; i < this['exts'].length; i++) {
		info += this['exts'][i]+": "+getExt(gl,this['exts'][i])+"\n";
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

WebGLDiagnostic['diagnose'] = function (out) {
  var diag = this;

  function experimental_change(p,b,d) {
    var n = [d];
    if ((n[1] = n[0]['experimental'])) { // we have some experimental info
      if ((n[2] = n[1]['v']['download'])) {
	out['experimental_change'](b,n[1]);
      }
    }
    return false;
  }

  function experimental_plugin(p,b,d) {
    var n = [d];
    if ((n[1] = n[0]['v']['experimental'])) {
      if ((n[2] = n[1]['v']['download'])) {
	out['experimental_plugin'](b,n[1]);
      }
    }
    return false;
  }

  function plugins(p,b,d) {
    var n = [d];
    if ((n[1] = n[0]['plugins'])) { // we have some plugin info
      var s = false;
      for (var i = 0; i < n[1].length; i++) {
	if ((n[2] = n[1][i]['v']['download'])) { // stable plugin found
	  out['plugin'](b,n[1][i]);
	  s = true;
	}
      }
      if (!s) { // no stable plugins
	for (var i = 0; i < n[1].length; i++) {
	  experimental_plugin(p,b,n[1][i]);
	}
      }
      return s;
    } else {
      return false;
    }
  }

  function platform(p,b,d) {
    var n = [d];
    if ((n[1] = n[0]['platforms'])) { // we have some platform info
      if ((n[2] = n[1][p['id']])) { // we have your platform info
	if ((n[3] = n[2]['upgrade'])) { // you can upgrade
	  out['upgrade'](b,n[3]);
	  return true;
	} else if (plugins(p,b,n[2])) { // you have stable plugin options
	  return true;
	} else {
	  experimental_change(p,b,n[2]);
	  return false;
	}
      }
    }
    return false;
  }

  function detect() {
    var b = diag['detectBrowser']();
    var p = diag['detectPlatform']();
    var d = diag['decisions'][b['id']];
    if (!(out['debug'] && !out['debug']['supported']) && diag['isWebGLSupported']()) {
      var gl = diag['webGLContext'](out['canvasid']);
      if ((out['debug'] && out['debug']['trouble']) || gl == null) {
	if (d['platforms'] && d['platforms'][p['id']] && d['platforms'][p['id']]['trouble']) {
	  out['trouble'](b,d['platforms'][p['id']]['trouble'],
		      diag['detectDriver'](out['canvasid']));
	} else {
	  out['trouble'](b,d['trouble'],diag['detectDriver'](out['canvasid']));
	}
      } else {
	out['ok']();
      }
    } else {
      if (d) { // we have a special message for you
	if (!platform(p,b,d) // platform insufficient
	    && !plugins(p,b,d)) { // plugin insufficient
	  if (d['upgrade']) { // has general upgrade info
	    out['upgrade'](b,d['upgrade']);
	  } else { // get a better browser
	    experimental_change(p,b,d);
	    out['change'](p,b);
	  }
	}
      } else { // we know nothing, get a better browser
	out['change'](p,b);
      }
    }
  }

  detect();
};
