<?xml version="1.0"?>

<xsl:stylesheet version="1.0"
		xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
		xmlns:diag="http://github.com/ashima/webgl-diagnostic">
  <xsl:output method="html" omit-xml-declaration="yes" />
  
  <xsl:param name="lang" select="'en'" />
  <xsl:variable
      name="exprs"
      select="document(concat('../lang/',$lang,'.xml'))/diagnostic" />

  <xsl:template name="idtag">
    <xsl:param name="tag" />
    <xsl:element name="{$tag}">
      <xsl:attribute name="id">
	<xsl:text>webgldiag-</xsl:text>
	<xsl:value-of select="generate-id()" />
      </xsl:attribute>
      <xsl:apply-templates select="* | text()" />
    </xsl:element>
  </xsl:template>

  <xsl:template name="idstr">
    <xsl:param name="node" select="." />
    <xsl:text>'webgldiag-</xsl:text>
    <xsl:value-of select="generate-id($node)" />
    <xsl:text>'</xsl:text>
  </xsl:template>

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
      var c, e;

      <xsl:apply-templates select="*" mode="js" />

      var self = $$('<xsl:value-of select="@id" />');
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

  <xsl:template match="platform[@field!='']">
    <xsl:call-template name="idtag">
      <xsl:with-param name="tag" select="'span'" />
    </xsl:call-template>
  </xsl:template>
  <xsl:template match="platform" mode="js">
    c = p;
    <xsl:apply-templates select="@* | *" mode="js" />
  </xsl:template>

  <xsl:template match="browser[@field!='']">
    <xsl:call-template name="idtag">
      <xsl:with-param name="tag" select="'span'" />
    </xsl:call-template>
  </xsl:template>
  <xsl:template match="browser" mode="js">
    c = b;
    <xsl:apply-templates select="@* | *" mode="js" />
  </xsl:template>

  <xsl:template match="driver[@field!='']">
    <xsl:call-template name="idtag">
      <xsl:with-param name="tag" select="'span'" />
    </xsl:call-template>
  </xsl:template>
  <xsl:template match="driver" mode="js">
    c = d;
    <xsl:apply-templates select="@* | *" mode="js" />
  </xsl:template>

  <xsl:template match="@field" mode="js">
    <xsl:text>e = $$(</xsl:text>
    <xsl:call-template name="idstr">
      <xsl:with-param name="node" select=".." />
    </xsl:call-template>
    <xsl:text>);</xsl:text>
    e.innerHTML = c.<xsl:value-of select="." />;
  </xsl:template>

  <xsl:template match="platform | browser | driver">
    <xsl:apply-templates select="@* | *" />
  </xsl:template>

  <xsl:template match="link">
    <xsl:call-template name="idtag">
      <xsl:with-param name="tag" select="'a'" />
    </xsl:call-template>
  </xsl:template>
  <xsl:template match="link" mode="js">
    <xsl:text>e = $$(</xsl:text>
    <xsl:call-template name="idstr" />
    <xsl:text>);</xsl:text>
    e.href = c.<xsl:value-of select="@select" />;
    <xsl:apply-templates select="*" mode="js" />
  </xsl:template>
</xsl:stylesheet>
