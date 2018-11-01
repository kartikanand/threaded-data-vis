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

    // this will automatically get added to the closure
    let chart = null;

    const topicSelectForm = document.querySelector('#js-topic-form');
    topicSelectForm.addEventListener('submit', (ev) => {
        ev.preventDefault();

        console.log(this);

        // destroy any previous chart
        if (chart) {
            chart.destroy();
            chart = null;
        }

        // handle selections
        chart = createAggregateChart(topicObj,
            'js-topic-canvas',
            'js-topic-select',
            'js-topic-attr-select');
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

    // this will automatically get added to the closure
    let chart = null;

    const groupSelectForm = document.querySelector('#js-group-form');
    groupSelectForm.addEventListener('submit', (ev) => {
        ev.preventDefault();

        // destroy any previous chart
        if (chart) {
            chart.destroy();
            chart = null;
        }

        // handle selections
        chart = createAggregateChart(groupObj,
            'js-group-canvas',
            'js-group-select',
            'js-group-attr-select');
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

     // this will automatically get added to the closure
    let chart = null;

    const userSelectForm = document.querySelector('#js-user-form');
    userSelectForm.addEventListener('submit', (ev) => {
        ev.preventDefault();

        // destroy any previous chart
        if (chart) {
            chart.destroy();
            chart = null;
        }

        // handle selections
        createAggregateChart(userObj,
            'js-user-canvas',
            'js-user-select',
            'js-user-attr-select');
    });
}
