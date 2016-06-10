<?php
// Allow collection to be saved through an ajax-request
require('../../bootstrap.php');
$app = new Lime\App();
$user = $app("session")->read("cockpit.app.auth");
if($user){
  $collection_slug = $_POST['slug'];
  $entry_id = $_POST['eid'];
  $entry_field = $_POST['field'];
  $entry_field_content = $_POST['content'];

  $collection = $cockpit->db->findOne("common/collections", ['slug' => $collection_slug]);
  $entry_data = ["_id" => $entry_id, $entry_field => $entry_field_content];

  cockpit('collections:save_entry', $collection['name'], $entry_data);
  print '{"status":"saved"}';

} else {
  print '{"status":"error","error_code":"not_logged_in"}';
}
?>
