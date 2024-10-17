import {countries} from "./Countries.js";

// Get the select element
let select = document.getElementById("country");
let selectedcountry; 
let selectedcode;
let div = document.getElementById("div");
let opt;

// Populate the select element with countries
for (let countryName in countries) {
    
    opt = document.createElement("option");
    opt.setAttribute("value", countryName);
    opt.setAttribute("id", countryName);
    opt.innerHTML = countryName;

    if (countryName === "India") {
        opt.setAttribute("selected", "selected"); // Mark "India" as selected
    }
    select.appendChild(opt);
}

let update = () => {
    selectedcountry = select.value;
    selectedcode = countries[selectedcountry];

    // Check if selectedcode is valid
    if (selectedcode) {
        let flagUrl = `https://flagsapi.com/${selectedcode}/flat/64.png`;
        div.style.backgroundImage = `url(${flagUrl})`;
        div.style.backgroundSize = 'contain';
        return selectedcode ; 
    } else {
        console.log("Error: Country code not found.");
    }
};

update(); // To get the default values
select.addEventListener("change", update);

export {selectedcode};