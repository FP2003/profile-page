// Function to get current time in 24h format
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
    });
}

// Function to get location
async function getLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return data.city_code || data.region_code || 'Unknown';
    } catch (error) {
        console.error('Error fetching location:', error);
        return 'LDN';
    }
}

// Update stats dynamically
async function updateStats() {
    const timeSpan = document.querySelector('.stats-display .stat-display:first-child span');
    const locationSpan = document.querySelector('.stats-display .stat-display:last-child span');

    // Update time every minute
    timeSpan.textContent = getCurrentTime();

    // Get and display location
    const location = await getLocation();
    locationSpan.textContent = location;
}
// Initialize the firefly effect
document.addEventListener('DOMContentLoaded', async () => {
    // Update stats initially
    updateStats();

    // Update time every minute
    setInterval(() => {
        const timeSpan = document.querySelector('.stats-display .stat-display:first-child span');
        timeSpan.textContent = getCurrentTime();
    }, 60000);

    // Custom cursor functionality
    const cursor = document.querySelector('.cursor');
    const profileCard = document.getElementById('profile-card');
    let mouseX = 0;
    let mouseY = 0;
    let particleColors = ['#00ffff'];

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Move cursor
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
        
        // Create particle
        if (Math.random() > 0.6) {
            createParticle();
        }
        
        // Card 3D effect
        const cardRect = profileCard.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        
        const angleX = (mouseY - cardCenterY) / 50;
        const angleY = (cardCenterX - mouseX) / 50;
        
        profileCard.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
    });
    
    // Create particle effect
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 1;
        const color = particleColors[Math.floor(Math.random() * particleColors.length)];
        
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.background = color;
        particle.style.left = mouseX + 'px';
        particle.style.top = mouseY + 'px';
        
        document.body.appendChild(particle);
        
        // Animate particle
        setTimeout(() => {
            particle.style.transition = 'all 0.5s ease';
            particle.style.transform = `translate(${(Math.random() - 0.5) * 30}px, ${(Math.random() - 0.5) * 30}px)`;
            particle.style.opacity = '1';
            
            setTimeout(() => {
                particle.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(particle);
                }, 500);
            }, 200);
        }, 10);
    }

    const video = document.querySelector('.video-background');
    const volumeSlider = document.getElementById('volumeRange');

    // Start video muted so autoplay works
    video.volume = parseFloat(volumeSlider.value);

    // When user interacts, unmute video
    function enableAudio() {
    video.muted = false;
    video.volume = parseFloat(volumeSlider.value); // ensure slider sets it
    document.removeEventListener('click', enableAudio);
    document.removeEventListener('keydown', enableAudio);
    }

    // Listen for user interaction to enable audio
    document.addEventListener('click', enableAudio);
    document.addEventListener('keydown', enableAudio);

    // Slider input changes volume
    volumeSlider.addEventListener('input', () => {
    video.volume = parseFloat(volumeSlider.value);
    });

    // Add hover effect to profile card
    profileCard.addEventListener('mouseenter', () => {
        cursor.style.width = '50px';
        cursor.style.height = '50px';
    });

    profileCard.addEventListener('mouseleave', () => {
        cursor.style.width = '40px';
        cursor.style.height = '40px';
        profileCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
});