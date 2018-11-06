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
    // reset all select boxes
    resetEverything();

    getAggregateStatistics(jsonObj);

    addTopicSelectHandlers();
    addGroupSelectHandlers();
    addUserSelectHandlers();

    createHeatMap();
}

function addOptionsToSelect(select, options) {
    options.forEach((option) => {
        const selectOption = document.createElement("option");
        selectOption.value = option;
        selectOption.text = option;

        select.add(selectOption, null);
    });
}
