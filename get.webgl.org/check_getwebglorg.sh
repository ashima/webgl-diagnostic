#!/bin/sh

RCPT=sheets@ashimaarts.com
WD=/home/sheets/wc/webgl-diagnostic/get.webgl.org/

# switch to working directory
cd $WD

# make empty syncs if none exist
if [ ! -e detect.js.sync ]
then
  touch detect.js.sync
fi
if [ ! -e get.webgl.org.html.sync ]
then
  touch get.webgl.org.html.sync
fi
if [ ! -e troubleshooting.html.sync ]
then
  touch troubleshooting.html.sync
fi

# get the files
wget http://get.webgl.org/ -O get.webgl.org.html
wget http://get.webgl.org/troubleshooting/ -O troubleshooting.html
wget http://get.webgl.org/troubleshooting/DoNotCopyOrLinkThisFileElseYouWillNotGetAutoUpdatedHelpForYourUsers.js -O detect.js

# diff against last sync
diff get.webgl.org.html get.webgl.org.html.sync > get.webgl.org.html.diff
diff troubleshooting.html troubleshooting.html.sync > troubleshooting.html.diff
diff detect.js detect.js.sync > detect.js.diff

# compose the email
cp email_header.txt email.txt
echo -n "Retrieved at: " >> email.txt
date >> email.txt
echo "Main index:" >> email.txt
cat get.webgl.org.html.diff >> email.txt
echo "Troubleshooting index:" >> email.txt
cat troubleshooting.html.diff >> email.txt
echo "Detect script:" >> email.txt
cat detect.js.diff >> email.txt
mail -s "get.webgl.org Update Report" $RCPT < email.txt