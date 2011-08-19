/*function showBugReport() {
  var bugreport = document.getElementById("bugreport");
  bugreport.style.display = "block";
}

function sendBugReport() {
  var bugreport = document.getElementById("bugreport");
  bugreport.submit();
  bugreport.style.display = "none";
  bugthanks.style.display = "block";
  return false;
}

function yes_webgl(b) {
    var trouble = ("Trouble viewing the content? "
		   +"<a href='#' onclick='showBugReport()'>Report a problem</a>.");
    var bugreport = "<form method='POST' action='"+bug+"' id='bugreport'>";
    bugreport += "<table>";
    bugreport += "<tr><td>Email</td><td><input type='text' name='email'></td></tr>";
    bugreport += "<tr><td>Description</td><td>"
    bugreport += "<textarea name='comments' rows='2' cols='40'></textarea></td></tr>";
    bugreport += "<tr><td></td><td>";
    bugreport += "<input type='hidden' name='diagnostics' value='"+report+"'>"
    bugreport += "<input type='submit' value='Send' onsubmit='sendBugReport()'>";
    bugreport += "</td></tr>";
    bugreport += "</table></form>";
    bugreport += "<div id='bugthanks'>Thanks for your report!</div>";
    return ("<a href='"+url+"'>"+txt+"</a><br>"+trouble+bugreport);
}
*/
var out = { canvasid: "test-canvas", // string
            debug: { trouble: false }, // { trouble: bool } option
	    // unit -> unit
            reset: function () { },
	    // platform -> unit
            change: function(p) { },
	    // browser -> url -> unit
            upgrade: function(b,url) { },
	    // browser -> url label -> unit
            plugin: function (b,link) { },
	    // browser -> url label -> unit
            experimental_plugin: function (b,link) { },
	    // browser -> url label -> unit
            experimental_change: function (b,link) { },
	    // browser -> url -> url label option -> unit
	    trouble: function(b,url,driver) { },
	    // unit -> unit
	    ok: function() { }
          };
/*
function trouble_webgl(b) {
    var msg = ("Your browser appears to support WebGL but it is disabled or "
	       +"unavailable. ");
    var support;

    if (b == null) {
      support = "Visit your browser's support site for more information.";
    } else {
      support = ("<a href='"+b.urls.trouble+"'>Visit "+b.name+"'s support site</a> "
		 +"for more information.");
    }

    var driver = diag.detectDriver(canvasid);
    if (driver === null) {
      msg+=("A common cause of WebGL unavailability is out-of-date "
            +"graphics drivers. ");
    } else {
      msg+=("It may help to <a href='"+driver.v+"'>upgrade your "
	    +driver.label+" graphics drivers</a> "
	    +"to the latest version and restart your system.");
    }
    msg+=support;
    return msg;
}

function no_webgl(p,b) {
    var i, browserlist = [], link;
    var ident = ("It looks like you are using "+b.name+" "+b.version
                 +" which does not support WebGL. ")
    if (b.urls && b.urls.upgrade) { // upgrade
      return (ident+"Please <a href='"+b.urls.upgrade
              +"'>upgrade</a> your browser to view WebGL content.");
    } else { // change browser
      for (i = 0; i < p.browsers.length; i++) {
        link = ("<a href='"+p.browsers[i].urls.download+"'>"
	        +p.browsers[i].name+"</a>");
        browserlist[browserlist.length] = "<li>"+link+"</li>";
      }
      return (ident+"Unfortunately, there are no newer versions of your "
              +"browser with WebGL support; however, the following browsers "
              +"with WebGL support may be available for "+p.id+":"
              +"<ul>"+browserlist.join("")+"</ul>");
    }
}
*/