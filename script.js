let questions;
let content;
let submitButton;

async function fetchQuestion(url) {
    try {
        await fetch(url)
            .then(response => response.text())
            .then(text => {
                const data = text.split('\n').map(row => row.split('\t'));
                questions = formatData(data);
            })
    } catch (error) {
        console.error('error loading csv file');
        return;
    }

    questions = random(questions, 15);

    renderQuestions();
}

async function setUpContent(url) {
    content.innerHTML = '';

    const divider = document.createElement('div');
    divider.classList.add('divider');

    content.appendChild(divider);

    document.getElementById('score').style.display = 'none';
    submitButton.style.display = 'block';
    
    await fetchQuestion(url);
}

document.addEventListener('DOMContentLoaded', async function () {
    content = document.getElementById('content');
    submitButton = document.getElementById('submit');
    submitButton.addEventListener('click', checkAnswer);

    await setUpContent('https://testbucket7612675.s3.ap-southeast-1.amazonaws.com/english-test/easy.tsv');
});

function formatData(data) {
    const rows = data
    const questions = rows.slice(1).map(
        (row) => {
            answer = [row[8], row[9], row[10], row[11], row[12]];

            return {
                label: row[1],
                choice: [
                    { label: row[2].replace(/^"|"$/g, ''), isCorrect: answer.includes('A') },
                    { label: row[3].replace(/^"|"$/g, ''), isCorrect: answer.includes('B') },
                    { label: row[4].replace(/^"|"$/g, ''), isCorrect: answer.includes('C') },
                    { label: row[5].replace(/^"|"$/g, ''), isCorrect: answer.includes('D') },
                    { label: row[6].replace(/^"|"$/g, ''), isCorrect: answer.includes('E') },
                    { label: row[7].replace(/^"|"$/g, ''), isCorrect: answer.includes('F') },
                ],
            }
        }
    )
    return questions;
}

function renderQuestions() {

    let i=0;

    questions.forEach((question, index) => {
        const questionContainer = document.createElement('div'); //create question container
        questionContainer.classList.add('questionContainer');

        const questionLabelContainer = document.createElement('div'); //create question label container
        questionLabelContainer.style.display = 'flex';
        questionLabelContainer.style.flexDirection = 'row';
        questionLabelContainer.style.gap = '4px';
        questionLabelContainer.setAttribute('id', `question-${index}`);
        questionContainer.appendChild(questionLabelContainer);

        const questionNumber = document.createElement('span'); //create question number
        questionNumber.innerText = index + 1 + ".  ";

        const questionLabel = document.createElement('span'); //create question label
        questionLabel.setAttribute('id', `question-${index}-label`);
        questionLabel.innerText = question.label;

        questionLabelContainer.appendChild(questionNumber);
        questionLabelContainer.appendChild(questionLabel);

        const choices = Object.keys(question.choice); //get all keys of question.choice
        choices.forEach((choice) => { //render each choice
            if (!question.choice[choice].label) return;
            const choiceContainer = document.createElement('div'); //create choice container
            choiceContainer.classList.add('choiceContainer');
            choiceContainer.setAttribute('id', `question-${index}-choice-${choice}`);
            choiceContainer.addEventListener('click', () => { //click anywhere on the container to select the choice
                const choiceInput = document.getElementById(`question-${index}-choice-${choice}-input`);
                choiceInput.click();
            });
            choiceContainer.style.cursor = 'pointer';
            choiceContainer.style.width = 'fit-content';

            const choiceLabel = document.createElement('label'); //create choice label
            choiceLabel.classList.add('choiceLabel');
            choiceLabel.innerText = question.choice[choice].label;
            choiceLabel.style.cursor = 'pointer';
            choiceLabel.style.marginTop = '2px';

            const choiceInput = document.createElement('input'); //create choice checkbox
            choiceInput.setAttribute('type', 'radio');
            choiceInput.setAttribute('name', `question-${index}`);
            choiceInput.setAttribute('value', question.choice[choice].isCorrect);
            choiceInput.setAttribute('id', `question-${index}-choice-${choice}-input`);
            choiceInput.style.cursor = 'pointer';


            choiceContainer.appendChild(choiceInput);
            choiceContainer.appendChild(choiceLabel);
            questionContainer.appendChild(choiceContainer); //append choice to question container
        });
        content.appendChild(questionContainer); //append question to content
    });
}

function checkAnswer() {

    if (!confirm('Are you sure you want to submit and check answer?')) return;

    let score = 0;

    for (let i = 0; i < questions.length; i++) {

        const questionContainer = document.getElementById(`question-${i}`);
        const questionLabel = document.getElementById(`question-${i}-label`);

        for (let j = 0; j < questions[i].choice.length; j++) {
            if (!questions[i].choice[j].label) continue;

            const choiceInput = document.getElementById(`question-${i}-choice-${j}-input`);
            const choice = document.getElementById(`question-${i}-choice-${j}`);
            if (choiceInput.value === 'true' && choiceInput.checked) {
                score++;
            }
            choiceInput.disabled = true;
        }
    }
    const scoreLabel = document.getElementById('score');
    scoreLabel.innerText = `Your score is ${score}/${questions.length}`;

    scoreLabel.style.display = 'flex';
    submitButton.style.display = 'none';

    window.scrollTo(0, document.body.scrollHeight);
}

function random(arr, num) {
    // Copy the array to avoid mutating the original array
    let shuffled = arr.slice(0);

    // Fisher-Yates (Knuth) shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Slice the first `num` elements
    return shuffled.slice(0, num);
}