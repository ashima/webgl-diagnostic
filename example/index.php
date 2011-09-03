<?php
// From http://www.w3.org/QA/2006/02/content_negotiation

include('choose_lang.php');
if ($chosenlang == "zh") {
  include 'example.zh.html';
else {
  include 'example.en.html';
}
?>
   
