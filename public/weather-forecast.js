// Weather Forecast Form Handling
document.addEventListener('DOMContentLoaded', () => {
  const weatherForm = document.getElementById('weatherForm');
  const weatherResult = document.getElementById('weatherResult');
  const loadingSpinner = weatherForm.querySelector('.loading-spinner');
  const buttonText = weatherForm.querySelector('.btn-text');

  weatherForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show loading state
    loadingSpinner.style.display = 'block';
    buttonText.style.opacity = '0';
    weatherResult.classList.remove('visible');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/get-weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await res.json();

      // Update weather icon based on conditions
      const weatherIcon = getWeatherIcon(result.description);
      const weatherDescription = result.description || 'Weather data not available';
      
      // Format the result display
      weatherResult.querySelector('.weather-icon').textContent = weatherIcon;
      weatherResult.querySelector('.weather-description').textContent = weatherDescription;
      
      weatherResult.querySelector('.temperature-value').textContent = 
        `${result.temperature || '--'}°C`;
      weatherResult.querySelector('.humidity-value').textContent = 
        `${result.humidity || '--'}%`;
      weatherResult.querySelector('.pressure-value').textContent = 
        `${result.pressure || '--'} hPa`;

      // Show the result with animation
      weatherResult.classList.add('visible');

      // Update crop recommendations if available
      updateCropRecommendations(result.description);

    } catch (error) {
      console.error('Weather prediction failed:', error);
      weatherResult.innerHTML = `
        <div class="weather-error">
          <p>❌ Unable to get weather prediction. Please try again.</p>
        </div>
      `;
      weatherResult.classList.add('visible');
    } finally {
      // Hide loading state
      loadingSpinner.style.display = 'none';
      buttonText.style.opacity = '1';
    }
  });
});

// Get appropriate weather icon
function getWeatherIcon(description) {
  const icons = {
    'Hot and Dry': '☀️',
    'Humid, Possible Rain': '🌧️',
    'Cool Weather': '❄️',
    'Mild Weather': '🌤️'
  };
  return icons[description] || '🌡️';
}

// Handle input animations
document.querySelectorAll('.input-group input').forEach(input => {
  input.addEventListener('focus', () => {
    input.parentElement.classList.add('focused');
  });

  input.addEventListener('blur', () => {
    input.parentElement.classList.remove('focused');
  });
});

// Update crop recommendations
function updateCropRecommendations(weatherType) {
  const cropSection = document.getElementById('crop-recommendation');
  if (!cropSection) return;

  const crops = cropData[weatherType];
  if (!crops) {
    cropSection.style.display = 'none';
    return;
  }

  cropSection.style.display = 'block';
  const cropCards = cropSection.querySelector('.crop-cards');
  cropCards.innerHTML = '';

  crops.forEach(crop => {
    const card = document.createElement('div');
    card.className = 'crop-card animate-in';
    card.innerHTML = `
      <img src="${crop.img}" alt="${crop.name}" class="crop-image">
      <div class="crop-content">
        <h3 class="crop-name">${crop.name}</h3>
        <div class="crop-info">
          <h4>Requirements:</h4>
          <ul>
            ${crop.requirements.map(req => `<li>${req}</li>`).join('')}
          </ul>
          <h4>Growing Tips:</h4>
          <ul>
            ${crop.tips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
    cropCards.appendChild(card);
  });
}