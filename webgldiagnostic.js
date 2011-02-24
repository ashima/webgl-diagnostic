function WebGLDiagnostic() {}

WebGLDiagnostic.context_ids = [
"webgl","experimental-webgl","moz-webgl","webkit-3d" ];

WebGLDiagnostic.exts = [
"OES_texture_float","OES_texture_half_float","WEBKIT_lose_context",
"OES_standard_derivatives","OES_vertex_array_object" ];

WebGLDiagnostic.drivers = {
    "nvidia":"http://www.nvidia.com/Download/index.aspx",
    "ati":"http://support.amd.com/us/gpudownload/Pages/index.aspx",
    "mozilla":"https://www.khronos.org/webgl/public-mailing-list/archives/1011/msg00220.html",
    "osx":"http://www.apple.com/macosx/"};

WebGLDiagnostic.isWebGLSupported = function() {
  return window.WebGLRenderingContext != null;
};

WebGLDiagnostic.webGLContext = function(canvasid) {
  var c = document.getElementById(canvasid);
  var gl;

  for ( i=0; (gl = c.getContext(this.context_ids[i])) == null
             && i < this.context_ids.length; i++) {}

  return gl;
};

WebGLDiagnostic.driverLink = function(canvasid) {
  var gl = this.webGLContext(canvasid);
  if (!gl) { return null; }
  var renderer = gl.getParameter(gl.RENDERER);

  if (navigator.userAgent.match(/Mac OS X/)) {
    if (navigator.userAgent.match(/Mac OS X 10.6/)) {
      return null;
    } else {
      return this.drivers["osx"];
    }
  }

  for (var v in this.drivers) {
    if ((new RegExp(v, "i")).test(renderer)) {
      return this.drivers[v];      
    }
  }
  return null;
};

WebGLDiagnostic.report = function(canvasid) {
  var info = "";
  var gl = this.webGLContext(canvasid);
  function getParameter(e) {
    return gl.getParameter(e);
  }
  function getExt(ext) {
    if (gl.getExtension) {
      return (gl.getExtension(ext)!=null);
    } else {
      return false;
    }
  }

  info += "WebGL Support: ";

  var webglFunctional = gl != null;

  if (this.isWebGLSupported()) {
    info += "yes";
    if (webglFunctional) {
      var params = [["Version", gl.VERSION],
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
                    ["Max Renderbuffer Size", gl.MAX_RENDERBUFFER_SIZE]];

      info += " ("+this.context_ids[i]+")\n";

      for (i=0; i < params.length; i++) {
        info += params[i][0]+": "+getParameter(params[i][1])+"\n";
      }

      var vpdims = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
      if (vpdims != null) { vpdims = vpdims[0]+" x "+vpdims[1]; }
      info += "Max Viewport Dims: "+vpdims+"\n";

      info += "\n";

      for (i=0; i < this.exts.length; i++) {
        info += this.exts[i]+": "+getExt(this.exts[i])+"\n";
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