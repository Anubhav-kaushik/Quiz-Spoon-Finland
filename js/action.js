// add questions to the page
appendSlider(questions, ".spoon--input-main-container")

showNcards(1);
addPagination('.spoon--input-main-container', Object.keys(questions).length);

runGame(slideClass, paginationCirclesClass);

const sliderMainContainer = document.querySelector(".spoon--input-main-container");

const sliderResizeListener = new ResizeObserver(entries => {
    entries.forEach(entry => {
        showNcards(1);
    });
});

sliderResizeListener.observe(sliderMainContainer);

const form = document.querySelector(".spoon--form-section form");

// empty the form
form.reset();