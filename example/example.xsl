<?xml version="1.0"?>

<xsl:stylesheet version="1.0"
		xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" omit-xml-declaration="yes" />
  
  <xsl:param name="lang" select="'en'" />
  <xsl:variable name="langpack"
		select="document(concat('../lang/',$lang,'.xml'))/diagnostic" />

  <xsl:template match="head">
    <xsl:copy-of select="*" />
    <xsl:copy-of select="$langpack/head/*" />
  </xsl:template>

  <xsl:template match="*">
    <xsl:apply-templates select="*" />
    <xsl:copy-of select="." />
  </xsl:template>

</xsl:stylesheet>
