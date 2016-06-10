<?php
require('../../bootstrap.php');
$app = new Lime\App();
$user = $app("session")->read("cockpit.app.auth");
if($user){
  $region_slug = $_POST['slug'];
  $entry_field = $_POST['field'];
  $entry_field_content = $_POST['content'];

  $region = $cockpit->db->findOne("common/regions", ['slug' => $region_slug]);

  cockpit('regions:update_region_field', $region['name'], $entry_field, $entry_field_content);
  print '{"status":"saved"}';

} else {
  print '{"status":"error","error_code":"not_logged_in"}';
}
?>
