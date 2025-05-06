// Helper function to safely get elements
const getElement = (id) => {
  const element = document.getElementById(id);
  if (!element) {
    console.error(`Element with id "${id}" not found`);
  }
  return element;
};

// Initialize photosynthesis elements only if they exist
function initializePhotosynthesisElements() {
    // First check if we're on the photosynthesis page
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    if (currentPage !== 'photosynthesis') {
        return;
    }

    const elements = {
        lightSlider: getElement("light-intensity"),
        waterSlider: getElement("water-level"),
        co2Slider: getElement("co2-level"),
        lightValue: getElement("light-value"),
        waterValue: getElement("water-value"),
        co2Value: getElement("co2-value"),
        oxygenProgress: getElement("oxygen-progress"),
        glucoseProgress: getElement("glucose-progress"),
        growthProgress: getElement("growth-progress"),
        plantRoots: getElement("plant-roots"),
        plantStem: getElement("plant-stem"),
        plantLeaves: getElement("plant-leaves"),
        sunRay: getElement("sun-ray"),
        waterDroplets: getElement("water-droplets"),
        co2Particles: getElement("co2-particles"),
        o2Particles: getElement("o2-particles"),
        glucoseIndicators: getElement("glucose-indicators"),
        startButton: getElement("start-photosynthesis"),
        resetButton: getElement("reset-photosynthesis")
    };

    // Only initialize if we're on the photosynthesis page and have the required elements
    if (elements.lightSlider && elements.waterSlider && elements.co2Slider) {
        const updateDisplay = () => {
            if (elements.lightValue) elements.lightValue.textContent = elements.lightSlider?.value + "%";
            if (elements.waterValue) elements.waterValue.textContent = elements.waterSlider?.value + "%";
            if (elements.co2Value) elements.co2Value.textContent = elements.co2Slider?.value + "%";
        };

        // Update values on slider input
        [elements.lightSlider, elements.waterSlider, elements.co2Slider].forEach(slider => {
            if (slider) {
                slider.addEventListener("input", updateDisplay);
            }
        });

        // Initialize start button
        if (elements.startButton) {
            elements.startButton.addEventListener("click", () => {
                const light = parseInt(elements.lightSlider?.value || 0);
                const water = parseInt(elements.waterSlider?.value || 0);
                const co2 = parseInt(elements.co2Slider?.value || 0);

                // Provide educational feedback
                provideFeedback('light', light);
                provideFeedback('water', water);
                provideFeedback('co2', co2);

                const oxygen = Math.round((light + water) / 2);
                const glucose = Math.round((light + co2) / 2);
                const growth = Math.round((light + water + co2) / 3);

                if (elements.oxygenProgress) {
                    elements.oxygenProgress.style.width = `${oxygen}%`;
                    elements.oxygenProgress.textContent = `${oxygen}%`;
                }
                if (elements.glucoseProgress) {
                    elements.glucoseProgress.style.width = `${glucose}%`;
                    elements.glucoseProgress.textContent = `${glucose}%`;
                }
                if (elements.growthProgress) {
                    elements.growthProgress.style.width = `${growth}%`;
                    elements.growthProgress.textContent = `${growth}%`;
                }

                // Plant Animation
                if (elements.plantRoots) elements.plantRoots.style.transform = `scaleY(${light / 100})`;
                if (elements.plantStem) elements.plantStem.style.transform = `scaleY(${water / 100})`;
                if (elements.plantLeaves) elements.plantLeaves.style.transform = `scaleY(${co2 / 100})`;

                if (elements.sunRay) elements.sunRay.style.opacity = `${light / 100}`;
                if (elements.waterDroplets) elements.waterDroplets.style.opacity = `${water / 100}`;
                if (elements.co2Particles) elements.co2Particles.style.opacity = `${co2 / 100}`;
                if (elements.o2Particles) elements.o2Particles.style.opacity = `${oxygen / 100}`;
                if (elements.glucoseIndicators) elements.glucoseIndicators.style.opacity = `${glucose / 100}`;
            });
        }

        // Initialize reset button
        if (elements.resetButton) {
            elements.resetButton.addEventListener("click", () => {
                [elements.lightSlider, elements.waterSlider, elements.co2Slider].forEach(slider => {
                    if (slider) {
                        slider.value = 50;
                    }
                });
                updateDisplay();
                [elements.oxygenProgress, elements.glucoseProgress, elements.growthProgress].forEach(bar => {
                    if (bar) {
                        bar.style.width = "0%";
                        bar.textContent = "";
                    }
                });

                if (elements.plantRoots) elements.plantRoots.style.transform = "scaleY(0)";
                if (elements.plantStem) elements.plantStem.style.transform = "scaleY(0)";
                if (elements.plantLeaves) elements.plantLeaves.style.transform = "scaleY(0)";

                if (elements.sunRay) elements.sunRay.style.opacity = "0";
                if (elements.waterDroplets) elements.waterDroplets.style.opacity = "0";
                if (elements.co2Particles) elements.co2Particles.style.opacity = "0";
                if (elements.o2Particles) elements.o2Particles.style.opacity = "0";
                if (elements.glucoseIndicators) elements.glucoseIndicators.style.opacity = "0";
            });
        }
    }
}

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
  const feedback = educationalFeedback.photosynthesis;
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
    const resultsElement = document.getElementById(`${type}-results`);
    if (resultsElement) {
      resultsElement.appendChild(feedbackElement);
    }
  }
  feedbackElement.textContent = message;
};

// Sound Wave Simulation
class SoundWaveSimulation {
    constructor() {
        this.audioContext = null;
        this.oscillator = null;
        this.gainNode = null;
        this.isPlaying = false;
        this.canvas = document.getElementById('wave-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.animationFrame = null;
        
        // Initialize controls
        this.frequencyControl = document.getElementById('frequency');
        this.amplitudeControl = document.getElementById('amplitude');
        this.waveTypeControl = document.getElementById('wave-type');
        this.playButton = document.getElementById('play-btn');
        this.fullscreenButton = document.getElementById('fullscreen-btn');
        this.resetButton = document.getElementById('reset-btn');
        
        // Bind event listeners
        this.bindEvents();
        
        // Set initial canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    bindEvents() {
        this.frequencyControl.addEventListener('input', () => this.updateFrequency());
        this.amplitudeControl.addEventListener('input', () => this.updateAmplitude());
        this.waveTypeControl.addEventListener('change', () => this.updateWaveType());
        this.playButton.addEventListener('click', () => this.togglePlay());
        this.fullscreenButton.addEventListener('click', () => this.toggleFullscreen());
        this.resetButton.addEventListener('click', () => this.reset());
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.drawWave();
    }
    
    initializeAudio() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
        }
    }
    
    createOscillator() {
        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.type = this.waveTypeControl.value;
        this.oscillator.frequency.value = this.frequencyControl.value;
        this.oscillator.connect(this.gainNode);
    }
    
    updateFrequency() {
        const frequency = this.frequencyControl.value;
        this.frequencyControl.nextElementSibling.textContent = `${frequency} Hz`;
        if (this.oscillator) {
            this.oscillator.frequency.value = frequency;
        }
        this.drawWave();
    }
    
    updateAmplitude() {
        const amplitude = this.amplitudeControl.value / 100;
        this.amplitudeControl.nextElementSibling.textContent = `${this.amplitudeControl.value}%`;
        if (this.gainNode) {
            this.gainNode.gain.value = amplitude;
        }
        this.drawWave();
    }
    
    updateWaveType() {
        if (this.oscillator) {
            this.oscillator.type = this.waveTypeControl.value;
        }
        this.drawWave();
    }
    
    drawWave() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const ctx = this.ctx;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Set wave properties
        const frequency = this.frequencyControl.value;
        const amplitude = (this.amplitudeControl.value / 100) * (height / 2);
        const type = this.waveTypeControl.value;
        
        // Draw wave
        ctx.beginPath();
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 2;
        
        for (let x = 0; x < width; x++) {
            const t = x / width;
            let y;
            
            switch (type) {
                case 'sine':
                    y = height/2 + amplitude * Math.sin(2 * Math.PI * frequency * t);
                    break;
                case 'square':
                    y = height/2 + amplitude * Math.sign(Math.sin(2 * Math.PI * frequency * t));
                    break;
                case 'triangle':
                    y = height/2 + amplitude * (2 * Math.abs(2 * (frequency * t - Math.floor(frequency * t + 0.5))) - 1);
                    break;
                case 'sawtooth':
                    y = height/2 + amplitude * (2 * (frequency * t - Math.floor(frequency * t + 0.5)));
                    break;
            }
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
    }
    
    togglePlay() {
        if (!this.isPlaying) {
            this.initializeAudio();
            this.createOscillator();
            this.oscillator.start();
            this.isPlaying = true;
            this.playButton.textContent = 'Stop Sound';
            this.animate();
        } else {
            this.stop();
        }
    }
    
    stop() {
        if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator = null;
        }
        this.isPlaying = false;
        this.playButton.textContent = 'Play Sound';
        cancelAnimationFrame(this.animationFrame);
    }
    
    animate() {
        this.drawWave();
        if (this.isPlaying) {
            this.animationFrame = requestAnimationFrame(() => this.animate());
        }
    }
    
    toggleFullscreen() {
        const container = document.querySelector('.simulation-container');
        if (!document.fullscreenElement) {
            container.requestFullscreen();
            this.fullscreenButton.textContent = 'Exit Fullscreen';
        } else {
            document.exitFullscreen();
            this.fullscreenButton.textContent = 'Fullscreen';
        }
    }
    
    reset() {
        this.stop();
        this.frequencyControl.value = 440;
        this.amplitudeControl.value = 50;
        this.waveTypeControl.value = 'sine';
        this.updateFrequency();
        this.updateAmplitude();
        this.updateWaveType();
    }
}

// Initialize sound wave simulation
function initializeSoundWaveSimulation() {
    new SoundWaveSimulation();
}

// Photosynthesis Simulation
class PhotosynthesisSimulation {
    constructor() {
        this.canvas = document.getElementById('plant-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isRunning = false;
        this.animationFrame = null;
        
        // Initialize controls
        this.lightIntensity = document.getElementById('light-intensity');
        this.co2Level = document.getElementById('co2-level');
        this.waterLevel = document.getElementById('water-level');
        this.temperature = document.getElementById('temperature');
        this.startButton = document.getElementById('start-btn');
        this.fullscreenButton = document.getElementById('fullscreen-btn');
        this.resetButton = document.getElementById('reset-btn');
        
        // Bind event listeners
        this.bindEvents();
        
        // Set initial canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    bindEvents() {
        this.lightIntensity.addEventListener('input', () => this.updateDisplay());
        this.co2Level.addEventListener('input', () => this.updateDisplay());
        this.waterLevel.addEventListener('input', () => this.updateDisplay());
        this.temperature.addEventListener('input', () => this.updateDisplay());
        this.startButton.addEventListener('click', () => this.toggleSimulation());
        this.fullscreenButton.addEventListener('click', () => this.toggleFullscreen());
        this.resetButton.addEventListener('click', () => this.reset());
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.draw();
    }
    
    updateDisplay() {
        this.lightIntensity.nextElementSibling.textContent = `${this.lightIntensity.value}%`;
        this.co2Level.nextElementSibling.textContent = `${this.co2Level.value}%`;
        this.waterLevel.nextElementSibling.textContent = `${this.waterLevel.value}%`;
        this.temperature.nextElementSibling.textContent = `${this.temperature.value}°C`;
        this.draw();
    }
    
    draw() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const ctx = this.ctx;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw plant (simplified representation)
        this.drawPlant(ctx, width, height);
        
        // Draw environmental factors
        this.drawEnvironmentalFactors(ctx, width, height);
    }
    
    drawPlant(ctx, width, height) {
        // Draw stem
        ctx.beginPath();
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 10;
        ctx.moveTo(width/2, height);
        ctx.lineTo(width/2, height/2);
        ctx.stroke();
        
        // Draw leaves
        ctx.beginPath();
        ctx.fillStyle = '#4CAF50';
        ctx.ellipse(width/2, height/2, 50, 30, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw flower
        if (this.isRunning) {
            ctx.beginPath();
            ctx.fillStyle = '#FFC107';
            ctx.arc(width/2, height/2 - 50, 20, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawEnvironmentalFactors(ctx, width, height) {
        // Draw sun
        ctx.beginPath();
        ctx.fillStyle = '#FFC107';
        ctx.arc(width - 50, 50, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw water level
        const waterHeight = (this.waterLevel.value / 100) * 50;
        ctx.fillStyle = 'rgba(33, 150, 243, 0.3)';
        ctx.fillRect(0, height - waterHeight, 50, waterHeight);
    }
    
    toggleSimulation() {
        this.isRunning = !this.isRunning;
        this.startButton.textContent = this.isRunning ? 'Stop Simulation' : 'Start Simulation';
        
        if (this.isRunning) {
            this.animate();
        } else {
            cancelAnimationFrame(this.animationFrame);
        }
    }
    
    animate() {
        this.draw();
        if (this.isRunning) {
            this.animationFrame = requestAnimationFrame(() => this.animate());
        }
    }
    
    toggleFullscreen() {
        const container = document.querySelector('.simulation-container');
        if (!document.fullscreenElement) {
            container.requestFullscreen();
            this.fullscreenButton.textContent = 'Exit Fullscreen';
        } else {
            document.exitFullscreen();
            this.fullscreenButton.textContent = 'Fullscreen';
        }
    }
    
    reset() {
        this.isRunning = false;
        this.startButton.textContent = 'Start Simulation';
        this.lightIntensity.value = 50;
        this.co2Level.value = 50;
        this.waterLevel.value = 50;
        this.temperature.value = 25;
        this.updateDisplay();
        cancelAnimationFrame(this.animationFrame);
    }
}

// Initialize photosynthesis simulation
function initializePhotosynthesisSimulation() {
    new PhotosynthesisSimulation();
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
      initializeSoundWaveSimulation();
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
    // Get current page
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    
    // Initialize photosynthesis elements only if on the photosynthesis page
    if (currentPage === 'photosynthesis') {
        initializePhotosynthesisElements();
    }

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

    // Initialize simulations based on current page
    let simulation = null;
    
    try {
        switch(currentPage) {
            case 'sound-waves':
                simulation = new SoundWaveSimulation();
                break;
            case 'photosynthesis':
                simulation = new PhotosynthesisSimulation();
                break;
            case 'simple-machines':
                simulation = new SimpleMachinesSimulation();
                break;
            case 'water-cycle':
                simulation = new WaterCycleSimulation();
                break;
            case 'solar-system':
                simulation = new SolarSystemSimulation();
                break;
            case 'human-heart':
                simulation = new HumanHeartSimulation();
                break;
            case 'digestive-system':
                simulation = new DigestiveSystemSimulation();
                break;
            default:
                // Initialize topic selection if on index page
                if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
                    initializeTopicSelection();
                }
        }

        // Add error handling for canvas initialization
        if (simulation && simulation.canvas) {
            const ctx = simulation.canvas.getContext('2d');
            if (!ctx) {
                console.error('Could not get 2D context for canvas');
                return;
            }
            
            // Add resize handler
            window.addEventListener('resize', () => {
                if (simulation.resizeCanvas) {
                    simulation.resizeCanvas();
                }
            });
            
            // Add fullscreen handler
            const fullscreenButton = document.querySelector('.fullscreen-btn');
            if (fullscreenButton) {
                fullscreenButton.addEventListener('click', () => {
                    const container = document.querySelector('.simulation-container');
                    if (!document.fullscreenElement) {
                        container.requestFullscreen();
                        fullscreenButton.textContent = 'Exit Fullscreen';
                    } else {
                        document.exitFullscreen();
                        fullscreenButton.textContent = 'Fullscreen';
                    }
                });
            }
        }
    } catch (error) {
        console.error(`Error initializing ${currentPage} simulation:`, error);
        // Show error message to user
        const container = document.querySelector('.simulation-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2>Error Loading Simulation</h2>
                    <p>There was an error loading the simulation. Please try refreshing the page.</p>
                    <button onclick="window.location.reload()" class="simulation-button">Refresh Page</button>
                </div>
            `;
        }
    }
});

// Initialize topic selection
function initializeTopicSelection() {
    document.querySelectorAll('.topic-card').forEach(card => {
        card.addEventListener('click', () => {
            const topicId = card.id.replace('-topic', '');
            window.location.href = `src/${topicId}.html`;
        });
    });
}

// Add error handling for canvas initialization
function initializeCanvas(canvasId) {
    console.log(`Initializing canvas: ${canvasId}`);
    const canvas = getElement(canvasId);
    if (!canvas) {
        console.error(`Canvas with id "${canvasId}" not found`);
        return null;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get 2D context for canvas');
        return null;
    }
    
    console.log(`Canvas initialized successfully: ${canvasId}`);
    return { canvas, ctx };
}

// Add resize handler
function handleResize(canvas) {
    if (!canvas) return;
    
    const resizeCanvas = () => {
        const container = canvas.parentElement;
        if (!container) return;
        
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    return resizeCanvas;
}

// Add fullscreen handler
function handleFullscreen(container) {
    if (!container) return;
    
    const fullscreenButton = container.querySelector('.fullscreen-btn');
    if (!fullscreenButton) return;
    
    fullscreenButton.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            container.requestFullscreen();
            fullscreenButton.textContent = 'Exit Fullscreen';
        } else {
            document.exitFullscreen();
            fullscreenButton.textContent = 'Fullscreen';
        }
    });
}

// Add loading state handler
function setLoading(element, isLoading) {
    if (!element) return;
    
    if (isLoading) {
        element.classList.add('loading');
    } else {
        element.classList.remove('loading');
    }
}

// Simple Machines Simulation
class SimpleMachinesSimulation {
    constructor() {
        console.log('Initializing SimpleMachinesSimulation');
        const canvasData = initializeCanvas('machine-canvas');
        if (!canvasData) {
            console.error('Failed to initialize canvas for SimpleMachinesSimulation');
            return;
        }
        
        this.canvas = canvasData.canvas;
        this.ctx = canvasData.ctx;
        this.isRunning = false;
        this.animationFrame = null;
        
        // Initialize controls
        this.machineType = getElement('machine-type');
        this.force = getElement('force');
        this.distance = getElement('distance');
        this.startButton = getElement('start-btn');
        this.resetButton = getElement('reset-btn');
        
        if (!this.machineType || !this.force || !this.distance || !this.startButton || !this.resetButton) {
            console.error('Failed to initialize controls for SimpleMachinesSimulation');
            return;
        }
        
        // Bind event listeners
        this.bindEvents();
        
        // Set initial canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        console.log('SimpleMachinesSimulation initialized successfully');
    }
    
    bindEvents() {
        this.machineType.addEventListener('change', () => this.updateDisplay());
        this.force.addEventListener('input', () => this.updateDisplay());
        this.distance.addEventListener('input', () => this.updateDisplay());
        this.startButton.addEventListener('click', () => this.toggleSimulation());
        this.resetButton.addEventListener('click', () => this.reset());
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.draw();
    }
    
    updateDisplay() {
        this.force.nextElementSibling.textContent = `${this.force.value}N`;
        this.distance.nextElementSibling.textContent = `${this.distance.value}m`;
        this.draw();
    }
    
    draw() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const ctx = this.ctx;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw the selected machine
        switch(this.machineType.value) {
            case 'lever':
                this.drawLever(ctx, width, height);
                break;
            case 'pulley':
                this.drawPulley(ctx, width, height);
                break;
            case 'wheel':
                this.drawWheel(ctx, width, height);
                break;
            case 'inclined-plane':
                this.drawInclinedPlane(ctx, width, height);
                break;
        }
    }
    
    drawLever(ctx, width, height) {
        const force = parseInt(this.force.value);
        const distance = parseInt(this.distance.value);
        
        // Draw fulcrum
        ctx.beginPath();
        ctx.fillStyle = '#4CAF50';
        ctx.arc(width/2, height/2, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw lever
        ctx.beginPath();
        ctx.strokeStyle = '#2196F3';
        ctx.lineWidth = 5;
        ctx.moveTo(width/2 - 100, height/2);
        ctx.lineTo(width/2 + 100, height/2);
        ctx.stroke();
        
        // Draw force arrows
        this.drawForceArrow(ctx, width/2 - 50, height/2, force, -1);
        this.drawForceArrow(ctx, width/2 + 50, height/2, force/2, 1);
    }
    
    drawPulley(ctx, width, height) {
        // Draw pulley wheel
        ctx.beginPath();
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 5;
        ctx.arc(width/2, height/3, 30, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw rope
        ctx.beginPath();
        ctx.strokeStyle = '#2196F3';
        ctx.lineWidth = 3;
        ctx.moveTo(width/2 - 50, height/3);
        ctx.lineTo(width/2, height/3 - 30);
        ctx.lineTo(width/2 + 50, height/3);
        ctx.stroke();
        
        // Draw weight
        ctx.fillStyle = '#FFC107';
        ctx.fillRect(width/2 - 25, height/3 + 50, 50, 50);
    }
    
    drawWheel(ctx, width, height) {
        const force = parseInt(this.force.value);
        
        // Draw wheel
        ctx.beginPath();
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 5;
        ctx.arc(width/2, height/2, 50, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw axle
        ctx.beginPath();
        ctx.strokeStyle = '#2196F3';
        ctx.lineWidth = 3;
        ctx.moveTo(width/2 - 60, height/2);
        ctx.lineTo(width/2 + 60, height/2);
        ctx.stroke();
        
        // Draw force arrow
        this.drawForceArrow(ctx, width/2 + 70, height/2, force, 1);
    }
    
    drawInclinedPlane(ctx, width, height) {
        const force = parseInt(this.force.value);
        const distance = parseInt(this.distance.value);
        
        // Draw plane
        ctx.beginPath();
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 5;
        ctx.moveTo(width/4, height/2);
        ctx.lineTo(width * 3/4, height/4);
        ctx.stroke();
        
        // Draw object
        ctx.fillStyle = '#FFC107';
        ctx.fillRect(width/2 - 25, height/2 - 25, 50, 50);
        
        // Draw force arrows
        this.drawForceArrow(ctx, width/2, height/2 - 25, force, -1);
        this.drawForceArrow(ctx, width/2 + 25, height/2, force/2, 1);
    }
    
    drawForceArrow(ctx, x, y, force, direction) {
        const arrowLength = Math.min(Math.abs(force) * 2, 100);
        const arrowHead = 10;
        
        ctx.beginPath();
        ctx.strokeStyle = '#FF5722';
        ctx.lineWidth = 2;
        ctx.moveTo(x, y);
        ctx.lineTo(x + arrowLength * direction, y);
        ctx.stroke();
        
        // Draw arrow head
        ctx.beginPath();
        ctx.moveTo(x + arrowLength * direction, y);
        ctx.lineTo(x + (arrowLength - arrowHead) * direction, y - arrowHead);
        ctx.lineTo(x + (arrowLength - arrowHead) * direction, y + arrowHead);
        ctx.closePath();
        ctx.fillStyle = '#FF5722';
        ctx.fill();
    }
    
    toggleSimulation() {
        this.isRunning = !this.isRunning;
        this.startButton.textContent = this.isRunning ? 'Stop Simulation' : 'Start Simulation';
        
        if (this.isRunning) {
            this.animate();
        } else {
            cancelAnimationFrame(this.animationFrame);
        }
    }
    
    animate() {
        this.draw();
        if (this.isRunning) {
            this.animationFrame = requestAnimationFrame(() => this.animate());
        }
    }
    
    reset() {
        this.isRunning = false;
        this.startButton.textContent = 'Start Simulation';
        this.machineType.value = 'lever';
        this.force.value = 50;
        this.distance.value = 50;
        this.updateDisplay();
        cancelAnimationFrame(this.animationFrame);
    }
}

// Water Cycle Simulation
class WaterCycleSimulation {
    constructor() {
        this.canvas = document.getElementById('water-cycle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isRunning = false;
        this.animationFrame = null;
        
        // Initialize controls
        this.temperature = document.getElementById('temperature');
        this.humidity = document.getElementById('humidity');
        this.windSpeed = document.getElementById('wind-speed');
        this.startButton = document.getElementById('start-btn');
        this.resetButton = document.getElementById('reset-btn');
        
        // Bind event listeners
        this.bindEvents();
        
        // Set initial canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    bindEvents() {
        this.temperature.addEventListener('input', () => this.updateDisplay());
        this.humidity.addEventListener('input', () => this.updateDisplay());
        this.windSpeed.addEventListener('input', () => this.updateDisplay());
        this.startButton.addEventListener('click', () => this.toggleSimulation());
        this.resetButton.addEventListener('click', () => this.reset());
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.draw();
    }
    
    updateDisplay() {
        this.temperature.nextElementSibling.textContent = `${this.temperature.value}°C`;
        this.humidity.nextElementSibling.textContent = `${this.humidity.value}%`;
        this.windSpeed.nextElementSibling.textContent = `${this.windSpeed.value} km/h`;
        this.draw();
    }
    
    draw() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const ctx = this.ctx;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw sky
        this.drawSky(ctx, width, height);
        
        // Draw ground
        this.drawGround(ctx, width, height);
        
        // Draw water bodies
        this.drawWaterBodies(ctx, width, height);
        
        // Draw clouds
        this.drawClouds(ctx, width, height);
        
        // Draw sun
        this.drawSun(ctx, width, height);
    }
    
    drawSky(ctx, width, height) {
        const temp = parseInt(this.temperature.value);
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        
        // Sky color changes based on temperature
        if (temp < 10) {
            gradient.addColorStop(0, '#87CEEB'); // Cold blue
        } else if (temp < 25) {
            gradient.addColorStop(0, '#B0E0E6'); // Moderate blue
        } else {
            gradient.addColorStop(0, '#FFA07A'); // Warm orange
        }
        
        gradient.addColorStop(1, '#FFFFFF');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }
    
    drawGround(ctx, width, height) {
        const temp = parseInt(this.temperature.value);
        const gradient = ctx.createLinearGradient(0, height * 0.7, 0, height);
        
        // Ground color changes based on temperature
        if (temp < 10) {
            gradient.addColorStop(0, '#A9A9A9'); // Cold gray
        } else if (temp < 25) {
            gradient.addColorStop(0, '#8B4513'); // Moderate brown
        } else {
            gradient.addColorStop(0, '#CD853F'); // Warm brown
        }
        
        gradient.addColorStop(1, '#654321');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, height * 0.7, width, height * 0.3);
    }
    
    drawWaterBodies(ctx, width, height) {
        const humidity = parseInt(this.humidity.value);
        const waterLevel = (humidity / 100) * (height * 0.3);
        
        // Draw ocean
        ctx.fillStyle = 'rgba(0, 105, 148, 0.7)';
        ctx.fillRect(0, height - waterLevel, width, waterLevel);
        
        // Draw waves
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        for (let i = 0; i < width; i += 30) {
            ctx.beginPath();
            ctx.moveTo(i, height - waterLevel);
            ctx.quadraticCurveTo(
                i + 15,
                height - waterLevel - 10,
                i + 30,
                height - waterLevel
            );
            ctx.stroke();
        }
    }
    
    drawClouds(ctx, width, height) {
        const humidity = parseInt(this.humidity.value);
        const cloudCount = Math.floor((humidity / 100) * 5);
        
        for (let i = 0; i < cloudCount; i++) {
            const x = (width / (cloudCount + 1)) * (i + 1);
            const y = height * 0.2 + Math.sin(Date.now() / 1000 + i) * 20;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, Math.PI * 2);
            ctx.arc(x + 20, y - 10, 25, 0, Math.PI * 2);
            ctx.arc(x + 40, y, 30, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw rain if humidity is high
            if (humidity > 80) {
                this.drawRain(ctx, x, y);
            }
        }
    }
    
    drawRain(ctx, x, y) {
        const windSpeed = parseInt(this.windSpeed.value);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 5; i++) {
            const rainX = x + (i * 10) - 20;
            const rainY = y + 30;
            const length = 20 + (Math.random() * 10);
            
            ctx.beginPath();
            ctx.moveTo(rainX, rainY);
            ctx.lineTo(
                rainX + (windSpeed / 10),
                rainY + length
            );
            ctx.stroke();
        }
    }
    
    drawSun(ctx, width, height) {
        const temp = parseInt(this.temperature.value);
        const sunSize = 40 + (temp / 5);
        
        // Draw sun
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(width - 100, 100, sunSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw sun rays
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const rayLength = 20 + (temp / 5);
            
            ctx.beginPath();
            ctx.moveTo(
                width - 100 + Math.cos(angle) * sunSize,
                height - 100 + Math.sin(angle) * sunSize
            );
            ctx.lineTo(
                width - 100 + Math.cos(angle) * (sunSize + rayLength),
                height - 100 + Math.sin(angle) * (sunSize + rayLength)
            );
            ctx.stroke();
        }
    }
    
    toggleSimulation() {
        this.isRunning = !this.isRunning;
        this.startButton.textContent = this.isRunning ? 'Stop Simulation' : 'Start Simulation';
        
        if (this.isRunning) {
            this.animate();
        } else {
            cancelAnimationFrame(this.animationFrame);
        }
    }
    
    animate() {
        this.draw();
        if (this.isRunning) {
            this.animationFrame = requestAnimationFrame(() => this.animate());
        }
    }
    
    reset() {
        this.isRunning = false;
        this.startButton.textContent = 'Start Simulation';
        this.temperature.value = 20;
        this.humidity.value = 50;
        this.windSpeed.value = 10;
        this.updateDisplay();
        cancelAnimationFrame(this.animationFrame);
    }
}

// Solar System Simulation
class SolarSystemSimulation {
    constructor() {
        console.log('Initializing SolarSystemSimulation');
        const canvasData = initializeCanvas('solar-system-canvas');
        if (!canvasData) {
            console.error('Failed to initialize canvas for SolarSystemSimulation');
            return;
        }
        
        this.canvas = canvasData.canvas;
        this.ctx = canvasData.ctx;
        this.isRunning = false;
        this.animationFrame = null;
        
        // Initialize planets data
        this.planets = {
            mercury: { radius: 10, distance: 60, speed: 4.1, color: '#A0522D' },
            venus: { radius: 15, distance: 80, speed: 1.6, color: '#DEB887' },
            earth: { radius: 16, distance: 100, speed: 1, color: '#4169E1' },
            mars: { radius: 14, distance: 120, speed: 0.5, color: '#CD5C5C' },
            jupiter: { radius: 30, distance: 160, speed: 0.08, color: '#DAA520' },
            saturn: { radius: 25, distance: 200, speed: 0.03, color: '#F4A460' },
            uranus: { radius: 20, distance: 240, speed: 0.01, color: '#87CEEB' },
            neptune: { radius: 19, distance: 280, speed: 0.006, color: '#1E90FF' }
        };
        
        // Initialize controls
        this.timeScaleControl = getElement('time-scale');
        this.viewModeControl = getElement('view-mode');
        this.planetSelect = getElement('planet-focus');
        this.startButton = getElement('start-btn');
        this.resetButton = getElement('reset-btn');
        
        if (!this.timeScaleControl || !this.viewModeControl || !this.planetSelect || !this.startButton || !this.resetButton) {
            console.error('Failed to initialize controls for SolarSystemSimulation');
            return;
        }
        
        // Bind event listeners
        this.bindEvents();
        
        // Set initial canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        console.log('SolarSystemSimulation initialized successfully');
    }
    
    bindEvents() {
        this.timeScaleControl.addEventListener('input', () => this.updateDisplay());
        this.viewModeControl.addEventListener('change', () => this.updateDisplay());
        this.planetSelect.addEventListener('change', () => this.updateDisplay());
        this.startButton.addEventListener('click', () => this.toggleSimulation());
        this.resetButton.addEventListener('click', () => this.reset());
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.draw();
    }
    
    updateDisplay() {
        this.timeScale = parseFloat(this.timeScaleControl.value);
        this.viewMode = this.viewModeControl.value;
        this.focusedPlanet = this.planetSelect.value;
        this.draw();
    }
    
    draw() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const ctx = this.ctx;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw background
        this.drawBackground(ctx, width, height);
        
        // Draw orbits
        this.drawOrbits(ctx, width, height);
        
        // Draw planets
        this.drawPlanets(ctx, width, height);
        
        // Draw focused planet info if any
        if (this.focusedPlanet) {
            this.drawPlanetInfo(ctx, width, height);
        }
    }
    
    drawBackground(ctx, width, height) {
        // Draw space background
        const gradient = ctx.createRadialGradient(
            width/2, height/2, 0,
            width/2, height/2, Math.max(width, height)
        );
        gradient.addColorStop(0, '#000033');
        gradient.addColorStop(1, '#000000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Draw stars
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 2;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawOrbits(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        
        Object.values(this.planets).forEach(planet => {
            ctx.beginPath();
            ctx.ellipse(
                centerX, centerY,
                planet.distance, planet.distance * 0.3,
                0, 0, Math.PI * 2
            );
            ctx.stroke();
        });
    }
    
    drawPlanets(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const time = Date.now() / 1000;
        
        Object.entries(this.planets).forEach(([name, planet]) => {
            const angle = time * planet.speed * this.timeScale;
            const x = centerX + Math.cos(angle) * planet.distance;
            const y = centerY + Math.sin(angle) * planet.distance * 0.3;
            
            // Draw planet
            ctx.beginPath();
            ctx.fillStyle = planet.color;
            ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw planet name
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(name.charAt(0).toUpperCase() + name.slice(1), x, y - planet.radius - 5);
            
            // Highlight focused planet
            if (name === this.focusedPlanet) {
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x, y, planet.radius + 5, 0, Math.PI * 2);
                ctx.stroke();
            }
        });
        
        // Draw sun
        ctx.beginPath();
        ctx.fillStyle = '#FFD700';
        ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw sun glow
        const gradient = ctx.createRadialGradient(
            centerX, centerY, 40,
            centerX, centerY, 60
        );
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawPlanetInfo(ctx, width, height) {
        const planet = this.planets[this.focusedPlanet];
        if (!planet) return;
        
        // Draw info box
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(10, 10, 200, 100);
        
        // Draw planet info
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Planet: ${this.focusedPlanet.charAt(0).toUpperCase() + this.focusedPlanet.slice(1)}`, 20, 30);
        ctx.fillText(`Distance: ${planet.distance} million km`, 20, 50);
        ctx.fillText(`Orbital Period: ${(1/planet.speed).toFixed(1)} Earth years`, 20, 70);
        ctx.fillText(`Size: ${planet.radius} Earth radii`, 20, 90);
    }
    
    toggleSimulation() {
        this.isRunning = !this.isRunning;
        this.startButton.textContent = this.isRunning ? 'Stop Simulation' : 'Start Simulation';
        
        if (this.isRunning) {
            this.animate();
        } else {
            cancelAnimationFrame(this.animationFrame);
        }
    }
    
    animate() {
        this.draw();
        if (this.isRunning) {
            this.animationFrame = requestAnimationFrame(() => this.animate());
        }
    }
    
    reset() {
        this.isRunning = false;
        this.startButton.textContent = 'Start Simulation';
        this.timeScale = 1;
        this.viewMode = 'top';
        this.planetSelect.value = '';
        this.focusedPlanet = null;
        this.updateDisplay();
        cancelAnimationFrame(this.animationFrame);
    }
}

// Human Heart Simulation
class HumanHeartSimulation {
    constructor() {
        console.log('Initializing HumanHeartSimulation');
        const canvasData = initializeCanvas('heart-canvas');
        if (!canvasData) {
            console.error('Failed to initialize canvas for HumanHeartSimulation');
            return;
        }
        
        this.canvas = canvasData.canvas;
        this.ctx = canvasData.ctx;
        this.isRunning = false;
        this.animationFrame = null;
        this.heartbeatPhase = 0;
        
        // Initialize controls
        this.heartRate = getElement('heart-rate');
        this.bloodPressure = getElement('blood-pressure');
        this.startButton = getElement('start-btn');
        this.resetButton = getElement('reset-btn');
        
        if (!this.heartRate || !this.bloodPressure || !this.startButton || !this.resetButton) {
            console.error('Failed to initialize controls for HumanHeartSimulation');
            return;
        }
        
        // Bind event listeners
        this.bindEvents();
        
        // Set initial canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        console.log('HumanHeartSimulation initialized successfully');
    }
    
    bindEvents() {
        this.heartRate.addEventListener('input', () => this.updateDisplay());
        this.bloodPressure.addEventListener('input', () => this.updateDisplay());
        this.startButton.addEventListener('click', () => this.toggleSimulation());
        this.resetButton.addEventListener('click', () => this.reset());
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.draw();
    }
    
    updateDisplay() {
        if (this.heartRate.nextElementSibling) {
            this.heartRate.nextElementSibling.textContent = `${this.heartRate.value} BPM`;
        }
        if (this.bloodPressure.nextElementSibling) {
            this.bloodPressure.nextElementSibling.textContent = `${this.bloodPressure.value} mmHg`;
        }
        this.draw();
    }
    
    draw() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const ctx = this.ctx;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw background
        this.drawBackground(ctx, width, height);
        
        // Draw heart
        this.drawHeart(ctx, width, height);
        
        // Draw blood vessels
        this.drawBloodVessels(ctx, width, height);
        
        // Draw blood flow
        this.drawBloodFlow(ctx, width, height);
    }
    
    drawBackground(ctx, width, height) {
        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#F5F5F5');
        gradient.addColorStop(1, '#E0E0E0');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }
    
    drawHeart(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const size = Math.min(width, height) * 0.3;
        
        // Calculate heartbeat effect
        const beatScale = 1 + Math.sin(this.heartbeatPhase) * 0.1;
        const scaledSize = size * beatScale;
        
        // Draw heart shape
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(scaledSize/100, scaledSize/100);
        
        ctx.beginPath();
        ctx.fillStyle = '#FF0000';
        ctx.moveTo(0, -50);
        ctx.bezierCurveTo(50, -50, 50, 0, 0, 50);
        ctx.bezierCurveTo(-50, 0, -50, -50, 0, -50);
        ctx.fill();
        
        ctx.restore();
        
        // Draw heart chambers
        this.drawHeartChambers(ctx, centerX, centerY, scaledSize);
    }
    
    drawHeartChambers(ctx, centerX, centerY, size) {
        // Draw left atrium
        ctx.beginPath();
        ctx.fillStyle = '#FF3333';
        ctx.arc(centerX - size/4, centerY - size/4, size/6, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw right atrium
        ctx.beginPath();
        ctx.fillStyle = '#FF3333';
        ctx.arc(centerX + size/4, centerY - size/4, size/6, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw left ventricle
        ctx.beginPath();
        ctx.fillStyle = '#CC0000';
        ctx.ellipse(centerX - size/4, centerY + size/4, size/6, size/4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw right ventricle
        ctx.beginPath();
        ctx.fillStyle = '#CC0000';
        ctx.ellipse(centerX + size/4, centerY + size/4, size/6, size/4, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawBloodVessels(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const size = Math.min(width, height) * 0.3;
        
        // Draw aorta
        ctx.beginPath();
        ctx.strokeStyle = '#CC0000';
        ctx.lineWidth = 5;
        ctx.moveTo(centerX, centerY - size/2);
        ctx.lineTo(centerX, centerY - size);
        ctx.stroke();
        
        // Draw pulmonary artery
        ctx.beginPath();
        ctx.strokeStyle = '#CC0000';
        ctx.lineWidth = 4;
        ctx.moveTo(centerX, centerY - size/2);
        ctx.lineTo(centerX + size/2, centerY - size/2);
        ctx.stroke();
        
        // Draw veins
        ctx.beginPath();
        ctx.strokeStyle = '#990000';
        ctx.lineWidth = 4;
        ctx.moveTo(centerX - size/2, centerY + size/2);
        ctx.lineTo(centerX - size, centerY + size/2);
        ctx.stroke();
    }
    
    drawBloodFlow(ctx, width, height) {
        if (!this.isRunning) return;
        
        const centerX = width / 2;
        const centerY = height / 2;
        const size = Math.min(width, height) * 0.3;
        const time = Date.now() / 1000;
        
        // Draw blood cells
        const cellCount = 10;
        const speed = parseInt(this.heartRate.value) / 60;
        
        for (let i = 0; i < cellCount; i++) {
            const phase = (time * speed + i/cellCount) % 1;
            const x = centerX + Math.cos(phase * Math.PI * 2) * size/2;
            const y = centerY + Math.sin(phase * Math.PI * 2) * size/2;
            
            ctx.beginPath();
            ctx.fillStyle = '#FF0000';
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    toggleSimulation() {
        this.isRunning = !this.isRunning;
        this.startButton.textContent = this.isRunning ? 'Stop Simulation' : 'Start Simulation';
        
        if (this.isRunning) {
            this.animate();
        } else {
            cancelAnimationFrame(this.animationFrame);
        }
    }
    
    animate() {
        // Update heartbeat phase
        const heartRate = parseInt(this.heartRate.value);
        this.heartbeatPhase += (heartRate / 60) * 0.1;
        
        this.draw();
        if (this.isRunning) {
            this.animationFrame = requestAnimationFrame(() => this.animate());
        }
    }
    
    reset() {
        this.isRunning = false;
        this.startButton.textContent = 'Start Simulation';
        this.heartRate.value = 72;
        this.bloodPressure.value = 120;
        this.heartbeatPhase = 0;
        this.updateDisplay();
        cancelAnimationFrame(this.animationFrame);
    }
}

// Initialize water cycle simulation
function initializeWaterCycleSimulation() {
    new WaterCycleSimulation();
}

// Initialize digestive system simulation
function initializeDigestiveSystemSimulation() {
    new DigestiveSystemSimulation();
}

// Initialize human heart simulation
function initializeHumanHeartSimulation() {
    new HumanHeartSimulation();
}

// Temperature Simulation
class TemperatureSimulation {
    constructor() {
        console.log('Initializing TemperatureSimulation');
        const canvasData = initializeCanvas('temperature-canvas');
        if (!canvasData) {
            console.error('Failed to initialize canvas for TemperatureSimulation');
            return;
        }
        
        this.canvas = canvasData.canvas;
        this.ctx = canvasData.ctx;
        this.isRunning = false;
        this.animationFrame = null;
        this.particles = [];
        this.materialProperties = {
            water: {
                name: 'Water',
                density: 1.0,
                specificHeat: 4.18,
                conductivity: 0.6,
                meltingPoint: 0,
                boilingPoint: 100,
                color: '#4A90E2'
            },
            iron: {
                name: 'Iron',
                density: 7.87,
                specificHeat: 0.45,
                conductivity: 80.2,
                meltingPoint: 1538,
                boilingPoint: 2862,
                color: '#A9A9A9'
            },
            aluminum: {
                name: 'Aluminum',
                density: 2.7,
                specificHeat: 0.897,
                conductivity: 237,
                meltingPoint: 660,
                boilingPoint: 2470,
                color: '#C0C0C0'
            },
            copper: {
                name: 'Copper',
                density: 8.96,
                specificHeat: 0.385,
                conductivity: 401,
                meltingPoint: 1085,
                boilingPoint: 2562,
                color: '#B87333'
            }
        };
        
        // Initialize controls
        this.temperature = getElement('temperature');
        this.material = getElement('material');
        this.volume = getElement('volume');
        this.startButton = getElement('start-btn');
        this.resetButton = getElement('reset-btn');
        
        if (!this.temperature || !this.material || !this.volume || !this.startButton || !this.resetButton) {
            console.error('Failed to initialize controls for TemperatureSimulation');
            return;
        }
        
        // Bind event listeners
        this.bindEvents();
        
        // Set initial canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Initialize particles
        this.initializeParticles();
        
        console.log('TemperatureSimulation initialized successfully');
    }
    
    bindEvents() {
        this.temperature.addEventListener('input', () => this.updateDisplay());
        this.material.addEventListener('change', () => this.updateDisplay());
        this.volume.addEventListener('input', () => this.updateDisplay());
        this.startButton.addEventListener('click', () => this.toggleSimulation());
        this.resetButton.addEventListener('click', () => this.reset());
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.draw();
    }
    
    updateDisplay() {
        if (this.temperature.nextElementSibling) {
            this.temperature.nextElementSibling.textContent = `${this.temperature.value}°C`;
        }
        if (this.volume.nextElementSibling) {
            this.volume.nextElementSibling.textContent = `${this.volume.value}L`;
        }
        this.draw();
    }
    
    initializeParticles() {
        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 3 + 1
            });
        }
    }
    
    draw() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const ctx = this.ctx;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw background
        this.drawBackground(ctx, width, height);
        
        // Draw particles
        this.drawParticles(ctx);
        
        // Draw temperature indicator
        this.drawTemperatureIndicator(ctx, width, height);
    }
    
    drawBackground(ctx, width, height) {
        const temp = parseInt(this.temperature.value);
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        
        // Background color changes based on temperature
        if (temp < 0) {
            gradient.addColorStop(0, '#87CEEB'); // Cold blue
        } else if (temp < 50) {
            gradient.addColorStop(0, '#FFA07A'); // Warm orange
        } else {
            gradient.addColorStop(0, '#FF4500'); // Hot red
        }
        
        gradient.addColorStop(1, '#FFFFFF');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }
    
    drawParticles(ctx) {
        const temp = parseInt(this.temperature.value);
        const material = this.materialProperties[this.material.value];
        
        this.particles.forEach(particle => {
            // Update particle position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off walls
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Draw particle
            ctx.beginPath();
            ctx.fillStyle = material.color;
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    drawTemperatureIndicator(ctx, width, height) {
        const temp = parseInt(this.temperature.value);
        const material = this.materialProperties[this.material.value];
        
        // Draw thermometer
        ctx.beginPath();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.moveTo(width - 50, height - 100);
        ctx.lineTo(width - 50, height - 20);
        ctx.stroke();
        
        // Draw temperature level
        const level = (temp - material.meltingPoint) / (material.boilingPoint - material.meltingPoint);
        const levelHeight = 80 * Math.max(0, Math.min(1, level));
        
        ctx.fillStyle = temp < material.meltingPoint ? '#87CEEB' :
                       temp > material.boilingPoint ? '#FF4500' : '#FFA07A';
        ctx.fillRect(width - 55, height - 20 - levelHeight, 10, levelHeight);
        
        // Draw temperature text
        ctx.fillStyle = '#000000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${temp}°C`, width - 50, height - 10);
    }
    
    toggleSimulation() {
        this.isRunning = !this.isRunning;
        this.startButton.textContent = this.isRunning ? 'Stop Simulation' : 'Start Simulation';
        
        if (this.isRunning) {
            this.animate();
        } else {
            cancelAnimationFrame(this.animationFrame);
        }
    }
    
    animate() {
        this.draw();
        if (this.isRunning) {
            this.animationFrame = requestAnimationFrame(() => this.animate());
        }
    }
    
    reset() {
        this.isRunning = false;
        this.startButton.textContent = 'Start Simulation';
        this.temperature.value = 20;
        this.material.value = 'water';
        this.volume.value = 1;
        this.updateDisplay();
        cancelAnimationFrame(this.animationFrame);
    }
}

// Initialize temperature simulation
function initializeTemperatureSimulation() {
    new TemperatureSimulation();
}

// Initialize digestive system simulation
function initializeDigestiveSystemSimulation() {
    new DigestiveSystemSimulation();
}

// Initialize human heart simulation
function initializeHumanHeartSimulation() {
    new HumanHeartSimulation();
}
