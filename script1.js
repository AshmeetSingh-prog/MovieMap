let data1; // Variable to hold the movie data
const apiKey = '7a74ade833dce778692b297a0f949b10'; // API key for TMDB
let movieName = "Inception"; 
let movieId; // Variable to store the ID of the movie

// DOM elements for country selection and display of buy, rent, and flat rate options
let select = document.getElementById("country");
let buydiv = document.getElementById("buy");
let rentdiv = document.getElementById("rent");
let flatratediv = document.getElementById("flatrate");
let btn = document.getElementById("btn");

function openLink() {
    window.location.href = "error.html"; // Change the current location to the new URL
}



async function importTitle() {
    try {
        let module = await import("./script.js");
        movieName = module.title;
        console.log(movieName);
    } catch (er) {
        console.log("E: " + er);
        openLink()
    }
}

// Asynchronous function to search for the movie
async function search() {
    await importTitle(); // Wait for movieName to be updated

    // Update the tmdburl with the new movieName
    const tmdburl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieName)}`;

    try {
        // Fetch movie data from TMDB API
        let response1 = await fetch(tmdburl);
        if (!response1.ok) {
            throw new Error('Network response was not ok: ' + response1.statusText);
        }

        data1 = await response1.json(); // Parse the response to JSON

        // Access the first result in the results array
        if (data1.results && data1.results.length > 0) {
            movieId = data1.results[0].id; // Get the ID of the first movie in the results
            console.log(data1.results[0]);
            console.log(`Movie ID for "${movieName}": ${movieId}`);

            // Construct URL to fetch streaming providers for the movie
            const providersUrl = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}`;
            console.log(`Fetching streaming providers from: ${providersUrl}`);
            await providersFunc(providersUrl);
        } else {
            console.log('No results found.'); // Log if no movie results found
        }
    } catch (error) {
        console.log("E: " + error); // Log any errors that occur during the search
        openLink()
    }
}

// Asynchronous function to get streaming providers for the movie
async function providersFunc(providersUrl) {
    try {
        // Fetch the streaming providers from TMDB API
        let response2 = await fetch(providersUrl);
        let data2 = await response2.json();

        if (data2.results && Object.keys(data2.results).length > 0) {
            const results = data2.results; // Store the results
            const selectedcode1 = await getSelectedCountryCode(); // Helper function to get selected code
            console.log(selectedcode1, results); // Log the selected country code

            if (results[selectedcode1]) {
                updateProviderDivs(results[selectedcode1]); // Update divs with providers
            } else {
                console.log('No providers found for the selected country.');
                buydiv.innerHTML = rentdiv.innerHTML = flatratediv.innerHTML = "Not Available";
            }
        } else {
            console.log('No streaming information available.'); // Log if no providers found
        }
    } catch (error) {
        console.log("E: " + error); // Log any errors that occur during the provider fetch
        openLink()
    }            
}

// Helper function to get the selected country code
async function getSelectedCountryCode() {
    try {
        let module = await import("./SelectCountry.js");
        return module.selectedcode; // Get the selected country code
    } catch (error) {
        console.log("E: " + error);
        openLink()
        return null; // Return null if there's an error   
    }
}

// Function to update the provider divs based on the selected country
function updateProviderDivs(providers) {
    // Display buy providers
    buydiv.innerHTML = providers.buy && providers.buy.length ? providers.buy.map(item => item.provider_name).join(', ') : "Not Available";

    // Display rent providers
    rentdiv.innerHTML = providers.rent && providers.rent.length ? providers.rent.map(item => item.provider_name).join(', ') : "Not Available";

    // Display flat rate providers
    flatratediv.innerHTML = providers.flatrate && providers.flatrate.length ? providers.flatrate.map(item => item.provider_name).join(', ') : "Not Available";
}

// Initiate the search for the movie
btn.addEventListener("click", search);
select.addEventListener("change", search)
