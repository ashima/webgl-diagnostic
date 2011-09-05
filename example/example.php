<?php
// From http://www.w3.org/QA/2006/02/content_negotiation

include('php/choose_lang.php');
header("Vary: Accept-Language");
header("Content-Language: $chosenlang");
header("Content-Location: example.$chosenlang.html");
header("X-Language-Negotiation-Reason: $lang_neg_reason");
header("X-Translations: ".implode(", ",glob($pagepathprefix."??.html")));
include('example.'.$chosenlang.'.html');

?>