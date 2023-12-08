<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test result</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>
  <link rel="stylesheet" href="https://unicons.iconscout.com/release/v3.0.6/css/line.css">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
        }

        .navbar {
            font-family: 'Poppins', sans-serif;
        }

        .container {
            padding-top: 20px;
        }

        #resultContainer {
            text-align: center;
            margin-top: 50px;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
        }

        h2 {
            color: #007BFF;
        }

        p {
            color: #28A745;
        }

        .btn-rounded {
            border-radius: 20px;
        }
        
        /* Style for the share and download buttons */
        .btn-share {
            background-color: #007BFF;
            color: #fff;
        }

        .btn-download {
            background-color: #28A745;
            color: #fff;
        }

        .btn-icon {
            margin-right: 8px;
        }
    </style>
</head>
<body>
    
<!-- Navbar Section -->
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
        <!-- Company Logo -->
        <a class="navbar-brand" href="#"><img src="company-logo.png" alt="Company Logo"></a>

        <!-- Navbar Links -->
        <div class="collapse navbar-collapse" id="navbarNav">


                    
            <!-- Logout Option -->
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="#" onclick="logout()">Logout</a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<div class="container">
        <div id="resultContainer">

<?php
// Database connection parameters
$servername = "localhost"; // Replace with your actual database host
$username = "root"; // Replace with your actual database username
$password = ""; // Replace with your actual database password
$dbname = "exam";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch correct answers from the database
$sql = "SELECT question_id, correct_option FROM reg"; // Assuming the table name is 'questions'
$result = $conn->query($sql);

if ($result) {
    $totalQuestions = $result->num_rows;
    $score = 0;

    // Assuming you have stored the user's selected answers in the $_POST['selectedOptions'] variable
    $userSelectedAnswers = json_decode($_POST['selectedOptions'], true);

    // Loop through each question to evaluate the score
    foreach ($userSelectedAnswers as $selectedAnswer) {
        // Check if the question was attempted
        if (isset($selectedAnswer['questionId']) && isset($selectedAnswer['selectedOption'])) {
            // Include the question_id in the returned data as an integer
            $questionId = (int) $selectedAnswer['questionId'];
            $selectedOption = (int) $selectedAnswer['selectedOption'];

            // Fetch the correct option from the database for this question
            $sql = "SELECT correct_option FROM reg WHERE question_id = $questionId";
            $correctOptionResult = $conn->query($sql);

            if ($correctOptionResult && $correctOptionResult->num_rows > 0) {
                $row = $correctOptionResult->fetch_assoc();
                $correctOption = (int) $row['correct_option'];

                // Compare the user's selected option with the correct option
                if ($selectedOption === $correctOption) {
                    $score++; // Increase score if the answer is correct
                }
            } else {
                echo "Error fetching correct option for question $questionId: " . $conn->error;
            }
        }
    }

    // Debugging: Print user selected options
   

    // Debugging: Print total score
    echo "Total Score: $score out of $totalQuestions<br>";

    // Display the user's score
    echo "<h2>Your Score: $score out of $totalQuestions</h2>";

    // Additional result information (customize as needed)
    if ($score == $totalQuestions) {
        echo "<p>Congratulations! You answered all questions correctly.</p>";
    } elseif ($score >= $totalQuestions / 2) {
        echo "<p>Good job! You passed the test.</p>";
    } else {
        echo "<p>Keep practicing. You can improve!</p>";
    }
} else {
    echo "Error fetching correct answers: " . $conn->error;
}

// Close the database connection
$conn->close();
?>

<button class="btn btn-share btn-rounded">
                <i class="fas fa-share-alt btn-icon"></i> Share
            </button>

            <!-- Report Download Button -->
            <button class="btn btn-download btn-rounded">
                <i class="fas fa-download btn-icon"></i> Download Report
            </button>


</div>
</div>

</body>
</html>