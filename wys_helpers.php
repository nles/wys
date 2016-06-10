<?php
function get_collection_id_from_name($name){
  return str_replace("collection","",$name);
}
function wqe($content,$meta){
  if($GLOBALS["logged_in"]){
    $inline_class = "";
    $prevent_wrap = "";
    if(isset($meta['inline']) && $meta['inline']){
      $inline_class = " inline";
    }
    $eo = "<div class='editable".$inline_class."' ";
    $eo.= "data-type='".$meta['type']."' ";
    $eo.= "data-slug='".$meta['slug']."' ";
    if(isset($meta['id'])){
      $eo.= "data-entry-id='".$meta['id']."' "; }
    $eo.= "data-field='".$meta['field']."'";
    $eo.=  ">";
    $eo.= $content;
    $eo.= "</div>";
    return $eo;
  } else {
    return $content;
  }
}
?>
