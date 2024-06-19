let questions;
let content;
let submitButton;

document.addEventListener('DOMContentLoaded', async function () {

    let questions1, questions2, questions3;

    content = document.getElementById('content');

    submitButton = document.getElementById('submit');
    submitButton.addEventListener('click', checkAnswer);

    try {
        await fetch('https://testbucket7612675.s3.ap-southeast-1.amazonaws.com/english-test/easy.tsv')
            .then(response => response.text())
            .then(text => {
                const data1 = text.split('\n').map(row => row.split('\t'));
                questions1 = formatData(data1);
            })
        await fetch('https://testbucket7612675.s3.ap-southeast-1.amazonaws.com/english-test/medium.tsv')
            .then(response => response.text())
            .then(text => {
                const data2 = text.split('\n').map(row => row.split('\t'));
                questions2 = formatData(data2);
            })
        await fetch('https://testbucket7612675.s3.ap-southeast-1.amazonaws.com/english-test/hard.tsv')
            .then(response => response.text())
            .then(text => {
                const data3 = text.split('\n').map(row => row.split('\t'));
                questions3 = formatData(data3);
            })
    } catch (error) {
        console.error('error loading csv file');
        return;
    }

    questions = random(questions1, 10).concat(random(questions2, 10)).concat(random(questions3, 10));

    renderQuestions();

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

    questions.forEach((question, index) => {
        const questionContainer = document.createElement('div');
        questionContainer.classList.add('questionContainer');

        const questionLabelContainer = document.createElement('div');
        questionLabelContainer.style.display = 'flex';
        questionLabelContainer.style.flexDirection = 'row';
        questionLabelContainer.setAttribute('id', `question-${index}`);
        questionContainer.appendChild(questionLabelContainer);

        const questionLabel = document.createElement('span');
        questionLabel.setAttribute('id', `question-${index}-label`);
        questionLabel.innerText = index + 1 + ".  " + question.label;
        questionLabelContainer.appendChild(questionLabel);

        const choices = Object.keys(question.choice);
        choices.forEach((choice) => {
            if (!question.choice[choice].label) return;
            const choiceContainer = document.createElement('div');
            choiceContainer.classList.add('choiceContainer');
            choiceContainer.setAttribute('id', `question-${index}-choice-${choice}`);
            choiceContainer.addEventListener('click', () => {
                const choiceInput = document.getElementById(`question-${index}-choice-${choice}-input`);
                choiceInput.click();
            });
            choiceContainer.style.cursor = 'pointer';
            choiceContainer.style.width = 'fit-content';

            const choiceLabel = document.createElement('label');
            choiceLabel.classList.add('choiceLabel');
            choiceLabel.innerText = question.choice[choice].label;
            choiceLabel.style.cursor = 'pointer';
            choiceLabel.style.marginTop = '2px';

            const choiceInput = document.createElement('input');
            choiceInput.setAttribute('type', 'radio');
            choiceInput.setAttribute('name', `question-${index}`);
            choiceInput.setAttribute('value', question.choice[choice].isCorrect);
            choiceInput.setAttribute('id', `question-${index}-choice-${choice}-input`);
            choiceInput.style.cursor = 'pointer';


            choiceContainer.appendChild(choiceInput);
            choiceContainer.appendChild(choiceLabel);
            questionContainer.appendChild(choiceContainer);
        });
        content.appendChild(questionContainer);
    });
}

function checkAnswer() {

    if (!confirm('Are you sure you want to submit and check answer?')) return;

    let score = 0;
    for (let i = 0; i < questions.length; i++) {

        let isCorrect = false;

        const questionContainer = document.getElementById(`question-${i}`);
        const questionLabel = document.getElementById(`question-${i}-label`);

        for (let j = 0; j < questions[i].choice.length; j++) {
            if (!questions[i].choice[j].label) continue;

            const choiceInput = document.getElementById(`question-${i}-choice-${j}-input`);
            const choice = document.getElementById(`question-${i}-choice-${j}`);
            if (choiceInput.value === 'true') {
                if (choiceInput.checked) {
                    choice.style.color = 'green';
                    isCorrect = true;
                } else {
                    choice.style.color = 'green';
                }
            }
            else {
                if (choiceInput.checked) {
                    choice.style.color = 'red';
                    isCorrect = false;
                }
            }
            choiceInput.disabled = true;
        }

        const quesionScoreLabel = document.createElement('div');
        quesionScoreLabel.classList.add('questionScoreLabel');

        if (isCorrect) {
            questionLabel.style.color = 'green';
            quesionScoreLabel.innerText = '1/1';
            score++;
        } else {
            questionLabel.style.color = 'red';
            quesionScoreLabel.innerText = '0/1';
        }
        questionContainer.appendChild(quesionScoreLabel);
    }
    const scoreLabel = document.getElementById('score');
    scoreLabel.innerText = `Your score is ${score}/${questions.length}`;

    submitButton.innerText = 'Retry?';
    submitButton.removeEventListener('click', checkAnswer);
    submitButton.addEventListener('click', () => {
        if (!confirm('Are you sure you want to retry?')) return;
        window.location.reload();
    });
    scoreLabel.style.visibility = 'visible';

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
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