const API_KEY = 'AIzaSyCw_wiVmJ30aSH6oyad0O7bjZW3G3V-imU';  // Replace with your YouTube API key
let movieName = "";  // Declare with let to allow reassignment
let btn = document.getElementById("btn");
let headTrailer = document.getElementById("headMovieTrailer");
headTrailer.innerHTML = "";

async function importTitle() {
    try {
        let module = await import("./script.js");  // Assuming script.js exports 'title'
        movieName = module.title;  // Assigning the movie name dynamically
        console.log("Imported movie title:", movieName);
    } catch (er) {
        console.log("Error importing title: " + er);
        movieName = "default movie";  // Fallback movie name or handle error
    }
}

async function fetchTrailer() {
    // Ensure movieName is set before fetching
    await importTitle();
    headTrailer.classList.add(headTrailer.id)
    headTrailer.innerHTML = "Movie Trailer";
    
    if (!movieName) {
        console.error("Movie name is not available.");
        return;
    }
    
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${movieName}+official+trailer&type=video&maxResults=10&key=${API_KEY}`);
        if (!response.ok) {
            console.error(`API error: ${response.status} - ${response.statusText}`);
            document.getElementById('trailer').innerHTML = `Error fetching trailer: ${response.statusText}`;
            return;
        }

        const data = await response.json();
        console.log('YouTube API response:', data);

        if (data.items && data.items.length > 0) {
            let trailerFound = false;

            for (let item of data.items) {
                const title = item.snippet.title.toLowerCase();
                const description = item.snippet.description.toLowerCase();
                const videoId = item.id.videoId;

                if ((title.includes('official trailer') || title.includes('trailer') || description.includes('trailer'))) {
                    document.getElementById('trailer').innerHTML = `
                        <iframe 
                            src="https://www.youtube.com/embed/${videoId}" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    `;
                    trailerFound = true;
                    break;
                }
            }

            if (!trailerFound) {
                document.getElementById('trailer').innerHTML = 'Trailer not found or unavailable for embedding';
            }
        } else {
            document.getElementById('trailer').innerHTML = 'No trailers found in YouTube API results';
            console.warn('No items returned in the API response');
        }
    } catch (error) {
        console.error('Error fetching trailer:', error);
        document.getElementById('trailer').innerHTML = 'An error occurred while fetching the trailer.';
    }
}

// Add event listener to the button
btn.addEventListener("click", fetchTrailer);
