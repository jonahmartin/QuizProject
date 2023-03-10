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
        //builds quiz based on json file
        buildQuiz(json);
        //sends parsed json to buttons so that button functions can use it
        delcareButtons();
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

//randomly selects radio buttons for each question
function generateAnswers() {
  let questions = document.querySelectorAll(".question");
  //console.log("working");

  //loops through each question on page
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

//builds quiz based on json file
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
  //adds tabs to page, active if first one
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

  //adds questions to page, hidden if not the first one
  let htmlString = "";
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

    for (let j = 0; j < json.questions[i].choices.length; j++) {
      htmlString +=
        "<div class='inputLabelContainer'><input type = 'radio' name = 'Q" + //radio button input
        (i + 1) + //name for radio buttons all the same for each question
        "' id = '" +
        (i + 1) + //each id different for radio buttons for label tag to refer to
        letters[j] +
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

  let questionsArea = document.querySelector("#questionsArea");
  questionsArea.innerHTML = htmlString;
}
