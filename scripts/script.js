document.getElementById('header').innerHTML = `
  <header>
    <nav>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="contact.html">Contact</a></li>
        <li><a href="projects.html">Projects</a></li>
      </ul>
    </nav>
  </header>
`;

// JavaScript for smooth scroll to top
document.getElementById('top-link').addEventListener('click', function(event) {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Form submission handling
document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Clear previous error messages
  clearErrors();

  // Validate form fields
  let isValid = validateForm();

  if (isValid) {
    document.getElementById('formFeedback').textContent = 'Thank you for your message!';
    document.getElementById('formFeedback').className = 'form-feedback success';
  }
});

function validateForm() {
  let isValid = true;

  let name = document.getElementById('name').value.trim();
  if (name === '') {
    showError('nameError', 'Name is required.');
    isValid = false;
  }

  let email = document.getElementById('email').value.trim();
  if (email === '') {
    showError('emailError', 'Email is required.');
    isValid = false;
  } else if (!validateEmail(email)) {
    showError('emailError', 'Please enter a valid email address.');
    isValid = false;
  }

  let message = document.getElementById('message').value.trim();
  if (message === '') {
    showError('messageError', 'Message is required.');
    isValid = false;
  }

  return isValid;
}

function showError(elementId, message) {
  let errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}

function clearErrors() {
  let errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(function(element) {
    element.textContent = '';
    element.style.display = 'none';
  });
}

function validateEmail(email) {
  let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

document.getElementById('header').innerHTML = `
  <header>
    <nav>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="contact.html">Contact</a></li>
        <li><a href="projects.html">Projects</a></li>
      </ul>
    </nav>
  </header>
`;

// JavaScript for smooth scroll to top
document.getElementById('top-link').addEventListener('click', function(event) {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Dinosaur game logic
const dino = document.getElementById('dino');
const obstacle = document.getElementById('obstacle');
const scoreElement = document.getElementById('score');

let score = 0;
let isJumping = false;

function jump() {
  if (isJumping) return;
  isJumping = true;
  let upInterval = setInterval(() => {
    if (dino.offsetTop <= 60) {
      clearInterval(upInterval);
      let downInterval = setInterval(() => {
        if (dino.offsetTop >= 110) {
          clearInterval(downInterval);
          isJumping = false;
        } else {
          dino.style.bottom = dino.offsetTop + 5 + 'px';
        }
      }, 10);
    } else {
      dino.style.bottom = dino.offsetTop - 5 + 'px';
    }
  }, 10);
}

function moveObstacle() {
  let obstacleLeft = obstacle.offsetLeft;
  let interval = setInterval(() => {
    if (obstacleLeft <= 0) {
      clearInterval(interval);
      score++;
      scoreElement.innerText = `Score: ${score}`;
      obstacleLeft = 600;
      obstacle.style.left = obstacleLeft + 'px';
      moveObstacle();
    } else {
      obstacleLeft -= 10;
      obstacle.style.left = obstacleLeft + 'px';

      // Check for collision
      if (
        obstacleLeft < 90 &&
        obstacleLeft > 50 &&
        dino.offsetTop >= 110
      ) {
        alert('Game Over');
        clearInterval(interval);
        score = 0;
        scoreElement.innerText = `Score: ${score}`;
        obstacleLeft = 600;
        obstacle.style.left = obstacleLeft + 'px';
        moveObstacle();
      }
    }
  }, 50);
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    jump();
  }
});

moveObstacle();
document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Form field values
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  let valid = true;

  // Clear previous error messages
  document.getElementById('nameError').innerText = '';
  document.getElementById('emailError').innerText = '';
  document.getElementById('messageError').innerText = '';

  // Name validation
  if (name.trim() === '') {
      document.getElementById('nameError').innerText = 'Please enter your name.';
      valid = false;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
      document.getElementById('emailError').innerText = 'Please enter a valid email.';
      valid = false;
  }

  // Message validation
  if (message.trim() === '') {
      document.getElementById('messageError').innerText = 'Please enter your message.';
      valid = false;
  }

  if (valid) {
      document.getElementById('formFeedback').innerText = 'Your message has been sent! Thank you for reaching out.';
      document.getElementById('formFeedback').style.color = 'green';
      document.getElementById('contactForm').reset();
  }
});
