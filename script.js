const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionContainer = document.getElementById('questionContainer');
const successContainer = document.getElementById('successContainer');

// Function to move the "No" button away
function moveNoButton() {
    const maxX = window.innerWidth - noBtn.offsetWidth - 50;
    const maxY = window.innerHeight - noBtn.offsetHeight - 50;
    
    const randomX = Math.max(20, Math.floor(Math.random() * maxX));
    const randomY = Math.max(20, Math.floor(Math.random() * maxY));
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
}

// Make the "No" button run away on mouse hover (desktop)
noBtn.addEventListener('mouseenter', moveNoButton);

// Make the "No" button run away on touch/click attempt (mobile)
noBtn.addEventListener('touchstart', function(e) {
    e.preventDefault();
    moveNoButton();
});

noBtn.addEventListener('click', function(e) {
    e.preventDefault();
    moveNoButton();
});

// When "Yes" is clicked
yesBtn.addEventListener('click', function() {
    // Hide the question
    questionContainer.classList.add('hidden');
    
    // Show the success message with photo
    successContainer.classList.remove('hidden');
    
    // Send email notification
    sendEmailNotification();
});

// Function to send email notification
function sendEmailNotification() {
    // We'll use Formspree for this - you'll add your email endpoint here
    fetch('https://formspree.io/f/mgoleyln', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Ngozi said YES! 💕',
            timestamp: new Date().toLocaleString()
        })
    }).then(response => {
        console.log('Notification sent!');
    }).catch(error => {
        console.log('Error:', error);
    });
}
