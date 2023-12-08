// Initialize current question index
let currentQuestionIndex = 0;
let selectedOptions = Array(); // Array to store selected options for each question

document.addEventListener("DOMContentLoaded", function () {
    // Fetch questions from the server and display the first question
    fetchAndDisplayQuestion();
    // Fetch and display the question palette
    fetchAndDisplayQuestionPalette();
    // Start the timer when the page loads
    updateCountdown(); // or updateTimer(), depending on your choice
});

// Function to handle "Save and Next" button click
function saveAndNext() {
    // Save the selected option for the current question
    saveSelectedOption();

    // Increment the current question index
    currentQuestionIndex++;

    // Fetch and display the next question
    fetchAndDisplayQuestion();
    // Update the question palette
    fetchAndDisplayQuestionPalette();
}

// Function to handle jumping to a specific question
function jumpToQuestion(questionNumber) {
    // Save the selected option for the current question
    saveSelectedOption();

    // Set the current question index
    currentQuestionIndex = questionNumber - 1;

    // Fetch and display the selected question
    fetchAndDisplayQuestion();
    // Update the question palette
    fetchAndDisplayQuestionPalette();
}

function saveAndDisplayQuestion() {
    // Save the selected option for the current question
    saveSelectedOption();

    // Fetch and display the current question
    fetchAndDisplayQuestion();
    // Update the question palette
    fetchAndDisplayQuestionPalette();
}

// Updated function to save selected option with correct questionId
function saveSelectedOption() {
    // Save the selected option for the current question
    const selectedOption = document.querySelector('.option.selected');
    const questionIdInput = document.getElementById("questionId");

    if (selectedOption) {
        // Use the current question index to get the correct questionId
        const currentQuestion = document.querySelector('#questionContainer h3');
        const questionId = parseInt(currentQuestion.getAttribute('data-question-id')) || 0;

        selectedOptions[currentQuestionIndex] = {
            questionId: questionId,
            selectedOption: parseInt(selectedOption.dataset.value) || 0
        };
    } else {
        selectedOptions[currentQuestionIndex] = null;
    }

    // Log the selectedOptions array
    console.log('Selected Options:', selectedOptions);

    // Set the question ID in the form
    questionIdInput.value = selectedOption ? parseInt(selectedOption.getAttribute('data-question-id')) || 0 : '';
}


function fetchAndDisplayQuestion() {
    // Fetch questions from the server
    fetch('fetch_question.php')
        .then(response => response.json())
        .then(data => {
            console.log('Received data:', data); // Add this line for debugging

            // Check if there are more questions
            if (currentQuestionIndex < data.length) {
                // Display the question
                displayQuestion(data[currentQuestionIndex]);

                // Restore the selected option for the current question
                restoreSelectedOption();
            } else {
                // Handle the case when all questions are displayed
                alert("All questions have been answered.");
            }
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
        });
}

function restoreSelectedOption() {
    const selectedOption = selectedOptions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');

    options.forEach(option => option.classList.remove('selected'));

    if (selectedOption) {
        const selectedOptionElement = document.querySelector(`.option[data-question-id="${selectedOption.questionId}"][data-value="${selectedOption.selectedOption}"]`);
        if (selectedOptionElement) {
            selectedOptionElement.classList.add('selected');
        }
    }
}


function selectOption(option) {
    // Remove the "selected" class from all options
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected'));

    // Add the "selected" class to the clicked option
    option.classList.add('selected');
}

function displayQuestion(question) {
    // Assuming you have a div with the id "questionContainer" to display questions
    const questionContainer = document.getElementById("questionContainer");

    // Clear the existing content
    questionContainer.innerHTML = '';

    // Create HTML elements for the current question
    const questionElement = document.createElement("div");
    questionElement.innerHTML = `
    <h4>Question ${question.question_id}</h4>
    <h3 data-question-id="${question.question_id}">${question.question_text}</h3>
`;

    // Append the question element to the container
    questionContainer.appendChild(questionElement);

    // Display the selected option for the current question, if any
    const selectedOption = selectedOptions[currentQuestionIndex];
    const optionsContainer = document.createElement("div");
    optionsContainer.id = "optionsForm";

    for (let i = 1; i <= 4; i++) {
        const optionElement = document.createElement("div");
        optionElement.classList.add("option", "rounded"); // Added "rounded" class
        optionElement.classList.add("option");
        optionElement.dataset.value = i.toString();
        optionElement.textContent = question['option' + i]; // Corrected this line

        // Check if the option is selected and add the "selected" class
        if (selectedOption && selectedOption.questionId === question.question_id && selectedOption.selectedOption === i.toString()) {
            optionElement.classList.add("selected");
        }

        optionElement.addEventListener("click", function () {
            selectOption(this);
        });

        optionsContainer.appendChild(optionElement);
    }

    questionContainer.appendChild(optionsContainer);

    // Append the buttons to the container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.innerHTML = `
        <button type="button" id="resetButton" onclick="resetAnswer()">Reset Answer</button>
        <button type="button" id="saveNextButton" onclick="saveAndNext()">Save and Next</button>
    `;

    questionContainer.appendChild(buttonsContainer);
}



function fetchAndDisplayQuestionPalette() {
    // Fetch the total number of questions
    fetch('fetch_question.php')
        .then(response => response.json())
        .then(data => {
            // Assuming you have a div with the id "questionPaletteContainer" to display the palette
            const questionPaletteContainer = document.getElementById("questionPaletteContainer");

            // Clear the existing content
            questionPaletteContainer.innerHTML = '';

            // Create HTML elements for the question palette
            const questionPaletteElement = document.createElement("div");
            questionPaletteElement.id = "questionPalette";

            // Loop through each question and create a square in the palette
            for (let i = 0; i < data.length; i++) {
                const square = document.createElement("div");
                square.className = "question-box";
                square.textContent = i + 1; // Display question number

                // Add event listener for jumping to the clicked question
                square.addEventListener("click", function () {
                    jumpToQuestion(i + 1);
                });

                // Add classes to indicate the status of each question
                if (selectedOptions[i]) {
                    square.classList.add("answered");
                }
                if (i === currentQuestionIndex) {
                    square.classList.add("current-question");
                    square.style.backgroundColor = "blue"; // Set the background color to blue
                }

                questionPaletteElement.appendChild(square);
            }

            // Append the question palette element to the container
            questionPaletteContainer.appendChild(questionPaletteElement);
        })
        .catch(error => {
            console.error('Error fetching questions for palette:', error);
        });
}

// Function to reset the selected answer
function resetAnswer() {
    const options = document.querySelectorAll('.option');

    // Remove the "selected" class from all options
    options.forEach(option => option.classList.remove('selected'));

    // Remove the selected option from the array
    selectedOptions[currentQuestionIndex] = null;

    // Update the question palette
    fetchAndDisplayQuestionPalette();
}


// Function to submit the test
function submitTest() {
    // Save the selected option for the current question
    saveSelectedOption();

    // Include selected options in the form data
    const formData = new FormData(document.getElementById("submitTestForm"));
    formData.append("selectedOptions", JSON.stringify(selectedOptions));

    // Submit the test
    fetch('result.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(result => {
            // Display the result on the page or handle it as needed
            console.log(result);
        })
        .catch(error => {
            console.error('Error submitting the test:', error);
        });
}


let timeInSeconds = 20 * 60; // 20 minutes
const countdownElement = document.getElementById('countdown');


// Function to update the countdown timer
function updateCountdown() {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;

    countdownElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    if (timeInSeconds > 0) {
        timeInSeconds--;
        setTimeout(updateCountdown, 1000);
    } else {
        // Add logic for when time is up (e.g., submit the test automatically)
        Swal.fire({
            icon: 'info',
            title: 'Time Up',
            text: 'Time is up! Submitting the test.',
        }).then(() => {
            submitTest();
        });
    }
}
