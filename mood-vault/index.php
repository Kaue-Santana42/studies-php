<?php 

    $project_name = "Mood Vault";
    $server_status = "Online";

    echo "<h1>Welcome to $project_name</h1>";
    echo "<p>The server is: <strong>$server_status</strong></p>";

    $current_time = date("H:i");
    
    if ($current_time < "12:00") {
        echo "Good morning! Time to focus.";
    } else {
        echo "Good afternoon! How is your mood today?";
    }
?>