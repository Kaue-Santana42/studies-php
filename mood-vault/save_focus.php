<?php 

    // Allows any origin (Live Server or Github Pages) access this file
    header("Access-Control-Allow-Origin: *");
    // Allows the header 'Content-Type' to be sent (required for JSON)
    header("Access-Control-Allow-Headers: Content-Type");
    // Defines that the PHP response will be always in JSON
    header("Content-Type: application/json");

    // Connection is included to have access to the object $pdo
    require_once 'connection.php';

    // 1. PHP doesn't fill $_POST automatically when receives JSON.
    // It is needed to read the 'body' of the raw request (php://input)
    $json_received = file_get_contents("php://input");

    // 2. JSON is decoded to a PHP object
    $data = json_decode($json_received);

    // 3. Verifies if the basic data exist
    if ($data && isset($data->mode)) {

        $mode_text = [
            1 => "Focus Mode",
            2 => "Short Break",
            3 => "Long Break"
        ];

        // Numbers that come from JS (mode) to search inside the array
        $mode_concluded = $mode_text[$data->mode] ?? "Unknown";
        $user_mood = $data -> mood ?? 'Not informed'; // Uses a standard value if nothing comes

        try {
            $sql = "INSERT INTO history (mode, mood) VALUES (:mode, :mood)";
            $stmt = $pdo -> prepare($sql);
            $stmt -> bindParam(':mode', $mode_concluded);
            $stmt -> bindParam(':mood', $user_mood);
            $stmt -> execute();

            // Answers the JavaScript with a confirmation in JSON
            echo json_encode(["status" => "success", "message" => "Successfully saved!"]);
            
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e -> getMessage()]);
        }
    }
    
?>