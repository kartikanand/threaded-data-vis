function addGlobalEventHandlers() {
    const fileInput = document.querySelector('#js-file-form');
    fileInput.addEventListener('submit', (ev) => {
        ev.preventDefault();

        const fileInput = ev.target.querySelector('#js-json-file');
        loadFileHandler(fileInput);
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
function loadFileHandler(target) {
    // reset all select boxes
    resetSelect();

    loadJSON(target).then((jsonObj) => {
        const {topicObj, groupObj, userObj} = getAggregateStatistics(jsonObj);

        addTopicSelectHandlers(topicObj);
        addGroupSelectHandlers(groupObj);
        addUserSelectHandlers(userObj);
    });
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
            chartObj: null
        },
        'likes': {
            canvas: 'js-topic-likes-canvas',
            label: '# of Likes',
            chartObj: null
        },
        'images': {
            canvas: 'js-topic-images-canvas',
            label: '# of Images',
            chartObj: null
        },
        'textchars': {
            canvas: 'js-topic-textchars-canvas',
            label: '# of text characters',
            chartObj: null
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
                'js-topic-attr-select'
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
            chartObj: null
        },
        'likes': {
            canvas: 'js-group-likes-canvas',
            label: '# of Likes',
            chartObj: null
        },
        'images': {
            canvas: 'js-group-images-canvas',
            label: '# of Images',
            chartObj: null
        },
        'textchars': {
            canvas: 'js-group-textchars-canvas',
            label: '# of text characters',
            chartObj: null
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
                'js-group-attr-select'
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
            chartObj: null
        },
        'likes': {
            canvas: 'js-user-likes-canvas',
            label: '# of Likes',
            chartObj: null
        },
        'images': {
            canvas: 'js-user-images-canvas',
            label: '# of Images',
            chartObj: null
        },
        'textchars': {
            canvas: 'js-user-textchars-canvas',
            label: '# of text characters',
            chartObj: null
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
                'js-user-attr-select'
            );
        }
    });
}
