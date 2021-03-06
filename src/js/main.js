// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");

var $ = require("jquery");
var ich = require("icanhaz");

var questionTemplate = require("./_questionTemplate.html");
var resultTemplate = require("./_resultTemplate.html");
var overviewTemplate = require("./_overviewTemplate.html");

var score = 0;
var id = 1;

// Set up templates
ich.addTemplate("questionTemplate", questionTemplate);
ich.addTemplate("resultTemplate", resultTemplate);
ich.addTemplate("overviewTemplate", overviewTemplate);

//create new question from template
var showQuestion = function(questionId) {
  $(".question-box").html(ich.questionTemplate(quizData[id]));
  $(".index").html(id + " of " + Object.keys(quizData).length);
};

// show submit button when answer is selected
var watchInput = function() {
  $(".quiz-box").on("change", "input", function() {
    $(".submit").addClass("active");
    $(".submit").attr("disabled", false);
  });
};

$(".quiz-container").on("click", ".submit", function() {
  // track("interactive", "quiz", "submit-answer-" + id);

  // score answer
  var answerData = {};
  answerData.question = quizData[id].question;
  var correct = $("input:checked").val();
  if (correct) {
    score += 1;
    answerData.hooray = true;
  }

  // keep track of selected answer
  quizData[id].answers.forEach(function(a) {
    if (a.correct) {
      answerData.answer = a.answer;
      if (a.correct !== "x") answerData.correct = a.correct;
      answerData.img = quizData[id].img;
      answerData.category = quizData[id].category;
      answerData.credit = quizData[id].credit;
    }
  });

  $(".question-box").html(ich.resultTemplate(answerData));
  $(".index").html(id + " of " + Object.keys(quizData).length);

  // Change button text on last question
  if (id == Object.keys(quizData).length) {
    $(".next").html("Finish");
  }
  watchNext();
});

$(".quiz-container").on("click", ".retake", function() {
  id = 1;
  score = 0;
  showQuestion(id);
});


var watchNext = function() {
  $(".next").click(function() {
    if (id < Object.keys(quizData).length) {
      // move on to next question
      id += 1;
      showQuestion(id);
      $(".next").removeClass("active");
      $(".next").attr("disabled", true);
    } else {
      calculateResult();
    }
  });
};

var calculateResult = function() {
  var data = {
    total: Object.keys(quizData).length,
    results: resultsData,
    score
  };
  resultsData.forEach(r => r.match = score >= r.min && score <= r.max);
  $(".question-box").html(ich.overviewTemplate(data));
};

showQuestion(id);
watchInput();