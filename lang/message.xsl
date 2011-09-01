<?xml version="1.0"?>

<xsl:stylesheet version="1.0"
		xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
		xmlns:diag="http://github.com/ashima/webgl-diagnostic">

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

  <xsl:template name="genid">
    <xsl:param name="msgnode" />
    <xsl:value-of select="concat(generate-id($msgnode),generate-id())" />
  </xsl:template>

  <xsl:template name="insfield">
    <xsl:param name="msgnode" />
    <xsl:text>insert('</xsl:text>
    <xsl:value-of select="local-name()" />
    <xsl:text>-</xsl:text>
    <xsl:value-of select="@field" />
    <xsl:text>','</xsl:text>
    <xsl:call-template name="genid">
      <xsl:with-param name="msgnode" select="$msgnode" />
    </xsl:call-template>
    <xsl:text>');</xsl:text>
  </xsl:template>

  <xsl:template name="inslink">
    <xsl:param name="msgnode" />
    <xsl:text>insert('</xsl:text>
    <xsl:value-of select="local-name()" />
    <xsl:text>-</xsl:text>
    <xsl:value-of select="@link" />
    <xsl:text>','</xsl:text>
    <xsl:call-template name="genid">
      <xsl:with-param name="msgnode" select="$msgnode" />
    </xsl:call-template>
    <xsl:text>');</xsl:text>
  </xsl:template>

  <xsl:template match="text()" mode="js" />

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
    <xsl:apply-templates select="*" mode="js">
      <xsl:with-param name="msgnode" select="$msgnode" />
    </xsl:apply-templates>
  </xsl:template>

</xsl:stylesheet>
