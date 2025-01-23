const accessKey = "dFYNbTnC21p4mGHV9CasL-kTnlm53CDdSyuc_OuzQmI";
const formEl = document.querySelector("form");
const loadingEl = document.querySelector('#loading');
const searchInputEl = document.querySelector("#search-input");
const searchResultsEl = document.querySelector(".search-results");
const paginationButtons = document.querySelector(".pagination-buttons");

let inputData = "";
let currentPage = 1;
const itemsPerPage = 18; // Total images per page
const maxPageButtons = 5;
let loadedImagesCount = 0; // Track loaded images for the current page

// Show loading indicator
function showLoading() {
    const loading = document.createElement("p");
    loading.classList.add("loading");
    loading.textContent = "Loading...";
    loadingEl.appendChild(loading);
}

// Hide loading indicator
function hideLoading() {
    const loading = document.querySelector(".loading");
    if (loading) loading.remove();
}

// Fetch and display images in chunks of 6 per scroll
 function searchImages() {
    const url = `https://api.unsplash.com/search/photos?page=${currentPage}&query=${inputData}&per_page=${itemsPerPage}&client_id=${accessKey}`;

    try {
        // const response = await fetch(url);
        // // console.log(response)
        // if (!response.ok) throw new Error("Network response was not ok");
        // // console.log(await response.json())
        // const data = await response.json();
        // hideLoading();
        // const data={};
        fetch(url)
            .then(async (response) => {
                if (!response.ok) throw new Error("Network response was not ok")
                const data = await response.json()
                hideLoading();
                const results = data.results;

                if (results.length > 0) {
                    displayImages(results.slice(loadedImagesCount, loadedImagesCount + 6));
                    // console.log(results.slice(loadedImagesCount, loadedImagesCount + 6))
                    loadedImagesCount += 6;

                    if (loadedImagesCount >= itemsPerPage) {
                        // All images for the current page are loaded
                        window.removeEventListener('scroll', handleScroll);
                    } else {
                        // load more images on scroll
                        window.addEventListener('scroll', handleScroll);
                    }

                    // Show pagination controls for the first chunk only
                     setupPaginationButtons(data.total_pages);
                } else {
                    searchResultsEl.innerHTML = "<p>No results found.</p>";
                    paginationButtons.innerHTML = ""; // Hide pagination if no results
                }
            })
    }
    catch (error) {
        hideLoading();
        searchResultsEl.innerHTML = "<p>There was an error fetching results. Please try again later.</p>";
    }
}

// Display a chunk of images
function displayImages(images) {
    images.forEach((result) => {
        const imageWrapper = document.createElement("div");
        imageWrapper.classList.add("search-result");

        const image = document.createElement("img");
        image.src = result.urls.small;
        image.alt = result.alt_description || "Unsplash Image";
        image.loading = "lazy";  // Lazy loading

        const imgLink = document.createElement("a");
        imgLink.href = result.links.html;
        imgLink.target = "_blank";
        imgLink.textContent = result.alt_description || "View on Unsplash";

        imageWrapper.appendChild(image);
        imageWrapper.appendChild(imgLink);
        searchResultsEl.appendChild(imageWrapper);
    });
}

// Update pagination controls
function setupPaginationButtons(totalPages) {
    paginationButtons.innerHTML = "";

    // First page button
    const startBtn = document.createElement("button");
    startBtn.textContent = "Start";
    startBtn.disabled = currentPage === 1;
    startBtn.addEventListener("click", () => goToPage(1));
    paginationButtons.appendChild(startBtn);

    // Previous page button
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Prev";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => goToPage(currentPage - 1));
    paginationButtons.appendChild(prevBtn);

    // Dynamic page buttons
    let startPage, endPage;

    if (totalPages <= maxPageButtons) {
        startPage = 1;
        endPage = totalPages;
    } else if (currentPage <= Math.ceil(maxPageButtons / 2)) {
        startPage = 1;
        endPage = maxPageButtons;
    } else if (currentPage + Math.floor(maxPageButtons / 2) >= totalPages) {
        startPage = totalPages - maxPageButtons + 1;
        endPage = totalPages;
    } else {
        startPage = currentPage - Math.floor(maxPageButtons / 2);
        endPage = currentPage + Math.floor(maxPageButtons / 2);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        pageBtn.classList.toggle("active", currentPage === i);
        pageBtn.addEventListener("click", () => goToPage(i));
        paginationButtons.appendChild(pageBtn);
    }

    // Next page button
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => goToPage(currentPage + 1));
    paginationButtons.appendChild(nextBtn);

    // Last page button
    const endBtn = document.createElement("button");
    endBtn.textContent = "End";
    endBtn.disabled = currentPage === totalPages;
    endBtn.addEventListener("click", () => goToPage(totalPages));
    paginationButtons.appendChild(endBtn);
}

// Go to a specific page and reset loaded images count
function goToPage(page) {
    currentPage = page;
    loadedImagesCount = 0; // Reset for the new page
    searchResultsEl.innerHTML = ""; // Clear previous results
    showLoading();
    searchImages();
}

// Handle scrolling to load images in chunks
function handleScroll() {
    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight - 1) {
        searchImages(); // Load next chunk
    }
}

// Event listener for search form submission
formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    inputData = searchInputEl.value.trim();
    if (!inputData) {
        alert("Please enter a search term!");
        return;
    }
    currentPage = 1;
    loadedImagesCount = 0; // Reset count for the new search
    searchResultsEl.innerHTML = ""; // Clear previous search results
    showLoading();
    searchImages();
});

let availableKeywords = [
    'car',
    'cat',
    'god', 'bird', 'lion','dog','nature','wind','clock','candle'
];

const ResultBox = document.querySelector('.result-box');
searchInputEl.onkeyup = function () {
    let Autoresult = [];
    let input = searchInputEl.value;
    if (input.length) {
        Autoresult = availableKeywords.filter((keyword) => {
            return keyword.toLowerCase().includes(input.toLowerCase());
        });
        console.log(Autoresult)
    }
    display(Autoresult);

    if (!Autoresult.length) {
        ResultBox.innerHTML = ""
    }
}

function display(Autoresult) {
    const content = Autoresult.map((list) => {
        return "<li onclick=selectInput(this)>" + list + "<li>"
    });
    ResultBox.innerHTML = "<ul>" + content.join('') + "</ul>";
}

function selectInput(list) {
    searchInputEl.value = list.innerHTML;
    ResultBox.innerHTML = ""
}