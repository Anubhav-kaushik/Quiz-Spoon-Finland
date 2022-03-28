const mainContainerClass = '.spoon--input-main-container';
const sliderContainerClass = '.spoon--input-main-container .slider-container';
const slideContainerClass = '.spoon--input-main-container .slide-container';
const slideClass = '.spoon--input-main-container .slide';
const paginationClass = '.spoon--input-main-container .pagination-container';
const paginationCirclesClass = '.spoon--input-main-container .pagination-container .pagination-circle';

function showNcards(n) {
    const mainContainer = document.querySelector(`${mainContainerClass}`);
    const sliderContainer = document.querySelector(`${sliderContainerClass}`);
    const slides = document.querySelectorAll(`${slideClass}`);

    if (n > slides.length) {
        n = slides.length;
    }

    if (n < 1) {
        n = 1;
    }

    const mainContainerWidth = mainContainer.offsetWidth;

    if (n * slides[0].offsetWidth > mainContainerWidth) {
        while (n * slides[0].offsetWidth > mainContainerWidth) {
            n -= 1;

            if (n < 1) {
                n = 1;
                break;
            }
        }
    }

    const slideWidth = mainContainerWidth / n;
    const slideContainerWidth = slideWidth * slides.length;

    sliderContainer.style.width = `${slideContainerWidth}px`;

}

let currentXdisplacement = 0;

function moveSlide(direction) {
    const sliderContainer = document.querySelector(`${sliderContainerClass}`);
    const slides = document.querySelectorAll(`${slideClass}`);

    const slideWidth = slides[0].offsetWidth;
    const sliderContainerWidth = sliderContainer.offsetWidth;

    if (direction === 'left' && Math.abs(currentXdisplacement) < Math.abs(sliderContainerWidth - slideWidth)) {
        sliderContainer.style.transform = `translateX(${currentXdisplacement - slideWidth}px)`;
        currentXdisplacement -= slideWidth;
    } else if (direction === 'right' && currentXdisplacement < 0) {
        sliderContainer.style.transform = `translateX(${currentXdisplacement + slideWidth}px)`;
        currentXdisplacement += slideWidth;
    } else {
        console.log('Move to nowhere');
    }
}

function createSVGCircles(howMany, circleRadius = 10) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    svg.setAttribute('viewBox', `0 0 ${howMany * 3 * circleRadius} ${circleRadius * 3}`);
    svg.setAttribute('width', `${howMany * 3 * circleRadius}px`);

    for (let i = 0; i < howMany; i++) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', `${circleRadius * 1.5 * (2 * i + 1)}`);
        circle.setAttribute('cy', `${circleRadius * 1.5}`);
        circle.setAttribute('r', `${circleRadius}`);
        circle.setAttribute('class', 'pagination-circle');
        circle.dataset.index = i + 1;
        circle.dataset.visited = i + 1 === 1 ? true : false;
        circle.dataset.active = i + 1 === 1 ? true : false;
        circle.dataset.fade = '';
        svg.appendChild(circle);
    }

    return svg;
}

function createPagination(howMany) {
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination-container';

    const svg = createSVGCircles(howMany, 7);

    paginationContainer.appendChild(svg);

    return paginationContainer;
}

function addPagination(containerClass, howMany) {
    const paginationContainer = createPagination(howMany);
    const container = document.querySelector(`${containerClass}`);

    container.appendChild(paginationContainer);
}

function syncPaginationNSlides(slideSelector, paginationSelector) {
    const slides = document.querySelectorAll(`${slideSelector}`);
    const pagination = document.querySelectorAll(`${paginationSelector}`);

    for (let i = 0; i < slides.length; i++) {
        pagination[i].dataset.active = slides[i].dataset.active;
        if (slides[i].dataset.active === 'true') {
            pagination[i].dataset.visited = true;
        }
    }
}

async function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}

async function isOptionSelected(slide) {
    const options = slide.querySelectorAll('input[type="radio"]');

    for (let option of options) {
        if (option.checked) {
            const category = option.parentElement.dataset.category;
            return category;
        }
    }

    await sleep(0.2);

    return isOptionSelected(slide);
}

function count(value, dict) {
    let count = 0;

    for (let key in dict) {
        if (dict[key] === value) {
            count += 1;
        }
    }

    return count;
}

function totalScore(dict, categories) {
    let categoriesTotal = {};

    for (let category of categories) {
        categoriesTotal[category] = count(category, dict);
    }

    return categoriesTotal;
}

const categories = ['adaptive', 'predictive', 'caution']

let categoriesScore = {};
let quesCategories = {
    1: 'category',
    2: 'category',
    3: 'category',
    4: 'category',
    5: 'category'
}

async function updateScore(slideSelector) {
    const slides = document.querySelectorAll(`${slideSelector}`);

    for (let i = 0; i < slides.length; i++) {
        if (slides[i].dataset.active === 'true') {
            const category = await isOptionSelected(slides[i]);
            slides[i].dataset.value = category;
            quesCategories[i + 1] = category;
            categoriesScore = totalScore(quesCategories, categories);
        }
    }
}

function getActiveSlideIndex(slides) {
    for (let i = 0; i < slides.length; i++) {
        if (slides[i].dataset.active === 'true') {
            return i + 1;
        }
    }
}

async function move2NthSlide(slideIndex, slideSelector) {
    const slides = document.querySelectorAll(`${slideSelector}`);
    const activeSlideIndex = getActiveSlideIndex(slides);

    const gap = slideIndex - activeSlideIndex;

    if (gap > 0) {
        for (let i = 0; i < gap; i++) {
            const prevSlide = slides[activeSlideIndex + i - 1];
            prevSlide.dataset.active = false;
            prevSlide.dataset.visited = true;
            const nextSlide = slides[activeSlideIndex + i];
            nextSlide.dataset.active = true;
            syncPaginationNSlides(slideSelector, paginationCirclesClass);
            moveSlide('left');
            await sleep(0.5);
        }
    } else if (gap === 0) {
        return;
    } else {
        for (let i = 0; i < Math.abs(gap); i++) {
            const prevSlide = slides[activeSlideIndex - i - 1];
            prevSlide.dataset.active = false;
            prevSlide.dataset.visited = true;
            const nextSlide = slides[activeSlideIndex - i - 2];
            nextSlide.dataset.active = true;
            syncPaginationNSlides(slideSelector, paginationCirclesClass);
            moveSlide('right');
            await sleep(0.5);
        }
    }

}

function findNextNotVisitedSlideIndex(activeSlideIndex, slides) {
    if (activeSlideIndex === slides.length) {
        return -1;
    }
    for (let i = activeSlideIndex; i < slides.length; i++) {
        if (slides[i].dataset.value == '') {
            return i + 1;
        }
    }

    return 1;

}

function activatePaginationFunc(slideSelector, paginationSelector) {
    const paginations = document.querySelectorAll(`${paginationSelector}`);

    for (let i = 0; i < paginations.length; i++) {
        paginations[i].addEventListener('click', function () {
            if (this.dataset.visited === 'false') {
                return;
            }
            move2NthSlide(parseInt(this.dataset.index), slideSelector);
        });
    }
}

async function updateSlides(slideSelector, paginationSelector) {
    const slides = document.querySelectorAll(`${slideSelector}`);
    const activeSlideIndex = getActiveSlideIndex(slides);

    await updateScore(slideSelector);

    const nextSlideIndex = findNextNotVisitedSlideIndex(activeSlideIndex, slides);

    if (nextSlideIndex < 0) {
        return showResult(categoriesScore);
    }

    move2NthSlide(nextSlideIndex, slideSelector);


}

async function runGame(slideSelector, paginationSelector) {
    const slides = document.querySelectorAll(`${slideSelector}`);

    for (let slide of slides) {
        const inputs = slide.querySelectorAll('input[type="radio"]');
        for (let input of inputs) {
            input.addEventListener('change', () => {
                updateSlides(slideSelector, paginationSelector);
            });
        }
    }

    activatePaginationFunc(slideSelector, paginationSelector);
}

async function changeBackgroundImage(containerSelector, imageUrl, time, delay = 0) {
    const container = document.querySelector(containerSelector);
    container.style.animation = `changeScreen ${time}s ease-in-out ${delay}s forwards`;

    setTimeout(() => {
        container.style.backgroundImage = `url("${imageUrl}")`;
    }, time * 1000 / 2);

    await sleep(time + delay);

    container.style.animation = 'none';
}

// fade out animation
function fadeOut(element, direction, duration, delay = 0) {
    if (direction === 'left') {
        element.style.animation = `fadeOutLeft ${duration}ms ease-in-out forwards`;
        element.style.animationDelay = `${delay}ms`;
    } else if (direction === 'right') {
        element.style.animation = `fadeOutRight ${duration}ms ease-in-out forwards`;
        element.style.animationDelay = `${delay}ms`;
    } else if (direction === 'top') {
        element.style.animation = `fadeOutTop ${duration}ms ease-in-out forwards`;
        element.style.animationDelay = `${delay}ms`;
    } else if (direction === 'bottom') {
        element.style.animation = `fadeOutBottom ${duration}ms ease-in-out forwards`;
        element.style.animationDelay = `${delay}ms`;
    }
}

// fade in animation

function fadeIn(element, direction, duration, delay = 0) {
    if (direction === 'left') {
        element.style.animation = `fadeInLeft ${duration}ms ease-in-out forwards`;
        element.style.animationDelay = `${delay}ms`;
    } else if (direction === 'right') {
        element.style.animation = `fadeInRight ${duration}ms ease-in-out forwards`;
        element.style.animationDelay = `${delay}ms`;
    } else if (direction === 'top') {
        element.style.animation = `fadeInTop ${duration}ms ease-in-out forwards`;
        element.style.animationDelay = `${delay}ms`;
    } else if (direction === 'bottom') {
        element.style.animation = `fadeInBottom ${duration}ms ease-in-out forwards`;
        element.style.animationDelay = `${delay}ms`;
    }
}

async function fadeAll(elementSelector, fadeType, direction, duration, delay = 0) {
    const elements = document.querySelectorAll(`${elementSelector} *[data-fade]`);
    for (let i = elements.length - 1; i >= 0; i--) {
        let element = elements[i];
        if (fadeType === 'in') {
            element.dataset.fade = 'in';
            fadeIn(element, direction, duration, delay < duration * 0.5 ? delay += duration * 0.1 : duration * 0.5);
        } else if (fadeType === 'out') {
            element.dataset.fade = 'out';
            fadeOut(element, direction, duration, delay < duration * 0.5 ? delay += duration * 0.1 : duration * 0.5);
        }
    }

    await sleep(duration * 1.5 / 1000);
    return;
}

async function waitForSubmit(submitBtnSelector) {
    const submitBtn = document.querySelector(`${submitBtnSelector}`);
    submitBtn.addEventListener('click', () => {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Submitting...';
    });

    while (true) {
        if (submitBtn.disabled) {
            return;
        }
        await sleep(0.1);
    }
}

async function formSubmission() {
    const formSection = document.querySelector('.spoon--form-section');
    const outputSection = document.querySelector('.spoon--output-section');

    const form = document.querySelector('.spoon--form-section > form');
    const name = form.querySelector('input[name="name"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const company = form.querySelector('input[name="company"]').value;

    // send mailto: sales.helsinki@spoonagency.fi with subject: "New contact from " + name + "(" + email + ") at " + company;

    // move to result screen
    await fadeAll('.spoon--form-section', 'out', 'bottom', 1000);

    formSection.dataset.isVisible = 'false';
    outputSection.dataset.isVisible = 'true';

    window.scrollTo('.spoon--header', {
        behavior: 'smooth'
    });

    fadeIn(outputSection, 'right', 1000);
    await fadeAll('.spoon--output-section', 'in', 'right', 1000);
}

async function showResult(categoriesScore) {
    const inputSection = document.querySelector('.spoon--input-section');
    const formSection = document.querySelector('.spoon--form-section');
    const outputSection = document.querySelector('.spoon--output-section');

    let resultCategory;
    for (let category in categoriesScore) {
        if (categoriesScore[category] === Math.max(...Object.values(categoriesScore))) {
            resultCategory = result[category];
        }
    }

    const resultDiv = outputSection.querySelector('.spoon--result');

    const img = resultDiv.querySelector('img');
    img.src = resultCategory.image.src;
    img.alt = resultCategory.image.alt;

    const textContent = resultDiv.querySelector('.result-text');
    const heading = textContent.querySelector('h2');

    try {
        heading.innerHTML = resultCategory.heading.text;
    } catch (e) {
        heading.outerHTML = '';
    }

    const descriptions = textContent.querySelectorAll('p');

    for (let i = 0; i < descriptions.length; i++) {
        descriptions[i].innerHTML = resultCategory.para[i + 1];
    }

    await fadeAll('.spoon--input-section', 'out', 'right', 1000);

    inputSection.dataset.isVisible = 'false';
    formSection.dataset.isVisible = 'true';

    window.scrollTo('.spoon--header', {
        behavior: 'smooth'
    });

    await fadeAll('.spoon--form-section', 'in', 'left', 1000);

}

async function replay() {
    const inputSection = document.querySelector('.spoon--input-section');
    const outputSection = document.querySelector('.spoon--output-section');

    appendSlider(questions, ".spoon--input-main-container")

    addPagination('.spoon--input-main-container', Object.keys(questions).length);

    runGame(slideClass, paginationCirclesClass);

    fadeOut(outputSection, 'left', 1500);
    await fadeAll('.spoon--output-section', 'out', 'left', 800);
    outputSection.dataset.isVisible = 'false';
    inputSection.dataset.isVisible = 'true';

    window.scrollTo('.spoon--header', {
        behavior: 'smooth'
    });

    showNcards(1);
    currentXdisplacement = 0;
    categoriesScore = {};
    quesCategories = {
        1: 'category',
        2: 'category',
        3: 'category',
        4: 'category',
        5: 'category'
    }

    fadeIn(inputSection, 'left', 500);
    await fadeAll('.spoon--input-section', 'in', 'left', 1000);
}