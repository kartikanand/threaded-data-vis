let topicObj, groupObj, userObj;

const topicCharts = {
    'messages': {
        canvas: 'js-topic-messages-canvas',
        label: '# of Messages',
        chartObj: null,
        bgColor: 'rgba(255, 99, 132, 0.2)'
    },
    'likes': {
        canvas: 'js-topic-likes-canvas',
        label: '# of Likes',
        chartObj: null,
        bgColor: 'rgba(54, 162, 235, 0.2)'
    },
    'images': {
        canvas: 'js-topic-images-canvas',
        label: '# of Images',
        chartObj: null,
        bgColor: 'rgba(255, 206, 86, 0.2)'
    },
    'textchars': {
        canvas: 'js-topic-textchars-canvas',
        label: '# of text characters',
        chartObj: null,
        bgColor: 'rgba(75, 192, 192, 0.2)'
    }
};

const groupCharts = {
    'messages': {
        canvas: 'js-group-messages-canvas',
        label: '# of Messages',
        chartObj: null,
        bgColor: 'rgba(255, 99, 132, 0.2)'
    },
    'likes': {
        canvas: 'js-group-likes-canvas',
        label: '# of Likes',
        chartObj: null,
        bgColor: 'rgba(54, 162, 235, 0.2)'
    },
    'images': {
        canvas: 'js-group-images-canvas',
        label: '# of Images',
        chartObj: null,
        bgColor: 'rgba(255, 206, 86, 0.2)'
    },
    'textchars': {
        canvas: 'js-group-textchars-canvas',
        label: '# of text characters',
        chartObj: null,
        bgColor: 'rgba(75, 192, 192, 0.2)'
    }
};

const userCharts = {
    'messages': {
        canvas: 'js-user-messages-canvas',
        label: '# of Messages',
        chartObj: null,
        bgColor: 'rgba(255, 99, 132, 0.2)'
    },
    'likes': {
        canvas: 'js-user-likes-canvas',
        label: '# of Likes',
        chartObj: null,
        bgColor: 'rgba(54, 162, 235, 0.2)'
    },
    'images': {
        canvas: 'js-user-images-canvas',
        label: '# of Images',
        chartObj: null,
        bgColor: 'rgba(255, 206, 86, 0.2)'
    },
    'textchars': {
        canvas: 'js-user-textchars-canvas',
        label: '# of text characters',
        chartObj: null,
        bgColor: 'rgba(75, 192, 192, 0.2)'
    }
};

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

// reset everything when file form is submitted
function resetSelect() {
    const selectIds = [
        'js-topic-select',
        'js-topic-attr-select',
        'js-group-select',
        'js-group-attr-select',
        'js-user-select',
        'js-user-attr-select'];

    for(let chartKey in topicCharts) {
            // get chart properties such as canvas id and chart object
            const chartProp = topicCharts[chartKey];

            // destroy any previous chart
            if (chartProp.chartObj) {
                chartProp.chartObj.destroy();
                chartProp.chartObj = null;
            }
    }

    for(let chartKey in groupCharts) {
            // get chart properties such as canvas id and chart object
            const chartProp = groupCharts[chartKey];

            // destroy any previous chart
            if (chartProp.chartObj) {
                chartProp.chartObj.destroy();
                chartProp.chartObj = null;
            }
    }

    for(let chartKey in userCharts) {
            // get chart properties such as canvas id and chart object
            const chartProp = userCharts[chartKey];

            // destroy any previous chart
            if (chartProp.chartObj) {
                chartProp.chartObj.destroy();
                chartProp.chartObj = null;
            }
    }

    selectIds.forEach((id) => {
        const select = document.getElementById(id);
        const length = select.options.length;
        for (let i = 0; i < length; i++) {
            select.remove(0);
        }
    });

    topicObj = {};
    groupObj = {};
    userObj = {};
}

// main function responsible for drawing charts
function loadJsonObj(jsonObj) {
    // reset all select boxes
    resetSelect();

    getAggregateStatistics(jsonObj);

    addTopicSelectHandlers();
    addGroupSelectHandlers();
    addUserSelectHandlers();
}

// add handlers for form in topic sub-tab
function addTopicSelectHandlers() {
    // add topic IDs to topic select box
    const topicSelectInput = document.querySelector('#js-topic-select');
    addOptionsToSelect(topicSelectInput, Object.keys(topicObj));

    // add users and groups option to further select
    const topicSelectAttrInput = document.querySelector('#js-topic-attr-select');
    addOptionsToSelect(topicSelectAttrInput, ['users', 'groups']);

    const topicSelectForm = document.querySelector('#js-topic-form');
    topicSelectForm.addEventListener('submit', (ev) => {
        ev.preventDefault();

        for(let chartKey in topicCharts) {
            // get chart properties such as canvas id and chart object
            const chartProp = topicCharts[chartKey];

            // destroy any previous chart
            if (chartProp.chartObj) {
                chartProp.chartObj.destroy();
                chartProp.chartObj = null;
            }

            // handle selections
            chartProp.chartObj = createAggregateChart(
                'topic',
                chartKey,
                chartProp.label,
                chartProp.canvas,
                'js-topic-select',
                'js-topic-attr-select',
                chartProp.bgColor
            );
        }
    });
}

// add handlers for form in group sub-tab
function addGroupSelectHandlers() {
    // add group IDs to group select box
    const groupSelectInput = document.querySelector('#js-group-select');
    addOptionsToSelect(groupSelectInput, Object.keys(groupObj));

    // add users and groups option to further select
    const groupSelectAttrInput = document.querySelector('#js-group-attr-select');
    addOptionsToSelect(groupSelectAttrInput, ['users', 'topics']);

    const groupSelectForm = document.querySelector('#js-group-form');
    groupSelectForm.addEventListener('submit', (ev) => {
        ev.preventDefault();

        for(let chartKey in groupCharts) {
            // get chart properties such as canvas id and chart object
            const chartProp = groupCharts[chartKey];

            // destroy any previous chart
            if (chartProp.chartObj) {
                chartProp.chartObj.destroy();
                chartProp.chartObj = null;
            }

            // handle selections
            chartProp.chartObj = createAggregateChart(
                'group',
                chartKey,
                chartProp.label,
                chartProp.canvas,
                'js-group-select',
                'js-group-attr-select',
                chartProp.bgColor
            );
        }
    });
}

// add handlers for form in user sub-tab
function addUserSelectHandlers() {
    // add user IDs to user select box
    const userSelectInput = document.querySelector('#js-user-select');
    addOptionsToSelect(userSelectInput, Object.keys(userObj));

    // add topics and groups option to further select
    const userSelectAttrInput = document.querySelector('#js-user-attr-select');
    addOptionsToSelect(userSelectAttrInput, ['groups', 'topics']);

    const userSelectForm = document.querySelector('#js-user-form');
    userSelectForm.addEventListener('submit', (ev) => {
        ev.preventDefault();

        for(let chartKey in userCharts) {
            // get chart properties such as canvas id and chart object
            const chartProp = userCharts[chartKey];

            // destroy any previous chart
            if (chartProp.chartObj) {
                chartProp.chartObj.destroy();
                chartProp.chartObj = null;
            }

            // handle selections
            chartProp.chartObj = createAggregateChart(
                'user',
                chartKey,
                chartProp.label,
                chartProp.canvas,
                'js-user-select',
                'js-user-attr-select',
                chartProp.bgColor
            );
        }
    });
}
