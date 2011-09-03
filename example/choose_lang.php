<?php
// this is a simple language negotiation article, 
// as a sample implementation for the article available at:
// http://www.w3.org/QA/2006/02/content_negotiation


// we first make sure the  language-negotiation variables we are about to use are unset
unset($chosenlang); // will ultimately hold our choice of language
unset ($lang_neg_reason); // at the end of the negotiation, this variable will store what part of the algorithm 
                         //  was used to find the best language variant.

// first, we check whether the client has sent us, in a cookie,
// recorded language preference from earlier interactions.
// this choice should have precedence over other mechanisms
unset($cookie_lang);
if( $_COOKIE['lang'])
{
        $cookie_lang = $_COOKIE['lang'];
        if (($cookie_lang == "en") or ($cookie_lang == "ja"))
        {
                $chosenlang = $cookie_lang;
                $lang_neg_reason = "cookie";
        }
}
// if the cookie has been found, then the variable $chosenlang has been filled. Our job is finished.
// if however no cookie was found and $chosenlang is still unset, we proceed with some basic negociation
// the following code parses the Accept-Language HTTP header sent by the client
//   and tries to see if either English or Japanese are accepted
if (! isset($chosenlang))
{
        # Get the list of acceptable languages
        # or use default
        unset($acceptlang);
        if ($_SERVER['HTTP_ACCEPT_LANGUAGE'])
        {
                $acceptlang = explode(',',
		$_SERVER['HTTP_ACCEPT_LANGUAGE']);
                for ($i = 0; $i < count($acceptlang);  $i++)
                {
                        $Lang = explode(';', $acceptlang[$i]);
                        $acceptlang[$i] = trim($Lang[0]);
                }
        }
        else $acceptlang = array('en', 'zh');
        for ($i = 0; $i < count($acceptlang);  $i++)
        {
                $Lang_split = explode('-', $acceptlang[$i]);
                $Lang_pre = trim($Lang_split[0]);
                if ($Lang_pre == "en" or $Lang_pre == "zh")
                {
                        $chosenlang = $Lang_pre;
                        $i = count($acceptlang)+1;
                        $lang_neg_reason = "http_nego";
                }
        }
}
// At this point, we should have a $chosenlang
// in some cases however (if the browser does not claim to accept either Chinese or English)
// then the "negociation" failed. We could send an HTTP error "406 Not acceptable", but we prefer
// to choose a default language to serve: in this case, english.
if (! isset($chosenlang))
{
        # our default
        $chosenlang = "en";
        $lang_neg_reason = "default";
}

// we're done. Our script exits and will pass the (global) variable
$chosenlang to the PHP-handled page.
?>
