<?php
// Establish a connection to the database
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "exam";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch questions from the database
$sql = "SELECT * FROM reg";
$result = $conn->query($sql);

// Store the questions in an array
$questions = array();

while ($row = $result->fetch_assoc()) {
    // Include the question_id in the returned data as an integer
    $row['question_id'] = (int) $row['question_id'];
    $questions[] = $row;
}

// Close the database connection
$conn->close();

// Return the questions as JSON
echo json_encode($questions);
?>
