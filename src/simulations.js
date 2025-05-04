// Helper function to safely get elements
const getElement = (id) => {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Element with id "${id}" not found`);
  }
  return element;
};

// Photosynthesis simulation logic
const lightSlider = getElement("light-intensity");
const waterSlider = getElement("water-level");
const co2Slider = getElement("co2-level");

const lightValue = getElement("light-value");
const waterValue = getElement("water-value");
const co2Value = getElement("co2-value");

const oxygenProgress = getElement("oxygen-progress");
const glucoseProgress = getElement("glucose-progress");
const growthProgress = getElement("growth-progress");

const plantRoots = getElement("plant-roots");
const plantStem = getElement("plant-stem");
const plantLeaves = getElement("plant-leaves");

const sunRay = getElement("sun-ray");
const waterDroplets = getElement("water-droplets");
const co2Particles = getElement("co2-particles");
const o2Particles = getElement("o2-particles");
const glucoseIndicators = getElement("glucose-indicators");

const updateDisplay = () => {
  if (lightValue) lightValue.textContent = lightSlider?.value + "%";
  if (waterValue) waterValue.textContent = waterSlider?.value + "%";
  if (co2Value) co2Value.textContent = co2Slider?.value + "%";
};

// Update values on slider input
[lightSlider, waterSlider, co2Slider].forEach(slider => {
  if (slider) {
    slider.addEventListener("input", updateDisplay);
  }
});

// Educational feedback system
const educationalFeedback = {
  photosynthesis: {
    light: {
      low: "Low light intensity reduces photosynthesis rate. Plants need sufficient light to produce energy.",
      optimal: "Optimal light intensity! This is ideal for photosynthesis.",
      high: "Very high light intensity! While plants can use this energy, excessive light can cause stress."
    },
    water: {
      low: "Low water levels limit photosynthesis. Water is essential for the process.",
      optimal: "Perfect water level! The plant has enough water for photosynthesis.",
      high: "High water levels! While plants need water, too much can cause root problems."
    },
    co2: {
      low: "Low CO₂ levels limit photosynthesis. Carbon dioxide is needed to produce glucose.",
      optimal: "Ideal CO₂ levels! The plant can efficiently produce glucose.",
      high: "High CO₂ levels! While plants use CO₂, excessive amounts can affect other processes."
    }
  }
};

// Function to provide educational feedback
const provideFeedback = (type, value) => {
  const feedback = educationalFeedback[type];
  if (!feedback) return;

  let message = '';
  if (value < 30) {
    message = feedback[type].low;
  } else if (value > 70) {
    message = feedback[type].high;
  } else {
    message = feedback[type].optimal;
  }

  // Create or update feedback element
  let feedbackElement = document.getElementById(`${type}-feedback`);
  if (!feedbackElement) {
    feedbackElement = document.createElement('div');
    feedbackElement.id = `${type}-feedback`;
    feedbackElement.className = 'educational-feedback';
    document.getElementById(`${type}-results`).appendChild(feedbackElement);
  }
  feedbackElement.textContent = message;
};

// Photosynthesis Start Button
const startButton = getElement("start-photosynthesis");
if (startButton) {
  startButton.addEventListener("click", () => {
    const light = parseInt(lightSlider?.value || 0);
    const water = parseInt(waterSlider?.value || 0);
    const co2 = parseInt(co2Slider?.value || 0);

    // Provide educational feedback
    provideFeedback('light', light);
    provideFeedback('water', water);
    provideFeedback('co2', co2);

    const oxygen = Math.round((light + water) / 2);
    const glucose = Math.round((light + co2) / 2);
    const growth = Math.round((light + water + co2) / 3);

    if (oxygenProgress) {
      oxygenProgress.style.width = `${oxygen}%`;
      oxygenProgress.textContent = `${oxygen}%`;
    }
    if (glucoseProgress) {
      glucoseProgress.style.width = `${glucose}%`;
      glucoseProgress.textContent = `${glucose}%`;
    }
    if (growthProgress) {
      growthProgress.style.width = `${growth}%`;
      growthProgress.textContent = `${growth}%`;
    }

    // Plant Animation
    if (plantRoots) plantRoots.style.transform = `scaleY(${light / 100})`;
    if (plantStem) plantStem.style.transform = `scaleY(${water / 100})`;
    if (plantLeaves) plantLeaves.style.transform = `scaleY(${co2 / 100})`;

    if (sunRay) sunRay.style.opacity = `${light / 100}`;
    if (waterDroplets) waterDroplets.style.opacity = `${water / 100}`;
    if (co2Particles) co2Particles.style.opacity = `${co2 / 100}`;
    if (o2Particles) o2Particles.style.opacity = `${oxygen / 100}`;
    if (glucoseIndicators) glucoseIndicators.style.opacity = `${glucose / 100}`;
  });
}

// Photosynthesis Reset Button
const resetButton = getElement("reset-photosynthesis");
if (resetButton) {
  resetButton.addEventListener("click", () => {
    [lightSlider, waterSlider, co2Slider].forEach(slider => {
      if (slider) {
        slider.value = 50;
      }
    });
    updateDisplay();
    [oxygenProgress, glucoseProgress, growthProgress].forEach(bar => {
      if (bar) {
        bar.style.width = "0%";
        bar.textContent = "";
      }
    });

    if (plantRoots) plantRoots.style.transform = "scaleY(0)";
    if (plantStem) plantStem.style.transform = "scaleY(0)";
    if (plantLeaves) plantLeaves.style.transform = "scaleY(0)";

    if (sunRay) sunRay.style.opacity = "0";
    if (waterDroplets) waterDroplets.style.opacity = "0";
    if (co2Particles) co2Particles.style.opacity = "0";
    if (o2Particles) o2Particles.style.opacity = "0";
    if (glucoseIndicators) glucoseIndicators.style.opacity = "0";
  });
}

// Sound Waves Simulation
function initializeSoundWaves() {
  const canvas = document.getElementById('sound-waves-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId = null;
  let audioContext = null;
  let oscillator = null;
  let gainNode = null;

  const frequencySlider = document.getElementById('frequency-slider');
  const amplitudeSlider = document.getElementById('amplitude-slider');
  const frequencyValue = document.getElementById('frequency-value');
  const amplitudeValue = document.getElementById('amplitude-value');
  const playButton = document.getElementById('play-sound');
  const stopButton = document.getElementById('stop-sound');

  let frequency = 440;
  let amplitude = 0.5;
  let phase = 0;

  function drawWave() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    
    // Draw horizontal lines
    for (let i = 0; i < canvas.height; i += 30) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw the wave
    ctx.beginPath();
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 2;

    for (let x = 0; x < canvas.width; x++) {
      const y = canvas.height/2 + Math.sin(x * 0.02 + phase) * amplitude * 100;
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    // Draw amplitude indicator
    ctx.beginPath();
    ctx.strokeStyle = '#FF5722';
    ctx.setLineDash([5, 5]);
    ctx.moveTo(0, canvas.height/2 - amplitude * 100);
    ctx.lineTo(canvas.width, canvas.height/2 - amplitude * 100);
    ctx.moveTo(0, canvas.height/2 + amplitude * 100);
    ctx.lineTo(canvas.width, canvas.height/2 + amplitude * 100);
    ctx.stroke();
    ctx.setLineDash([]);

    // Update phase for animation
    phase += 0.05;

    // Continue animation
    animationId = requestAnimationFrame(drawWave);
  }

  function updateFrequency(value) {
    frequency = value;
    frequencyValue.textContent = `${value} Hz`;
    if (oscillator) {
      oscillator.frequency.value = frequency;
    }
  }

  function updateAmplitude(value) {
    amplitude = value / 100;
    amplitudeValue.textContent = `${value}%`;
    if (gainNode) {
      gainNode.gain.value = amplitude;
    }
  }

  function startSound() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (!oscillator) {
      oscillator = audioContext.createOscillator();
      gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gainNode.gain.value = amplitude;

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
    }

    playButton.disabled = true;
    stopButton.disabled = false;
  }

  function stopSound() {
    if (oscillator) {
      oscillator.stop();
      oscillator = null;
      gainNode = null;
    }

    playButton.disabled = false;
    stopButton.disabled = true;
  }

  // Event listeners
  frequencySlider.addEventListener('input', (e) => updateFrequency(e.target.value));
  amplitudeSlider.addEventListener('input', (e) => updateAmplitude(e.target.value));
  playButton.addEventListener('click', startSound);
  stopButton.addEventListener('click', stopSound);

  // Initialize values
  updateFrequency(frequencySlider.value);
  updateAmplitude(amplitudeSlider.value);
  stopButton.disabled = true;

  // Start animation
  drawWave();

  // Cleanup function
  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    stopSound();
  };
}

// Topic selection and navigation
function selectTopic(topicId) {
  // Hide topic selection
  const topicSelection = document.querySelector('.topic-selection');
  if (topicSelection) {
    topicSelection.style.display = 'none';
  }
  
  // Show simulation container
  const simulationContainer = document.getElementById('simulation-container');
  if (simulationContainer) {
    simulationContainer.style.display = 'block';
  }
  
  // Hide all sections first
  document.querySelectorAll('section').forEach(section => {
    section.style.display = 'none';
  });
  
  // Show selected section
  const selectedSection = document.getElementById(topicId);
  if (selectedSection) {
    selectedSection.style.display = 'block';
    
    // Update topic info
    const topicName = document.getElementById('topic-name');
    const topicImage = document.getElementById('topic-image');
    const topicDescription = document.getElementById('topic-description');
    
    if (topicName) {
      topicName.textContent = selectedSection.querySelector('h2').textContent;
    }
    
    if (topicImage) {
      topicImage.src = `assets/${topicId}.svg`;
      topicImage.alt = `${topicId} visualization`;
    }
    
    if (topicDescription) {
      const description = selectedSection.querySelector('.educational-content p');
      if (description) {
        topicDescription.textContent = description.textContent;
      }
    }

    // Add active class to selected topic card
    document.querySelectorAll('.topic-card').forEach(card => {
      card.classList.remove('active');
      if (card.id === `${topicId}-topic`) {
        card.classList.add('active');
      }
    });

    // Initialize sound waves if it's the selected topic
    if (topicId === 'sound-waves') {
      initializeSoundWaves();
    }
  }
  
  // Add back button
  const existingBackButton = document.querySelector('.back-button');
  if (existingBackButton) {
    existingBackButton.remove();
  }
  
  const backButton = document.createElement('button');
  backButton.className = 'simulation-button back-button';
  backButton.textContent = 'Back to Topics';
  backButton.onclick = () => {
    if (simulationContainer) {
      simulationContainer.style.display = 'none';
    }
    if (topicSelection) {
      topicSelection.style.display = 'flex';
    }
    // Remove active class from all topic cards
    document.querySelectorAll('.topic-card').forEach(card => {
      card.classList.remove('active');
    });
  };
  
  if (simulationContainer) {
    simulationContainer.insertBefore(backButton, simulationContainer.firstChild);
  }
}

// Add event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add click event listeners to all topic cards
  document.querySelectorAll('.topic-card').forEach(card => {
    card.addEventListener('click', () => {
      const topicId = card.id.replace('-topic', '');
      selectTopic(topicId);
    });
  });

  // Add hover effects to interactive elements
  document.querySelectorAll('.interactive-element').forEach(element => {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  });
});
