let imgBox = document.getElementById("imgBox");
const apikey = "51e59d23"
let ImdbbaseUrl = `https://www.omdbapi.com/?apikey=${apikey}&`; // Moved apikey before title
let data;
let title;
let btn = document.getElementById("btn");
imgBox.id = "hi";
let info = document.getElementById("info");

function openLink() {
    window.location.href = "error.html"; // Change the current location to the new URL
}

let classHTMLCollection = document.getElementsByClassName("availability-container");
function addClassNone(classHTMLCollection) {
    let arr = Array.from(classHTMLCollection);
    arr.forEach((ele) => {
        ele.classList.add("none");
    });
}

function removeClassNone(classHTMLCollection) {
    let arr = Array.from(classHTMLCollection);
    arr.forEach((ele) => {
        ele.classList.remove("none");
    });
}

addClassNone(classHTMLCollection);

info.classList.remove("info-box");
imgBox.classList.remove("img-box");
info.classList.add("none");
imgBox.classList.add("none");

btn.addEventListener("click", (e) => {
    removeClassNone(classHTMLCollection);
    imgBox.id = "imgBox";
    title = document.getElementById("title").value;
    let url = `${ImdbbaseUrl}t=${title}`; // Build URL correctly

    async function details() {
        try {
            let response = await fetch(url);
            data = await response.json();
            let ertext = document.getElementById("ertext");

            if (data.Response === "False") {
                console.log("Movie not found");
                addClassNone(classHTMLCollection);
                ertext.innerHTML = "ERROR: Movie Not Found";
                info.classList.add("none");
                imgBox.classList.add("none");
                info.classList.remove("info-box");
                imgBox.classList.remove("img-box");
            } else {
                info.classList.add("info-box");
                imgBox.classList.add("img-box");
                info.classList.remove("none");
                imgBox.classList.remove("none");
                ertext.innerHTML = "";

                // Set poster background image after validation
                imgBox.style.backgroundImage = `url(${data.Poster})`;
                imgBox.style.backgroundSize = 'cover';
            }
        } catch (error) {
            console.log("E: " + error);
            openLink();
        }

        // Clear previous movie info
        info.innerHTML = "";

        let arr = ['Title', 'Actors', 'Writers', 'Awards', 'BoxOffice', 'Country', 'Director', 'Genre', 'Language', 'Released', 'Type', 'Plot'];

        arr.forEach((item) => {
            let text = document.createElement("div");
            text.classList.add("text");
            text.innerHTML = `${item}: ${data[item] || 'N/A'}`;
            info.appendChild(text);
        });
    }

    details();
});

export { title };
