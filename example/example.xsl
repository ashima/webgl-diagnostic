<?xml version="1.0"?>

<xsl:stylesheet version="1.0"
		xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
		xmlns:diag="http://github.com/ashima/webgl-diagnostic">
  <xsl:include href="../lang/message.xsl" />

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

  <xsl:template name="field">
    <xsl:param name="msgnode" />
    <span>
      <xsl:attribute name="id">
	<xsl:text>webgldiag-</xsl:text>
	<xsl:call-template name="genid">
	  <xsl:with-param name="msgnode" select="$msgnode" />
	</xsl:call-template>
      </xsl:attribute>
    </span>
  </xsl:template>
  <xsl:template name="link">
    <xsl:param name="msgnode" />
    <a><xsl:attribute name="id">
	<xsl:text>webgldiag-</xsl:text>
	<xsl:call-template name="genid">
	  <xsl:with-param name="msgnode" select="$msgnode" />
	</xsl:call-template>
      </xsl:attribute>
      <xsl:apply-templates select="* | text()">
	<xsl:with-param name="msgnode" select="$msgnode" />
    </xsl:apply-templates></a>
  </xsl:template>

</xsl:stylesheet>
