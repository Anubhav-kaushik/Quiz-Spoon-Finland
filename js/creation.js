function createOption(value, text, quesNum) {
    const option = document.createElement("div");
    option.className = "option";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "question" + quesNum;
    input.id = "question" + quesNum + "option" + value;
    input.value = value;
    option.appendChild(input);

    const label = document.createElement("label");
    label.htmlFor = "question" + quesNum + "option" + value;

    const optionContent = document.createElement("div");
    optionContent.className = "option-content";

    const optionText = document.createElement("p");
    optionText.dataset.fontSize = "normal";
    optionText.innerHTML = text;
    optionContent.appendChild(optionText);

    label.appendChild(optionContent);

    option.appendChild(label);

    return option;
}

function createQuesSlide(question, quesNum) {
    const quesSlide = document.createElement("div");
    quesSlide.className = "slide";
    quesSlide.dataset.questionNumber = quesNum;
    quesSlide.dataset.active = quesNum === 1 ? "true" : "false";
    quesSlide.dataset.value = '';

    const quesText = document.createElement("h3");
    quesText.dataset.fontSize = "large2";
    quesText.dataset.fontFamily = "Medium";
    
    quesText.innerHTML = question.question;
    quesSlide.appendChild(quesText);

    const optionsContainer = document.createElement("div");
    optionsContainer.className = "options";
    optionsContainer.dataset.fontFamily = "Regular";
    const options = question.options;

    for (let i = 0; i < Object.keys(options).length; i++) {
        const option = createOption(i + 1, options[i + 1][0], quesNum);
        option.dataset.category = options[i + 1][1];
        optionsContainer.appendChild(option);
    }

    quesSlide.appendChild(optionsContainer);

    return quesSlide;
}

function createSliderContainer(data) {
    const sliderContainer = document.createElement("div");
    sliderContainer.className = "slider-container";

    const slideContainer = document.createElement("div");
    slideContainer.className = "slide-container";

    for (let i = 0; i < Object.keys(data).length; i++) {
        const slide = createQuesSlide(data[i + 1], i + 1);
        slideContainer.appendChild(slide);
    }

    sliderContainer.appendChild(slideContainer);

    return sliderContainer;
}

function appendSlider(data, containerClass) {
    const sliderContainer = createSliderContainer(data);
    const container = document.querySelector(containerClass);

    container.innerHTML = "";

    container.appendChild(sliderContainer);
}