// ==UserScript==
// @name         Khan Answers
// @namespace    http://dothething.net/
// @version      0.2
// @description  Get all the answers to Khan Academy worksets
// @author       You
// @match        https://www.khanacademy.org/*
// @grant        none
// ==/UserScript==

var firstCall = true;
var questionData = null;

(function(open) {
    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        if(url.indexOf("/api/internal/user/exercises/") > -1 && firstCall) {
            console.log("we've got a live one!");
            firstCall = false;
            $.get( url, function( data ) {
                questionData = JSON.parse(data.itemData);
                setTimeout(runAnswers, 3000);
            });
        }
        open.call(this, method, url, async, user, pass);
    };
})(XMLHttpRequest.prototype.open);

function runAnswers() {
    $(document).ready(function() {
        $("#next-question-button").on( "click", function() {
            window.location.reload();
        });
    });
    $('#hintsarea').append("<p><b>ANSWERS</b></p>");
    // Simple text input answers
    var i = 0;
    try {
        for(i = 0; i < parseInt(ObjectLength(questionData.question.widgets)); i++) {
            console.log(questionData.question.widgets['input-number ' + (i + 1)].options.value);
            $('#hintsarea').append("<p>Input " + (i + 1) + ": " + questionData.question.widgets['input-number ' + (i + 1)].options.value + "</p><br>");
        }
    } catch(err) {}
    // Expression answers
    try {
        for(i = 0; i < parseInt(ObjectLength(questionData.question.widgets)); i++) {
            //console.log(questionData.question.widgets['expression ' + (i + 1)].options.answerForms);
            var expressionAnswers = questionData.question.widgets['expression ' + (i + 1)].options.answerForms;
            expressionAnswers.forEach(function(answerArray, index, array) {
                $('#hintsarea').append("<p>Expression " + (i + 1) + ": " + answerArray.value + "</p><br>");
            });
            
        }
    } catch(err) {}
    // Button dropdown answers
    try {
        for(i = 0; i < parseInt(ObjectLength(questionData.question.widgets)); i++) {
            var answersForDropdown = questionData.question.widgets['dropdown ' + (i + 1)].options.choices;
            var correctAnswers = "";
            answersForDropdown.forEach(function(answer, index, array) {
                if(answer.correct == true) {
                    correctAnswers = correctAnswers + answer.content + ', ';
                }
            });
            //console.log("Dropdown " + (i + 1) + ": " + correctAnswers);
            $('#hintsarea').append("<p>Dropdown " + (i + 1) + ": " + correctAnswers + "</p><br>");
        }
    } catch(err) {}
    // Radio or Checkbox answers
    try {
        for(i = 0; i < parseInt(ObjectLength(questionData.question.widgets)); i++) {
            var answersForDropdown = questionData.question.widgets['radio ' + (i + 1)].options.choices;
            var correctAnswers = "";
            answersForDropdown.forEach(function(answer, index, array) {
                if(answer.correct == true) {
                    correctAnswers = correctAnswers + answer.content + ', ';
                }
            });
            //console.log("Radio " + (i + 1) + ": " + correctAnswers);
            $('#hintsarea').append("<p>Radio/Checkbox " + (i + 1) + ": " + correctAnswers + "</p><br>");
        }
    } catch(err) {}
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function ObjectLength( object ) {
    var length = 0;
    for( var key in object ) {
        if( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
};
