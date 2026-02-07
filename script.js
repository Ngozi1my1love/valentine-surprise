const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionContainer = document.getElementById('questionContainer');
const successContainer = document.getElementById('successContainer');
const bgMusic = document.getElementById('bgMusic');
const successMusic = document.getElementById('successMusic');
const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');

// Set canvas size
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

// Resize canvas on window resize
window.addEventListener('resize', function() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
});

// Play background music when page loads
window.addEventListener('load', function() {
    bgMusic.play().catch(function(error) {
        console.log('Autoplay prevented. User interaction needed.');
    });
});

// Enable music on first user interaction (for browsers that block autoplay)
document.addEventListener('click', function enableMusic() {
    bgMusic.play();
    document.removeEventListener('click', enableMusic);
}, { once: true });

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

// Confetti particle class
class Confetti {
    constructor() {
        this.x = Math.random() * confettiCanvas.width;
        this.y = -10;
        this.size = Math.random() * 8 + 5;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.color = this.randomColor();
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }
    
    randomColor() {
        const colors = ['#ff6b6b', '#ee5a6f', '#f06595', '#cc5de8', '#845ef7', '#5c7cfa', '#339af0', '#22b8cf', '#20c997', '#51cf66', '#94d82d', '#ffd43b', '#ff922b'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        
        if (this.y > confettiCanvas.height) {
            this.y = -10;
            this.x = Math.random() * confettiCanvas.width;
        }
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

let confettiParticles = [];
let animationId;

function createConfetti() {
    for (let i = 0; i < 150; i++) {
        confettiParticles.push(new Confetti());
    }
}

function animateConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    confettiParticles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    animationId = requestAnimationFrame(animateConfetti);
}

// When "Yes" is clicked
yesBtn.addEventListener('click', function() {
    // Stop background music
    bgMusic.pause();
    bgMusic.currentTime = 0;
    
    // Play success music
    successMusic.play();
    
    // Hide the question
    questionContainer.classList.add('hidden');
    
    // Show the success message with photo
    successContainer.classList.remove('hidden');
    
    // Start confetti
    createConfetti();
    animateConfetti();
    
    // Send email notification
    sendEmailNotification();
});

// Function to send email notification
function sendEmailNotification() {
    fetch('https://formspree.io/f/mgoleyln', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Rachael said YES and listened to your song. She claims your voice is splendid😌👌👨‍🎤 💕',
            timestamp: new Date().toLocaleString()
        })
    }).then(response => {
        console.log('Notification sent!');
    }).catch(error => {
        console.log('Error:', error);
    });
}
