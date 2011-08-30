<?xml version="1.0"?>

<xsl:stylesheet version="1.0"
		xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
		xmlns:diag="http://github.com/ashima/webgl-diagnostic">
  <xsl:output method="html" omit-xml-declaration="yes" />
  
  <xsl:param name="lang" select="'en'" />
  <xsl:variable
      name="exprs"
      select="document(concat('../lang/',$lang,'.xml'))/diagnostic" />

  <xsl:template match="@* | node()">
    <xsl:copy>
      <xsl:apply-templates select="@* | node()" />
    </xsl:copy>
  </xsl:template>

  <xsl:template match="head">
    <head>
      <xsl:apply-templates select="@* | *" />
      <xsl:copy-of select="$exprs/head/*" />
    </head>
  </xsl:template>

  <xsl:template match="*[@id='webgldiag-messages']/*[@id]">
    <script>
      function <xsl:value-of select="@id" />(p,b,d) {
      var browser = b, platform = p, driver = d, c = [];

      <xsl:apply-templates select="*" mode="js" />

      var self = document.getElementById('<xsl:value-of select="@id" />');
      self.style.display = 'block';
      reset[reset.length] = function () { self.style.display = 'none'; };
      }
    </script>
    <xsl:copy>
      <xsl:apply-templates select="@* | *" />
    </xsl:copy>
  </xsl:template>

  <xsl:template match="diag:message">
    <xsl:variable name="id" select="@id" />
    <xsl:apply-templates
	select="$exprs/messages/message[@id=$id]/node()" />
  </xsl:template>

  <xsl:template match="diag:message" mode="js">
    <xsl:variable name="id" select="@id" />
    <xsl:apply-templates
	select="$exprs/messages/message[@id=$id]/node()" mode="js" />
  </xsl:template>

  <xsl:template match="text()">
    <xsl:copy-of select="." />
  </xsl:template>
  <xsl:template match="text()" mode="js" />

  <xsl:template match="browser[@field!='']">
    <span>
      <xsl:attribute name="id">
	<xsl:text>webgldiag-</xsl:text>
	<xsl:value-of select="generate-id()" />
      </xsl:attribute>
    </span>
  </xsl:template>
  <xsl:template match="browser">

  </xsl:template>
  <xsl:template match="browser" mode="js">
    c.push(browser);
    <xsl:apply-templates select="@* | *" mode="js" />
    c.pop();
  </xsl:template>

  <xsl:template match="platform[@field!='']">
    <span>
      <xsl:attribute name="id">
	<xsl:text>webgldiag-</xsl:text>
	<xsl:value-of select="generate-id()" />
      </xsl:attribute>
    </span>
  </xsl:template>
  <xsl:template match="platform">
    
  </xsl:template>
  <xsl:template match="platform" mode="js">
    c.push(platform);
    <xsl:apply-templates select="@* | *" mode="js" />
    c.pop();
  </xsl:template>

  <xsl:template match="@field" mode="js">
    <xsl:text>var node = document.getElementById('webgldiag-</xsl:text>
    <xsl:value-of select="generate-id(..)" />
    <xsl:text>');</xsl:text>
    node.innerHTML = c[c.length - 1].<xsl:value-of select="." />;
  </xsl:template>

  <xsl:template match="driver">

  </xsl:template>

  <xsl:template match="plugin">
    
  </xsl:template>

  <xsl:template match="link">
    <a>
      <xsl:attribute name="id">
	<xsl:text>webgldiag-</xsl:text>
	<xsl:value-of select="generate-id()" />
      </xsl:attribute>
      <xsl:apply-templates select="@* | *" />
    </a>
  </xsl:template>
  <xsl:template match="link" mode="js">
    <xsl:text>var node = document.getElementById('webgldiag-</xsl:text>
    <xsl:value-of select="generate-id()" />
    <xsl:text>');</xsl:text>
    node.href = c[c.length - 1].<xsl:value-of select="@select" />;
    <xsl:apply-templates select="*" mode="js" />
  </xsl:template>

  <xsl:template match="list">
    <ul>
      <xsl:attribute name="id">
	<xsl:text>webgldiag-</xsl:text>
	<xsl:value-of select="generate-id()" />
      </xsl:attribute>
      <xsl:apply-templates select="@* | *" />
    </ul>
  </xsl:template>
  <xsl:template match="list" mode="js">
    var lst = c[c.length - 1].<xsl:value-of select="@select" />;
    <xsl:text>var node = document.getElementById('webgldiag-</xsl:text>
    <xsl:value-of select="generate-id()" />
    <xsl:text>');</xsl:text>
    for (var i = 0; i<![CDATA[ < ]]>lst.length; i++) {
      <xsl:value-of select="@as" /> = lst[i];
      <xsl:apply-templates select="*" mode="js" />
    }
  </xsl:template>

</xsl:stylesheet>