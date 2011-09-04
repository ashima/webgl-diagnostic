# Ashima webgl-diagnostic

webgl-diagnostic is a WebGL onboarding system to help users get a
working WebGL implementation and, should an error occur, supply helpful
system information to you in a bug report. The software is free and open
source under the MIT Expat license which can be found in the LICENSE
file.

## Features

* Up-to-date and accurate browser and platform detection (cf. get.webgl.org)
* Easy system profile report generation for high quality user bug reports
* A user support database in JSON with support for experimental implementations and plugins
* Plugin recommendations (e.g. Google Chrome Frame for IE users)
* WebGL extension detection
* Graphics driver detection and driver support links
* Easily skinnable support messages
* Easily localizable support messages
* WebGL capability sniffing
* Your contributions

## Usage

### WebGL Onboarding

#### Requirements

You will need an XSLT 1.0 processor (e.g. xsltproc from libxml/libxslt)
and a make program (e.g. GNU Make) to build localized HTML versions of
the onboarder. If you have tools like these, you can run 'make' in example/
to generate example localizations.

#### Localization

Onboarding messages are provided in an ad-hoc XML dialect in lang/
organized by ISO 639-1 code or IETF language code (see RFC 5646 and RFC
4647). A simple language resource processor is provided as lang/message.xsl.

#### Driver Information

Driver information is presently gleaned from the RENDERER string on a WebGL
context unless the user is on Mac OS X, in which case the driver vendor
is reported as "Apple".

#### Updates

The get.webgl.org/ directory contains the scripts that the author uses
to stay up-to-date on changes to this onboarding site. These scripts
make If-Modified-Since requests using [curl](http://curl.haxx.se/)
to reduce the burden on the get.webgl.org host. Users of this software
should monitor this repository or the get.webgl.org site directly to
stay current on ecosystem changes and prevent bit-rot.

If this monitoring and maintenance is not possible or
desirable, we recommend linking users to get.webgl.org.

### Bug Report System Profiles

#### Updates

The ext_reg/ directory contains the scripts that the author uses to stay
up-to-date on new WebGL extensions. These scripts make
If-Modified-Since requests using [curl](http://curl.haxx.se/) to
reduce the burden on the Khronos host.

## Credits

* David Sheets (JavaScript, XSLT, author)
* Yuan Lian (Simplified Chinese translation)
* Chris Lee (Welsh translation)

## Special Thanks

* [W3C Blog](http://www.w3.org/QA/2006/02/content_negotiation) which
  published the HTTP language content negotiation PHP code in example/
* The Khronos WebGL working group without whose work, none of this would
  be possible
* [webgl-bench](http://webgl-bench.appspot.com/) which has been
  collecting useful WebGL benchmark statistics for the community

## Feedback

Data updates? Bugs? Browser compatibility issues? Translations? We would
love to hear from you!
