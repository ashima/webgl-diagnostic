.PHONY: html clean

LANGS := $(wildcard ../lang/*.xml)
HTMLS := $(LANGS:../lang/%.xml=example.%.html)

example.%.html: ../lang/%.xml
	xsltproc --stringparam lang $* example.xsl example.xhtml > example.$*.html

html: $(HTMLS)

clean:
	rm example.*.html
