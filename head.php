<!-- goes inside <head> -->
<? if($GLOBALS['logged_in']): ?>

<?php
// init with defaults if we dont have any settings
if(!isset($wys)) $wys = [];
if(!isset($wys["cms_folder"])) $wys["cms_folder"] = "cockpit/";
if(!isset($wys["edit_path"])) $wys["edit_path"] = "";
?>

<script>
  // This path should point to the currently active page to provide quick
  // editor access through the wys-toolbar.
  var wys_cms_path = "/<?php print $wys['cms_folder'] ?>";
  var cms_active_edit_path = "/<?php print $wys['cms_folder'] ?>index.php/collections/entry/<?php print $wys['edit_path']; ?>";
</script>

<!-- jquery -->
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0/jquery.min.js"></script>

<!-- hint.css -->
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/hint.css/2.2.1/hint.min.css">
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.2/css/font-awesome.min.css">

<!-- medium-editor -->
<script src="//cdn.jsdelivr.net/medium-editor/5.18.0/js/medium-editor.min.js"></script>
<link rel="stylesheet" href="//cdn.jsdelivr.net/medium-editor/5.18.0/css/medium-editor.min.css" type="text/css" media="screen" charset="utf-8">
<link rel="stylesheet" href="//cdn.jsdelivr.net/medium-editor/5.18.0/css/themes/default.min.css" type="text/css" media="screen" charset="utf-8">

<!-- vex -->
<script src="//cdnjs.cloudflare.com/ajax/libs/vex-js/2.3.4/js/vex.combined.min.js"></script>
<script>vex.defaultOptions.className = 'vex-theme-top';</script>
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/vex-js/2.3.4/css/vex.css" />
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/vex-js/2.3.4/css/vex-theme-top.css" />

<!-- bootstrap-tour -->
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/bootstrap-tour/0.10.3/css/bootstrap-tour-standalone.min.css">
<script src="//cdnjs.cloudflare.com/ajax/libs/bootstrap-tour/0.10.3/js/bootstrap-tour-standalone.min.js"></script>

<!-- wys -->
<link rel="stylesheet" type="text/css" href="/<?php print $wys['cms_folder'] ?>wys/editor.css" />
<link rel="stylesheet" type="text/css" href="/<?php print $wys['cms_folder'] ?>wys/loader_animation.css" />
<script src="/<?php print $wys['cms_folder'] ?>wys/editor.js"></script>
<script src="/<?php print $wys['cms_folder'] ?>wys/tour.js"></script>

<?php endif ?>
