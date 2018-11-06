function addGlobalEventHandlers() {
    const fileInput = document.getElementById('js-file-form-submit');
    fileInput.addEventListener('click', (ev) => {
        ev.preventDefault();

        const fileInput = document.getElementById('js-json-file');
        loadJSON(fileInput).then(loadJsonObj);
    });

    const sampleDataInput1 = document.getElementById('js-file-sample1');
    sampleDataInput1.addEventListener('click', (ev) => {
        ev.preventDefault();

        fetch('example1.json').then((response) => {
            return response.json();
        }).then(loadJsonObj);
    });

    const sampleDataInput2 = document.getElementById('js-file-sample2');
    sampleDataInput2.addEventListener('click', (ev) => {
        ev.preventDefault();

        fetch('example2.json').then((response) => {
            return response.json();
        }).then(loadJsonObj);
    });
}

// returns a promise to decoded json object created from uploaded file
function loadJSON (target) {
    return new Promise(function(resolve, reject) {
        if (!target || !target.files) {
            reject('invalid file');
        }

        const numFiles = target.files.length;
        if (numFiles != 1) {
            reject('invalid file');
        }

        const jsonFile = target.files[0];

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            if (reader.readyState == 2) {
                const jsonText = reader.result;

                resolve(JSON.parse(jsonText));
            } else {
                reject('file load error');
            }
        });

        reader.readAsText(jsonFile);
    });
}

// main function responsible for drawing charts
function loadJsonObj(jsonObj) {
    resetChartObjs();

    resetFormHandlers();

    // clear and remove any chart present
    clearChartArea();

    getAggregateStatistics(jsonObj);

    addSelectOptions();

    addFormHandlers();
}

function resetChartObjs() {
    topicObj = {};
    groupObj = {};
    userObj = {};
}

function resetSelect(select) {
    const length = select.options.length;
    for (let i = 0; i < length; i++) {
        select.remove(0);
    }
}

