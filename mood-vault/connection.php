<?php 

$host = 'localhost';
$db = 'db_pomodoro';
$user = 'root';
$pass = ''; // In XAMPP, the standard password is null

try {
    // Create a new connection PDO (PHP Data Objects) Object
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);

    // Configurate the PHP to alert if there is any error in SQL
    $pdo -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Connection successfully established!";
} catch (PDOException $e) {
    // If connection fails, it "takes" the error here
    die("Error connecting: " . $e -> getMessage());
}

?>