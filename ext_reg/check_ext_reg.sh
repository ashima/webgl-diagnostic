#!/bin/sh

RCPT=sheets@ashimaarts.com
WD=/home/sheets/wc/webgl-diagnostic/ext_reg/

# switch to working directory
cd $WD

# make empty syncs if none exist
if [ ! -e index.html.sync ]
then
  touch index.html.sync
fi

# get the files if they've been updated
curl -v http://www.khronos.org/registry/webgl/extensions/ -o index.html -z index.html

# diff against last sync
diff index.html index.html.sync > index.html.diff

# compose the email
cp email_header.txt email.txt
echo -n "Retrieved at: " >> email.txt
date >> email.txt
echo -n "Retrieved by: " >> email.txt
hostname -f >> email.txt
echo "Registry index:" >> email.txt
cat index.html.diff >> email.txt
mail -s "WebGL Extension Registry Update Report" $RCPT < email.txt