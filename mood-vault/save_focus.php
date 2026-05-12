<?php 
    // 1. Connection is included to have access to the object $pdo
    require_once 'connection.php';

    // 2. Simulated data coming from the timer (later integrated with JS)
    $mode_completed = "Focus Mode";
    $user_mood = "Productive";

    try {
        // 3. Query preparation ("Prepared Statement" technique)
        // IMPORTANT: Never put variables directly in the text to avoid SQL injection.
        // "links" called placeholders (:mode, :mood) are used.
        $sql = "INSERT INTO history (mode, mood) VALUES (:mode, :mood)";

        $stmt = $pdo -> prepare($sql);

        // 4. Linking Values (Binding)
        // It's said to PHP: "Instead of :mode, put the value of the variable $mode_completed"
        $stmt -> bindParam(':mode', $mode_completed);
        $stmt -> bindParam(':mood', $user_mood);

        // 5. Execution
        $stmt -> execute();

        echo "Success! The record has been saved in the database";
    } catch (PDOException $e) {
        echo "Error connection: " . $e -> getMessage();
    }
?>