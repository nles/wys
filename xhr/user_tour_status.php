<?php
// Use the cockpit user account database to store
// a value if the user has been prompted with the tour.
require('../../bootstrap.php');
$app = new Lime\App();
$user = $app("session")->read("cockpit.app.auth");
if($user){
  $action = $_POST['action'];
  $value = true;
  if(isset($_POST['reset'])) $value = false;

  if($action == "set"){
    $ur = $cockpit->db->findOne("cockpit/accounts", ['user' => $user["user"]]);
    $ur["tour_shown"] = $value;
    $ur = $cockpit->db->update("cockpit/accounts", ['user' => $user["user"]], $ur);
    print '{"status":"updated"}';

  } else if($action == "get"){
    $ur = $cockpit->db->findOne("cockpit/accounts", ['user' => $user["user"]]);
    if(isset($ur["tour_shown"]) && $ur["tour_shown"] == true){
      print '{"status":"seen"}';
    } else {
      print '{"status":"not_seen"}';
    }

  } else {
    print '{"error":"no_action_given"}';

  }

} else {
  print '{"status":"error","error_code":"not_logged_in"}';
}
?>
