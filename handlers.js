function addGlobalEventHandlers() {
    const fileInput = document.getElementById('js-file-form-submit');
    fileInput.addEventListener('click', (ev) => {
        ev.preventDefault();

        const fileInput = ev.target.getElementById('js-json-file');
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

    selectIds.forEach((id) => {
        const select = document.getElementById(id);
        const length = select.options.length;
        for (let i = 0; i < length; i++) {
            select.remove(0);
        }
    });
}

// main function responsible for drawing charts
function loadJsonObj(jsonObj) {
    // reset all select boxes
    resetSelect();

    const {topicObj, groupObj, userObj} = getAggregateStatistics(jsonObj);

    addTopicSelectHandlers(topicObj);
    addGroupSelectHandlers(groupObj);
    addUserSelectHandlers(userObj);
}

// add handlers for form in topic sub-tab
function addTopicSelectHandlers(topicObj) {
    // add topic IDs to topic select box
    const topicSelectInput = document.querySelector('#js-topic-select');
    addOptionsToSelect(topicSelectInput, Object.keys(topicObj));

    // add users and groups option to further select
    const topicSelectAttrInput = document.querySelector('#js-topic-attr-select');
    addOptionsToSelect(topicSelectAttrInput, ['users', 'groups']);

    const charts = {
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

    const topicSelectForm = document.querySelector('#js-topic-form');
    topicSelectForm.addEventListener('submit', (ev) => {
        ev.preventDefault();

        for(let chartKey in charts) {
            // get chart properties such as canvas id and chart object
            const chartProp = charts[chartKey];

            // destroy any previous chart
            if (chartProp.chartObj) {
                chartProp.chartObj.destroy();
                chartProp.chartObj = null;
            }

            // handle selections
            chartProp.chartObj = createAggregateChart(topicObj,
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
function addGroupSelectHandlers(groupObj) {
    // add group IDs to group select box
    const groupSelectInput = document.querySelector('#js-group-select');
    addOptionsToSelect(groupSelectInput, Object.keys(groupObj));

    // add users and groups option to further select
    const groupSelectAttrInput = document.querySelector('#js-group-attr-select');
    addOptionsToSelect(groupSelectAttrInput, ['users', 'topics']);

    const charts = {
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

    const groupSelectForm = document.querySelector('#js-group-form');
    groupSelectForm.addEventListener('submit', (ev) => {
        ev.preventDefault();

        for(let chartKey in charts) {
            // get chart properties such as canvas id and chart object
            const chartProp = charts[chartKey];

            // destroy any previous chart
            if (chartProp.chartObj) {
                chartProp.chartObj.destroy();
                chartProp.chartObj = null;
            }

            // handle selections
            chartProp.chartObj = createAggregateChart(groupObj,
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
function addUserSelectHandlers(userObj) {
    // add user IDs to user select box
    const userSelectInput = document.querySelector('#js-user-select');
    addOptionsToSelect(userSelectInput, Object.keys(userObj));

    // add topics and groups option to further select
    const userSelectAttrInput = document.querySelector('#js-user-attr-select');
    addOptionsToSelect(userSelectAttrInput, ['groups', 'topics']);

    const charts = {
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

    const userSelectForm = document.querySelector('#js-user-form');
    userSelectForm.addEventListener('submit', (ev) => {
        ev.preventDefault();

        for(let chartKey in charts) {
            // get chart properties such as canvas id and chart object
            const chartProp = charts[chartKey];

            // destroy any previous chart
            if (chartProp.chartObj) {
                chartProp.chartObj.destroy();
                chartProp.chartObj = null;
            }

            // handle selections
            chartProp.chartObj = createAggregateChart(userObj,
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
