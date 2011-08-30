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

  <xsl:template match="diag:message">
    <xsl:variable name="id" select="@id" />
    <xsl:apply-templates
	select="$exprs/messages/message[@id=$id]/node()" />
  </xsl:template>

  <xsl:template match="text()">
    <xsl:copy-of select="." />
  </xsl:template>

  <xsl:template name="namefield">
    <span>
      <xsl:attribute name="name">
	<xsl:text>webgldiag-</xsl:text>
	<xsl:value-of select="local-name()" />
	<xsl:text>-</xsl:text>
	<xsl:value-of select="@field" />
      </xsl:attribute>
    </span>
  </xsl:template>
  <xsl:template name="namelink">
    <a>
      <xsl:attribute name="name">
	<xsl:text>webgldiag-</xsl:text>
	<xsl:value-of select="local-name()" />
	<xsl:text>-</xsl:text>
	<xsl:value-of select="@link" />
      </xsl:attribute>
      <xsl:apply-templates select="* | text()" />
    </a>
  </xsl:template>

  <xsl:template match="platform[@field!='']">
    <xsl:call-template name="namefield" />
  </xsl:template>
  <xsl:template match="platform[@link!='']">
    <xsl:call-template name="namelink" />
  </xsl:template>

  <xsl:template match="browser[@field!='']">
    <xsl:call-template name="namefield" />
  </xsl:template>
  <xsl:template match="browser[@link!='']">
    <xsl:call-template name="namelink" />
  </xsl:template>

  <xsl:template match="driver[@field!='']">
    <xsl:call-template name="namefield" />
  </xsl:template>
  <xsl:template match="driver[@link!='']">
    <xsl:call-template name="namelink" />
  </xsl:template>

</xsl:stylesheet>
