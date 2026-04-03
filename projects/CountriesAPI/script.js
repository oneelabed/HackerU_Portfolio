/* --- Selectors: Grabbing the HTML elements we need to interact with --- */
const countriesContainer = document.getElementById('countriesContainer');
const searchInput = document.getElementById('searchInput');
const regionFilter = document.getElementById('regionFilter');
const loadMoreBtn = document.getElementById('loadMoreBtn');

/* --- Audio Setup: Initializing the sound effect for UI feedback --- */
const clickSfx = new Audio('assets/click.mp3');
clickSfx.volume = 0.2; // Setting a subtle volume level

/* --- State Management: Variables to hold our data and pagination state --- */
let allCountries = [];       // Stores the full list from the API
let filteredCountries = [];  // Stores the list after search/region filters are applied
let itemsToShow = 24;        // Defines how many countries to load per batch

/* --- API Fetching: Getting data from the Rest Countries API --- */
async function fetchCountries() {
    try {
        // Requesting only the specific fields we need to save bandwidth
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,capital,currencies,flags,region,population,maps");
        allCountries = await response.json();
        
        // Sorting the array alphabetically by the common name
        allCountries.sort((a, b) => a.name.common.localeCompare(b.name.common));
        
        // Initializing the filtered list with all countries
        filteredCountries = [...allCountries];
        
        // Performing the first render (append = false means clear container first)
        displayCountries(false);
    } catch (error) {
        // Graceful error handling if the API fails or the user is offline
        countriesContainer.innerHTML = `<p>Error loading data. Please try again later.</p>`;
    }
}

/* --- Rendering Logic: Creating the HTML cards for the countries --- */
function displayCountries(append = false) {
    // If we aren't "Loading More", we clear the current view
    if (!append) {
        countriesContainer.innerHTML = '';
    }

    // Calculating which slice of the array to show based on how many cards are already visible
    const currentCount = append ? countriesContainer.children.length : 0;
    const nextSlice = filteredCountries.slice(currentCount, currentCount + itemsToShow);

    // Showing a message if the search/filter returns zero results
    if (filteredCountries.length === 0) {
        countriesContainer.innerHTML = `
            <div class="no-results">
                <h2>No countries found!</h2>
                <p>Try adjusting your search or filter settings.</p>
            </div>
        `;
        loadMoreBtn.style.display = 'none';
        return;
    }

    // Creating a card for every country in the current slice
    nextSlice.forEach(country => {
        // Safely extracting currency info (handles countries with missing data)
        const currencyKey = country.currencies ? Object.keys(country.currencies)[0] : null;
        const currencyName = currencyKey ? country.currencies[currencyKey].name : 'N/A';
        const currencySymbol = currencyKey ? country.currencies[currencyKey].symbol : '';

        const card = document.createElement('div');
        card.className = 'country-card';
        card.innerHTML = `
            <img src="${country.flags.png}" loading="lazy" onerror="this.src='https://dummyimage.com/300x150/cccccc/ffffff.png&text=%20'" alt="Flag">
            <div class="country-info">
                <h3>${country.name.common}</h3>
                <p><strong>Capital:</strong> ${country.capital?.[0] || 'N/A'}</p>
                <p><strong>Currency:</strong> ${currencyName} (${currencySymbol})</p>
            </div>
        `;
        // Attaching the modal popup trigger to each card
        card.onclick = () => showModal(country);
        countriesContainer.appendChild(card);
    });

    // Hiding the "Load More" button if there are no more countries left to display
    if (countriesContainer.children.length >= filteredCountries.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-block';
    }
}

/* --- Filter Logic: Handling Search and Region dropdowns simultaneously --- */
function handleFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedRegion = regionFilter.value;

    filteredCountries = allCountries.filter(country => {
        // Checking if the country name matches the search query
        const matchesSearch = country.name.common.toLowerCase().includes(searchTerm);
        // Checking if the region matches the selected dropdown value
        const matchesRegion = selectedRegion === 'all' || country.region === selectedRegion;
        return matchesSearch && matchesRegion;
    });

    // Resetting the view to show the new filtered results from the beginning
    displayCountries(false);
}

/* --- Modal Logic: Managing the detailed popup view --- */
const modal = document.getElementById('countryModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close-btn');

function showModal(country) {
    const currencyKey = country.currencies ? Object.keys(country.currencies)[0] : null;
    const currencyName = currencyKey ? country.currencies[currencyKey].name : 'N/A';

    // Injecting detailed data into the modal (using toLocaleString for population commas)
    modalBody.innerHTML = `
        <div class="modal-info">
            <img src="${country.flags.png}" alt="Flag">
            <h2>${country.name.common}</h2>
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Capital:</strong> ${country.capital?.[0] || 'N/A'}</p>
            <p><strong>Currency:</strong> ${currencyName}</p>
            <a href="${country.maps.googleMaps}" target="_blank" class="map-link">View on Google Maps</a>
        </div>
    `;
    modal.style.display = "block";
}

/* --- Event Listeners: Connecting user actions to JavaScript functions --- */
searchInput.addEventListener('input', handleFilters);
regionFilter.addEventListener('change', handleFilters);
loadMoreBtn.addEventListener('click', () => {
    clickSfx.play(); // Playing sound when user requests more data
    displayCountries(true);
});

// Closing the modal when the user clicks 'X'
closeBtn.onclick = () => modal.style.display = "none";
// Closing the modal if the user clicks anywhere outside the white modal box
window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
}

// Initializing the app by fetching the data
fetchCountries();