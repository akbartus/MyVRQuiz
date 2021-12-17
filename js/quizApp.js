/* Who wants to become a millionnaire Quiz game code
Written by Akbar Sultanov and Levon Tumasov
*/
const app = function () {
    let myData = {};
    let answersArray = [];
    const output = document.querySelector('.output');
    let answersDiv = document.createElement('div');
    const fiftyButton = document.getElementById('fiftyFifty');
    fiftyButton.addEventListener('click', helpFifty);
    let recommendButton = document.getElementById('callToFriend');
    recommendButton.addEventListener('click', helpRecommend);
    let nextQuestionButton = document.getElementById('nextQuestion');
    nextQuestionButton.addEventListener('click', helpNext);
    let restartButton = document.getElementById('restart');
    restartButton.addEventListener('click', restart);
    let currentScore = document.getElementById('currentScore');
    let currentLevel = document.getElementById('currentLevel');
    let game = {};


    // LOAD DATA
    function LoadData(quizLink) {
        const base = quizLink;
        //const base = 'https://docs.google.com/spreadsheets/d/' + quizLink + '/gviz/tq?';
        const output = document.querySelector('.output');
        const query = encodeURIComponent('Select A,B,C,D,E');
        const url = base + '&tq=' + query;
        fetch(url)
            .then(res => res.text())
            .then(rep => { // ASYNC METHOD CALL WHEN ALL DATA RECIVED
                const data = JSON.parse(rep.substr(47).slice(0, -2)); // STRIP USLESS DATA
                myData = parseQuestions(data.table.rows); // PARSE QUESTIONS
                loadOutput(); // MAKE QUESTIONS
            });
    }


    function parseQuestions(sheetRows) {
        let questions = [];

        for (i = 1; i < sheetRows.length; i++) { // SKIP 1 ROW
            // Get question and answer values based on rows
            let question = {
                question: sheetRows[i].c[0].v,
                correct: sheetRows[i].c[1].v,
                answer1: sheetRows[i].c[2].v,
                answer2: sheetRows[i].c[3].v,
                answer3: sheetRows[i].c[4].v,
            };
            questions.push(question); // ADD QUESTION

        }
        console.log(questions.length);
        let sheet = { 'Questions': questions }; // PREPARE SHEET WITH QUESTIONS
        return sheet; // FINAL RESULT ARRAY OF SHEETS WITH QUESTIONS
    }


    // load data function
    function init() {
        LoadData(quizLink);
    }

    // load Output function
    function loadOutput() {
        let select = document.createElement("select");
        let firstRun = true; // run the quiz
        for (let key in myData) {
            let option = document.createElement('option');
            option.value = key;
            option.textContent = key;
            select.appendChild(option);
            // Run the quiz
            if (firstRun) {
                firstRun = false;
                quizBuilder(key);
            }
            // End
        }
    }

    // Show Quiz
    function outputQuiz(e) {
        quizBuilder(e.target.value);
    }

    // Build Quiz    
    function quizBuilder(quizName) {
        game.page = 0;
        game.score = 0;
        currentScore.innerHTML = "Score: " + game.score;
        game.curQuiz = shuffleQuestions(myData[quizName]);
        game.totalQuestions = game.curQuiz.length;
        currentLevel.innerHTML = "Level: " + (game.page + 1);
        questioner();


    }

    // 50 And 50
    function helpFifty() {
        let halfLenght = answersArray.length / 2;
        while (answersArray.length > halfLenght) {
            let randomIndex = getRandomInt(answersArray.length);
            if (answersArray[randomIndex].status) continue; // IF TRUE
            answersArray.splice(randomIndex, 1);
        }
        outputAnswer(answersArray);
        document.getElementById("audio21").play();
        fiftyButton.style = "display: none";
        fiftyButton.removeEventListener('click', helpFifty);
    }

    // Get Random
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    // Shuffle Questions
    function shuffleQuestions(questions) {
        let shuffleArray = [];
        let i = 0;
        while (questions.length > 0) {
            let randomIndex = getRandomInt(questions.length);
            shuffleArray[i] = questions[randomIndex];
            questions.splice(randomIndex, 1);
            i++;
        }
        return shuffleArray;
    }

    // Make Call
    // Select Random Person to make a call
    const people = ["Ivan Sutherland", "Charles Linscott", "Morton Heilig", "Albert Einstein", "Eric Williams", "John Bowditch", "Akbar Sultanov", "Brian Koscho"];
    const phrases = ["I think it is", "I am sure it is", "Maybe it is", "Try", "What about", "That's easy. Choose", "Mmm.", "Let's try"];
    const randomPerson = Math.floor(Math.random() * people.length);
    const randomPhrase = Math.floor(Math.random() * phrases.length);

    function helpRecommend() {
        let rightAnswer;
        let i = 0;
        while (i < answersArray.length) {
            if (answersArray[i].status == true) {
                rightAnswer = answersArray[i].letter; // + ': ' + answersArray[i].answer;
                break;
            }
            i++;
        }

        /*for (let  i = 0 ; i < answersArray.length ; i++)
        {
            if(answersArray[i].status != true) continue;
            
            rightAnswer = answersArray[i].letter + ' ' + answersArray[i].answer;
            break;
        }*/

        //console.log("Correct answer is", rightAnswer);
        document.getElementById("audio20").play();
        setTimeout(function () {
            document.getElementById("callText").innerHTML = people[randomPerson] + ": " + phrases[randomPhrase] + " '" + rightAnswer + "'";
        document.getElementById("callText").setAttribute("style", "background: #ffcb0c;");
        }, 4000);
       
        // recommendButton.style = "display: none";
        // recommendButton.removeEventListener('click', helpFifty);

    }
 
    // Next question
    function helpNext() {
        document.getElementById("audio22").play();
        game.score++
        currentScore.innerHTML = "Score: " + game.score;
        game.page++;
        questioner();
        nextQuestionButton.style = "display: none";
        nextQuestionButton.removeEventListener('click', helpNext);
     }


    function questioner() {
        output.innerHTML = "";
        // If game is over
      //game.totalQuestions
        if (game.page >= 15) {
            document.getElementById("hostLabel").setAttribute("style", "display:none;")
                document.getElementById("fiftyFifty").setAttribute("style", "display:none;")
                document.getElementById("callToFriend").setAttribute("style", "display:none;")
                document.getElementById("nextQuestion").setAttribute("style", "display:none;")
                currentScore.setAttribute("style", "display:none;");
                currentLevel.setAttribute("style", "display:none;");
            document.getElementById("callText").setAttribute("style", "opacity: 0;");
            output.innerHTML = '<div class="gameOver">GAME OVER. YOU WON</div>';
            output.innerHTML += '<div class="scoreOutput">Your total score is ' + game.score + '</div>';

            // If game continues
        } else {
            let holder = game.curQuiz[game.page];
            let div = document.createElement('div');
            div.textContent = holder.question;
            div.className += "myQ";
            output.appendChild(div);
            let tempArray = [];
            for (let key in holder) {
                if (key != "question") {
                    let ans = holder[key]
                    let res = false;
                    if (key == "correct") {
                        res = true;
                    }
                    if (ans) {
                        tempArray.push({
                            answer: ans,
                            status: res
                        });
                    }
                }
            }

            shuffleArray(tempArray);
            addLetters(tempArray);
            answersArray = tempArray;
            outputAnswer(tempArray);
        }
    }


    // Answers of each question
    function outputAnswer(outputAnswersArray) {
        answersDiv.innerHTML = "";
        for (let i = 0; i < outputAnswersArray.length; i++) {
            let span = document.createElement('span');
            span.checkme = outputAnswersArray[i].status;
            span.addEventListener('click', checkAnswer);
            span.className += "btnAns";
            span.textContent = outputAnswersArray[i].letter + ". " + outputAnswersArray[i].answer;
            answersDiv.appendChild(span);
            answersDiv.letter = getLetter(i);
        }
        output.appendChild(answersDiv);

    }

    function addLetters(answersArray) {
        for (let i = 0; i < answersArray.length; i++) {
            answersArray[i].letter = getLetter(i);
        }
    }

    function getLetter(index) {
        switch (index) {
            case 0:
                return "A";
            case 1:
                return "B";
            case 2:
                return "C";
            case 3:
                return "D";
        }
    }

    // Shuffle answers every time randomly
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    function checkAnswer(e) {
        // if not correct answer, show        
        if (!e.target.checkme) {
            document.getElementById("audio4").play();
            setTimeout(function () {
                //let responder = "Sorry Incorrect";
                document.getElementById("hostLabel").setAttribute("style", "display:none;")
                document.getElementById("fiftyFifty").setAttribute("style", "display:none;")
                document.getElementById("callToFriend").setAttribute("style", "display:none;")
                document.getElementById("nextQuestion").setAttribute("style", "display:none;")
                currentScore.setAttribute("style", "display:none;");
                currentLevel.setAttribute("style", "display:none;");
                document.getElementById("callText").setAttribute("style", "opacity: 0;");
                output.innerHTML = "";
                output.innerHTML = '<div class="scoreOutput">GAME OVER</div>';
                document.getElementsByClassName("scoreOutput")[0].setAttribute("style", "font-size:30px; font-weight:bold; padding: 10px 0px; color: #ffcb0c;");
                output.innerHTML += '<div class="scoreOutput">Your score is ' + game.score + '</div>';
                restartButton.setAttribute("style", "display:block;")
            }, 1500);

        }

 

        if (e.target.checkme) {
            game.score++;
            currentScore.innerHTML = "Score: " + game.score;
            responder = "Correct";
            document.getElementById("audio3").play();
            document.getElementById("callText").setAttribute("style", "opacity: 0;");
            game.page++;
            currentLevel.innerHTML = "Level: " + (game.page + 1);
            questioner();
        }
    }

    // Restart the game at the end
    function restart(){
        location.reload();   
    }
    // Collision Function
    let playerEl = document.querySelector('[camera]');
    let answerA = document.getElementById("answerA");
    let answerB = document.getElementById("answerB");
    let answerC = document.getElementById("answerC");
    let answerD = document.getElementById("answerD");

    // Check answer for collisions
    function checkAnswerCollide(e) {

        if (!e.status) {
            let responder = "Sorry Incorrect";
            output.innerHTML = "";
            output.innerHTML = '<div class="scoreOutput">GAME OVER</div>';
            document.getElementsByClassName("scoreOutput")[0].setAttribute("style", "font-size:30px; font-weight:bold; padding: 10px 0px; color: #ffcb0c;");
            output.innerHTML += '<div class="scoreOutput">Your score is ' + game.score + '</div>';
        }

        if (e.status) {
            game.score++;
            currentScore.innerHTML = "Score: " + game.score;
            responder = "Correct";
            game.page++;
            questioner();
        }
    }


    playerEl.addEventListener('collide', function (e) {

        // inCollision = true;
        // if (inCollision) return;

        if (e.detail.body.id == 0) {

            checkAnswerCollide(answersArray[0]);
            answerA.setAttribute("position", "-1.65 4.3 -7");

            setTimeout(function () {
                answerA.setAttribute("position", "-1.65 4.3 -6.7");
            }, 3000);


        } else if (e.detail.body.id == 1) {

            checkAnswerCollide(answersArray[1]);
            answerB.setAttribute("position", "1.55 4.3 -7");
            setTimeout(function () {
                answerB.setAttribute("position", "1.55 4.3 -6.7");
            }, 3000);


        } else if (e.detail.body.id == 2) {

            checkAnswerCollide(answersArray[2]);
            answerC.setAttribute("position", "-1.65 3.75 -7");
            setTimeout(function () {
                answerC.setAttribute("position", "-1.65 3.75 -6.7");
            }, 3000);

        } else if (e.detail.body.id == 3) {

            checkAnswerCollide(answersArray[3]);
            answerD.setAttribute("position", "1.55 3.75 -7");
            setTimeout(function () {
                answerD.setAttribute("position", "1.55 3.75 -6.7");
            }, 3000);
        }
    });

    // // ARRAY COLLIDER
    // let colliders =[]; /// aframe box with colliders
    // // RESET COLIDER AFTER TURN
    // for(let i = 0 ; i < colliders.lenght; i++){
    //     collider[i].enable = true; // RETURN COLLIDER
    // }



    return {
        init: init
    }
}(); // Self invoked script example. It is used to sel running and limiting
document.getElementById("start").addEventListener('click', app.init); // start app function 