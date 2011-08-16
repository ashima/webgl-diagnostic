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

# get the files if they've been updated
curl http://get.webgl.org/ -o get.webgl.org.html -z get.webgl.org.html
curl http://get.webgl.org/troubleshooting/ -o troubleshooting.html -z troubleshooting.html
curl http://get.webgl.org/troubleshooting/DoNotCopyOrLinkThisFileElseYouWillNotGetAutoUpdatedHelpForYourUsers.js -o detect.js -z detect.js

# diff against last sync
diff get.webgl.org.html get.webgl.org.html.sync > get.webgl.org.html.diff
diff troubleshooting.html troubleshooting.html.sync > troubleshooting.html.diff
diff detect.js detect.js.sync > detect.js.diff

# compose the email
cp email_header.txt email.txt
echo -n "Retrieved at: " >> email.txt
date >> email.txt
echo -n "Retrieved by: " >> email.txt
hostname -f >> email.txt
echo "Main index:" >> email.txt
cat get.webgl.org.html.diff >> email.txt
echo "Troubleshooting index:" >> email.txt
cat troubleshooting.html.diff >> email.txt
echo "Detect script:" >> email.txt
cat detect.js.diff >> email.txt
mail -s "get.webgl.org Update Report" $RCPT < email.txt