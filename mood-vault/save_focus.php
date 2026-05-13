<?php 
    // Connection is included to have access to the object $pdo
    require_once 'connection.php';

    // IMPORTANCE OF THIS STEP:
    // It verifies if the data really came via POST before try to save
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {

        // Catches the real data 'names' from the form
        $mode_completed = $_POST['mode'];
        $user_mood = $_POST['mood'];

        try {
            $sql = "INSERT INTO history (mode, mood) VALUES (:mode, :mood)";

            $stmt = $pdo -> prepare($sql);

            $stmt -> bindParam(':mode', $mode_completed);
            $stmt -> bindParam(':mood', $user_mood);

            $stmt -> execute();

            echo "<h2>Data successfully saved!</h2>";
            echo "<a href='index.html'>Go back and register other</a>";
        } catch (PDOException $e) {
            echo "Error saving: " . $e -> getMessage();
        }
    } else {
        // If user tries to access this file directly from the browser without post something
        echo "Please, use the form to send data.";
    }

    
?>