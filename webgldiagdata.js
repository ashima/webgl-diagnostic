/**
 * @preserve Copyright 2011 David Sheets, Ashima Arts. All rights reserved.
 * Open source under a BSD-style license.
 * See https://github.com/ashima/webgl-diagnostic for more information.
 */
if (typeof(window["WebGLDiagnostic"])=="undefined") {
  WebGLDiagnostic = window["WebGLDiagnostic"] = {};
}

// type context_id = string
WebGLDiagnostic['context_ids'] = [
"webgl","experimental-webgl","moz-webgl","webkit-3d" ];

// type ext = string
WebGLDiagnostic['exts'] = [
"OES_texture_float","OES_texture_half_float","WEBKIT_lose_context",
"OES_standard_derivatives","OES_vertex_array_object" ];

// type 'a label = { label: string; v: 'a }
WebGLDiagnostic['drivers'] = {
  "nvidia":{label:"NVIDIA", v:"http://www.nvidia.com/Download/index.aspx"},
  "ati":{label:"ATI", v:"http://support.amd.com/us/gpudownload/Pages/index.aspx"},
  "osx":{label:"Apple", v:"http://www.apple.com/macosx/"}
};

// type	decision = {
//   platforms: (string, decision) table option;
//   plugins: decision label list option;
//   experimental: decision label option;
//   upgrade: url option;
//   download: url option;
//   trouble: url option;
// }
// platforms, plugins, experimental cannot self-stack
// precedence is platforms>plugins>experimental
WebGLDiagnostic['decisions'] = {
  "Chrome" :
  { trouble: "http://www.google.com/support/chrome/bin/answer.py?answer=1220892",
    download: "http://www.google.com/chrome/",
    upgrade: "http://www.google.com/support/chrome/bin/answer.py?answer=95414"
  },

  "Safari" :
  { trouble: "http://fairerplatform.com/2011/05/new-in-os-x-lion-safari-5-1-brings-webgl-do-not-track-and-more/",
    platforms:
    { "iPhone/iPod":
      { trouble: "http://www.apple.com/support/iphone/",
	upgrade: "http://www.apple.com/ios/"},
      "iPad":
      { trouble: "http://www.apple.com/support/ipad/",
	upgrade: "http://www.apple.com/ios/"},
      "Mac":
      { trouble: "http://fairerplatform.com/2011/05/new-in-os-x-lion-safari-5-1-brings-webgl-do-not-track-and-more/",
        download: "http://www.apple.com/safari/",
	upgrade: "http://www.apple.com/safari/"}
    }
  },

  "Opera" :
  { platforms:
    { "Windows":
      { experimental:
	{ label: "Opera Developer Preview",
	  v: { trouble: "http://my.opera.com/core/blog/2011/02/28/webgl-and-hardware-acceleration-2",
	       download: "http://my.opera.com/core/blog/2011/02/28/webgl-and-hardware-acceleration-2"}
	}
      }
    }
  },

  "Explorer" :
  { plugins: [
    { label: "Google Chrome Frame",
      v: { download: "http://code.google.com/chrome/chromeframe/" }
    }]
  },

  "Firefox" :
  { trouble: "https://support.mozilla.com/en-US/kb/how-do-i-upgrade-my-graphics-drivers",
    download: "http://www.mozilla.com/en-US/firefox/new/",
    upgrade: "http://www.mozilla.com/en-US/firefox/new/"
  }

};

// type browser = {
//   id: string auto; (* set to the database key automatically *)
//   string: string option; (* browser string to search *)
//   subString: string list option; (* list of keywords to search for *)
//   name: string; (* human-readable browser name with vendor *)
//   versionSearch: string option; (* optional version prefix *)
//   prop: object option; (* alternatively, sniff by checking existence of prop *)
//   p: int auto (* eval priority (smaller is sooner) defaults to 0 *)
// }
WebGLDiagnostic['browsers'] = {
    "Chrome" :
    { string: navigator.userAgent, subString: ["Chrome"],
      name: "Google Chrome" },

    "OmniWeb" :
    { string: navigator.userAgent, subString: ["OmniWeb"],
      versionSearch: "OmniWeb/", name: "OmniWeb" },

    "Safari" :
    { string: navigator.vendor, subString: ["Apple"],
      versionSearch: "Version", name: "Apple Safari" },

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
      versionSearch: "Netscape", name: "Netscape Navigator" },

    "Explorer" :
    { string: navigator.userAgent, subString: ["MSIE"],
      versionSearch: "MSIE", name: "Microsoft Internet Explorer" },

    "Firefox" :
    { p: 1, string: navigator.userAgent, subString: ["Firefox"],
      name: "Mozilla Firefox" },

    "Mozilla" :
    { p: 2, string: navigator.userAgent, subString: ["Gecko"],
      versionSearch: "rv", name: "Mozilla Suite" },

    // for older Netscapes (4-)
    "OldNetscape" :
    { p: 3, string: navigator.userAgent, subString: ["Mozilla"],
      versionSearch: "Mozilla", name: "Netscape Navigator" }
};

// type platform = {
//   id: string auto; (* set to the database key automatically *)
//   string: string option; (* browser string to search *)
//   subString: string list option; (* list of keywords to search for *)
//   browsers: string list (* list of browser ids with WebGL on this platform *)
// }
WebGLDiagnostic['platforms'] = {
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