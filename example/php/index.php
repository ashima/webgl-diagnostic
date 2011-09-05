<?php
// From http://www.w3.org/QA/2006/02/content_negotiation

include('choose_lang.php');
header("Content-Language: $chosenlang");
header("Vary: Accept-Language");
header("Content-Location: ../example.$chosenlang.html");
include('../example.'.$chosenlang.'.html');

?>
   
