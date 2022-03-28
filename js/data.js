const result = {
    adaptive: {
        heading: {
            text: "Adaptive",
            fontFamily: "Regular"
        },
        para: {
            1: "Congratulations! You have a leading edge. Continue your winning streak by contacting us at <a href='mailto:sales.helsinki@spoonagency.fi'>sales.helsinki@spoonagency.fi</a>",
            fontFamily: "Regular"
        },
        image: {
            src: "infographics/interactive-names/adaptive.svg",
            alt: "Adaptive"
        }
    },
    predictive: {
        heading: {
            text: "Predictive",
            fontFamily: "Regular"
        },
        para: {
            1: "Oops! You are almost there. We’ll be happy to help you cover more ground. Get in touch with us at <a href='mailto:sales.helsinki@spoonagency.fi'>sales.helsinki@spoonagency.fi</a>",
            fontFamily: "Regular"
        },
        image: {
            src: "infographics/interactive-names/predictive.svg",
            alt: "Predictive"
        }
    },
    caution: {
        para: {
            1: "Hmm it seems you still have some ground to cover. We'd be happy to help so get in touch: <a href='mailto:sales.helsinki@spoonagency.fi'>sales.helsinki@spoonagency.fi</a>",
            fontFamily: "Regular"
        },
        image: {
            src: "infographics/interactive-names/caution.svg",
            alt: "Not Applicable"
        }
    }
}

const questions = {
    1: {
        question: "What drives your content marketing? ",
        options: {
            1: ["Speed & data", 'predictive'],
            2: ["Consumer Behavior", 'adaptive'],
            3: ["All of the above", 'adaptive'],
            4: ["Can't say", 'caution']
        }
    },
    2: {
        question: "Whose needs does your content target?",
        options: {
            1: ["Your brand", 'predictive'],
            2: ["The consumer", 'predictive'],
            3: ["All of the above", 'adaptive'],
            4: ["Can't say", 'caution']
        }
    },
    3: {
        question: "You use data and marketing tools for ",
        options: {
            1: ["Forecasting the customer's behavior", 'adaptive'],
            2: ["Personalizing content based on the customer's journey", 'predictive'],
            3: ["All of the above", 'adaptive'],
            4: ["Can't say", 'caution']
        }
    },
    4: {
        question: "You rely on the following for your content strategy",
        options: {
            1: ["Data and data alone", 'predictive'],
            2: ["Behavioural insights and trends", 'adaptive'],
            3: ["All of the above", 'adaptive'],
            4: ["Can't say", 'caution']
        }
    },
    5: {
        question: "What are your content marketing goals?",
        options: {
            1: ["High Sales", 'predictive'],
            2: ["Larger audience share", 'predictive'],
            3: ["To influence consumer behavior", 'adaptive'],
            4: ["Can't say", 'caution']
        }
    }
}

