window.onload = function () {
  getData();
};

//ajax call
function getData() {
  let url = "GeographyQuiz.json";
  let xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        let response = xhr.responseText;
        let json = JSON.parse(response);
        clearResults();
        //declares buttons & adds event listeners
        delcareButtons();
        //builds quiz based on json file
        buildQuiz(json);
        tabClick();
      }
      //error getting data
      else {
        console.log(`Error: server sent status code ${xhr.status}`);
      }
    }
  };

  xhr.open("GET", url, true);
  xhr.send();
}
//adds clicking functionality to tabs
//to hide or shows appropriate tab content
function tabClick() {
  let tabs = document.querySelectorAll(".tab");
  //adds event listener to each tab on screen
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", showTab);
  }
}
//shows clicked tab content, hides all others
function showTab(evt) {
  let currentTab = evt.target;
  let tabCount = document.querySelectorAll(".tab");

  //removes active status from tabs
  for (let i = 0; i < tabCount.length; i++) {
    tabCount[i].classList.remove("active");
  }
  //adds active status to current tab
  currentTab.classList.add("active");

  //cycles through each question & removes hidden class
  //then re-adds hidden class if current index != the index most recently clicked tab
  for (let i = 0; i < tabCount.length; i++) {
    let question = document.querySelector("#tabContent" + (i + 1));
    question.classList.remove("hidden");

    if (tabCount[i] != currentTab) {
      question.classList.add("hidden");
    }
  }
}

//declares & adds event listeners to buttons
function delcareButtons() {
  //for loading new quiz
  let btnNewQuiz = document.querySelector("#btnNewQuiz");
  btnNewQuiz.addEventListener("click", getNewData);
  //for generating new answers
  let btnGenerateAnswers = document.querySelector("#btnGenerateAnswers");
  btnGenerateAnswers.addEventListener("click", generateAnswers);
  //submit button
  let btnSubmit = document.querySelector("#btnQuizSubmit");
  btnSubmit.addEventListener("click", showResults);
}

//fetches new json file based on dropdown selection in html
function getNewData() {
  let dropdown = document.querySelector("select");
  let options = dropdown.querySelectorAll("option");
  let selectedIndex = dropdown.selectedIndex;
  //default file
  let url = "GeographyQuiz.json";
  if (options[selectedIndex].value == "Math") {
    console.log("working");
    url = "MathQuiz.json";
  }
  let xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        let response = xhr.responseText;
        let json = JSON.parse(response);

        clearResults();
        //builds quiz based on json file
        buildQuiz(json);
        tabClick();
      }
      //error getting data
      else {
        console.log(`Error: server sent status code ${xhr.status}`);
      }
    }
  };

  xhr.open("GET", url, true);
  xhr.send();
}

//determines which
function generateAnswers() {
  let result = prompt(
    "What kind of result would you like to generate? (type one of the following)\n\nOption 1 - Random\nOption 2 - 0%\nOption 3 - 100%",
    "Random"
  );

  if (result == "Random" || result == "random") {
    generateRandomAnswers();
  } else if (result == "0%" || result == "100%") {
    generatePercentResult(result);
  } else {
    alert("Invalid input, please try again");
  }
}

//randomly selects radio buttons for each question
function generateRandomAnswers() {
  //all questions
  let questions = document.querySelectorAll(".question");

  //loops through each question
  //generates a random number between 0 & the number of radio buttons
  //uses that random number to index a radio button to changed checked property of
  for (let i = 0; i < questions.length; i++) {
    let options = questions[i].querySelectorAll("input");
    //math.floor rounds the decimal number down to closest integer
    //math.random generates a number between 0 and 1, must multiply by the number of options to get an integer
    let randomNumber = Math.floor(Math.random() * options.length);
    options[randomNumber].checked = true;
  }
}

//generates a quiz that is 100% correct or 0% correct depending on amount sent in
function generatePercentResult(result) {}

//builds quiz based on json file
//builds intially hidden table to be show later
function buildQuiz(json) {
  let titleArea = document.querySelector("h1");
  let titleText = json.title;
  titleArea.innerHTML = "&#128221;" + titleText;
  let activeStatus = "";

  //to identify each multiple choice answer
  //allows up to 10 options. More of the alphabet can be added if needed
  let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  let htmlTabString = "";
  let isActive = "";
  //adds tabs to page, first one is active by default
  for (let i = 0; i < json.questions.length; i++) {
    if (i == 0) {
      isActive = "active";
    } else {
      isActive = "";
    }

    htmlTabString +=
      "<div class='" + isActive + " tab'>Question " + (i + 1) + "</div>";
  }
  let tabArea = document.querySelector("#tabContainer");
  tabArea.innerHTML = htmlTabString;

  //string for questions html
  let htmlString = "";
  //string for results table html
  let htmlTableString =
    "<table><tr><th>Question #</th><th>Question Text</th><th>Correct Answer</th><th>Your Answer</th><th>Score</th></tr>";

  //adds questions to page, tab content hidden if not the first one
  for (let i = 0; i < json.questions.length; i++) {
    if (i != 0) {
      activeStatus = "hidden";
    }
    htmlString +=
      "<div class = '" +
      activeStatus +
      "' id = 'tabContent" +
      (i + 1) + //new tab id
      "'><div class='question'><h2>Question " +
      (i + 1) + //question number
      "</h2>" +
      "<p>" + //question text
      json.questions[i].questionText +
      "</p>";

    let correctAnswerAsIndex = json.questions[i].answer;
    //builds table on page with all data except for user answer data
    //table is invisible until user clicks submit & their data gets entered into table
    htmlTableString +=
      "<tr><td>Question " +
      (i + 1) +
      "</td><td>" +
      json.questions[i].questionText +
      "</td><td class = 'correctAnswer'>" +
      json.questions[i].choices[correctAnswerAsIndex] +
      "</td><td class ='yourAnswer'></td><td class = 'score'></td><td class = 'checkX'></td>" +
      "</tr>";

    //for radio buttons within question
    for (let j = 0; j < json.questions[i].choices.length; j++) {
      //checks if currect radio button is the correct answer
      if (j == json.questions[i].answer) {
        correctAnswers = "correct";
      } else {
        correctAnswers = "";
      }
      htmlString +=
        "<div class='inputLabelContainer'><input type = 'radio' name = 'Q" + //radio button input
        (i + 1) + //name for radio buttons all the same for each question
        "' id = '" +
        (i + 1) + //each id different for radio buttons for label tag to refer to
        letters[j] +
        "' class = '" +
        correctAnswers +
        "'>" +
        "<label for = '" +
        (i + 1) +
        letters[j] +
        "'>" +
        json.questions[i].choices[j] +
        "</div></label>";

      //console.log(json.questions[i].choices[j]);
    }

    htmlString += "</div></div>";
  }

  htmlTableString += "</table>";
  //putting table html on page
  let tableArea = document.querySelector("#results");
  tableArea.innerHTML = htmlTableString;

  console.log(htmlTableString);

  //putting questions html on page
  let questionsArea = document.querySelector("#questionsArea");
  questionsArea.innerHTML = htmlString;
}

//loops through each question to check if question has been answered
//if they have, then it displays a table with all correct/incorrect answers and a score
function showResults() {
  let questions = document.querySelectorAll(".question");
  let yourAnswer = document.querySelectorAll(".yourAnswer");
  let answered = 0;
  let correctAnswers = 0;
  let scoreValue = document.querySelectorAll(".score");
  let rows = document.querySelectorAll("tr:not(:first-child)");
  //to loop through questions on page
  for (let i = 0; i < questions.length; i++) {
    let radioButtons = questions[i].querySelectorAll("input");
    //to loop through radio buttons on questions
    for (let j = 0; j < radioButtons.length; j++) {
      //tests for answered questions
      if (radioButtons[j].checked == true) {
        answered++;
        //add answered question text to table on page

        let labels = questions[i].querySelectorAll("label");
        //setting your answer field in table to inner html of corresponding label
        yourAnswer[i].innerHTML = labels[j].innerHTML;
      }
      //tests for correct answers
      if (
        radioButtons[j].checked == true &&
        radioButtons[j].classList.contains("correct")
      ) {
        //to give us a score
        correctAnswers++;
      }

      scoreValue[i].innerHTML = "";

      let correctAnswer = document.querySelectorAll(".correctAnswer");
      let emojiCell = rows[i].querySelector(".checkX");
      if (correctAnswer[i].innerHTML == yourAnswer[i].innerHTML) {
        scoreValue[i].innerHTML = "1";
        if (rows[i].classList.contains("red")) {
          rows[i].classList.remove("red");
        }
        rows[i].classList.add("green");
        emojiCell.innerHTML = "&#9989;";
      } else {
        if (rows[i].classList.contains("green")) {
          rows[i].classList.remove("green");
        }
        rows[i].classList.add("red");
        scoreValue[i].innerHTML = "0";
        emojiCell.innerHTML = "&#10060;";
      }
    }
  }

  //checks if all questions have been answered
  if (answered != questions.length) {
    alert("All questions must be answered to submit");
  }
  //adds score to page
  else {
    let percentGrade = (correctAnswers / questions.length) * 100;
    let score = document.querySelector("#score");
    let scoreString =
      "You Scored: " +
      correctAnswers +
      " / " +
      questions.length +
      " (" +
      percentGrade +
      "%)";

    score.innerHTML = scoreString;

    if (percentGrade >= 60) {
      //pass - remove red class if it has it & apply green
      if (score.classList.contains("red")) {
        score.classList.remove("red");
      }
      score.classList.add("green");
    }
    //fail - remove green class if it has it & apply red
    else {
      if (score.classList.contains("green")) {
        score.classList.remove("green");
      }
      score.classList.add("red");
    }
    if (percentGrade == 100) {
      alert("Good job, 100%!");
    }
    score.classList.remove("hidden");

    //adds elements to already built table and removes hidden class from table
    let resultsTable = document.querySelector("#results");

    let yourAnswer = document.querySelectorAll(".yourAnswer");

    //shows table
    resultsTable.classList.remove("hidden");
  }
}

//clears quiz results
function clearResults() {
  //quiz score
  let score = document.querySelector("#score");
  score.innerHTML = "";
  score.classList.add("hidden");

  //table
  let resultsTable = document.querySelector("#results");
  resultsTable.innerHTML = "";
  resultsTable.classList.add("hidden");
}
