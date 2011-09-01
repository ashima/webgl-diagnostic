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
    <xsl:if test="$exprs/messages/message[@id=$id]//browser
		  or $exprs/messages/message[@id=$id]//platform
		  or $exprs/messages/message[@id=$id]//driver">
      <script type="text/javascript">
	<xsl:apply-templates
	   select="$exprs/messages/message[@id=$id]/node()" mode="js">
	  <xsl:with-param name="msgnode" select="." />
	</xsl:apply-templates>
      </script>
    </xsl:if>
    <xsl:apply-templates
	select="$exprs/messages/message[@id=$id]/node()">
      <xsl:with-param name="msgnode" select="." />
    </xsl:apply-templates>
  </xsl:template>

  <xsl:template match="text()">
    <xsl:copy-of select="." />
  </xsl:template>
  <xsl:template match="text()" mode="js" />

  <xsl:template name="field">
    <xsl:param name="msgnode" />
    <span>
      <xsl:attribute name="id">
	<xsl:text>webgldiag-</xsl:text>
	<xsl:value-of select="concat(generate-id($msgnode),generate-id())" />
      </xsl:attribute>
    </span>
  </xsl:template>
  <xsl:template name="insfield">
    <xsl:param name="msgnode" />
    <xsl:text>insert('</xsl:text>
    <xsl:value-of select="local-name()" />
    <xsl:text>-</xsl:text>
    <xsl:value-of select="@field" />
    <xsl:text>','</xsl:text>
    <xsl:value-of select="concat(generate-id($msgnode),generate-id())" />
    <xsl:text>');</xsl:text>
  </xsl:template>
  <xsl:template name="link">
    <xsl:param name="msgnode" />
    <a>
      <xsl:attribute name="id">
	<xsl:text>webgldiag-</xsl:text>
	<xsl:value-of select="concat(generate-id($msgnode),generate-id())" />
      </xsl:attribute>
      <xsl:apply-templates select="* | text()" />
    </a>
  </xsl:template>
  <xsl:template name="inslink">
    <xsl:param name="msgnode" />
    <xsl:text>insert('</xsl:text>
    <xsl:value-of select="local-name()" />
    <xsl:text>-</xsl:text>
    <xsl:value-of select="@link" />
    <xsl:text>','</xsl:text>
    <xsl:value-of select="concat(generate-id($msgnode),generate-id())" />
    <xsl:text>');</xsl:text>
  </xsl:template>

  <xsl:template match="*[@field!='']">
    <xsl:param name="msgnode" />
    <xsl:call-template name="field">
      <xsl:with-param name="msgnode" select="$msgnode" />
    </xsl:call-template>
  </xsl:template>
  <xsl:template match="*[@link!='']">
    <xsl:param name="msgnode" />
    <xsl:call-template name="link">
      <xsl:with-param name="msgnode" select="$msgnode" />
    </xsl:call-template>
  </xsl:template>
  <xsl:template match="*[@field!='']" mode="js">
    <xsl:param name="msgnode" />
    <xsl:call-template name="insfield">
      <xsl:with-param name="msgnode" select="$msgnode" />
    </xsl:call-template>
  </xsl:template>
  <xsl:template match="*[@link!='']" mode="js">
    <xsl:param name="msgnode" />
    <xsl:call-template name="inslink">
      <xsl:with-param name="msgnode" select="$msgnode" />
    </xsl:call-template>
    <xsl:apply-templates select="*" mode="js" />
  </xsl:template>

</xsl:stylesheet>
