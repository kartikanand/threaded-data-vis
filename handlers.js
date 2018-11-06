// global objects
let topicObj = {}, groupObj = {}, userObj = {};

function masterFormHandler(ev) {
    ev.preventDefault();

    // clear and remove any chart present
    clearChartArea();

    const row = document.getElementById('js-master-select-row').value;
    const col = document.getElementById('js-master-select-col').value;
    const id = document.getElementById('js-master-select-id').value;
    const attr = document.getElementById('js-master-select-attr').value;

    if (id == 'all') {
        // create single heatmap canvas
        createHeatMapCanvas();
        createHeatMap('js-heatmap', row, col, attr);
        return;
    }

    if (attr != 'all') {
        // create single barchart canvas
        createBarChartCanvas();
        createBarChart('js-barchart', row, col, id, attr, charts[attr].bgColor);
        return;
    }

    // create multi-barchart canvas
    createMultiBarChartCanvas();
    for (let attr in charts) {
        createBarChart(charts[attr].canvas, row, col, id, attr, charts[attr].bgColor);
    }
}

function addFormHandlers() {
    const form = document.getElementById('js-master-form');
    form.addEventListener('submit', masterFormHandler);

    const col = document.getElementById('js-master-select-col');
    col.addEventListener('change', selectColHandler);

    const id = document.getElementById('js-master-select-id');
    id.addEventListener('change', selectIdHandler);
}

function resetFormHandlers() {
    const form = document.getElementById('js-master-form');
    form.removeEventListener('submit', masterFormHandler);

    const col = document.getElementById('js-master-select-col');
    col.removeEventListener('change', selectColHandler);

    const id = document.getElementById('js-master-select-id');
    id.removeEventListener('change', selectIdHandler);
}

function addSelectOptions() {
    const row = document.getElementById('js-master-select-row');
    const col = document.getElementById('js-master-select-col');
    const id = document.getElementById('js-master-select-id');
    const attr = document.getElementById('js-master-select-attr');

    resetSelect(row);
    resetSelect(col);
    resetSelect(id);
    resetSelect(attr);

    addOptionsToSelect(row, ['users', 'topics', 'groups']);
    addOptionsToSelect(col, ['topics', 'groups', 'users']);
    addOptionsToSelect(attr, ['messages', 'images', 'likes', 'textchars']);

    addSelectIdOptions('topics', id);
}

function selectColHandler(ev) {
    ev.preventDefault();

    // clear and remove any chart present
    clearChartArea();

    const colType = ev.target.value;
    const select = document.getElementById('js-master-select-id');
    addSelectIdOptions(colType, select);
}

function selectIdHandler(ev) {
    ev.preventDefault();

    // clear and remove any chart present
    clearChartArea();

    const id = ev.target.value;
    const select = document.getElementById('js-master-select-attr');

    // remove all existing options
    resetSelect(select);

    let keys = ['messages', 'images', 'likes', 'textchars'];
    if (id != 'all') {
        keys.push('all');
    }

    addOptionsToSelect(select, keys);
}

function addSelectIdOptions(colType, select) {
    // remove all existing options
    resetSelect(select);

    // get aggregate object according to column type
    // to populate keys
    const aggregateObj = getObjectFromStr(colType);

    const keys = Object.keys(aggregateObj);

    // add relevant options
    addOptionsToSelect(select, ['all']);
    addOptionsToSelect(select, keys);
}

function addOptionsToSelect(select, options) {
    options.forEach((option) => {
        const selectOption = document.createElement("option");
        selectOption.value = option;
        selectOption.text = option;

        select.add(selectOption, null);
    });
}

function clearChartArea() {
    $('#js-chart-area').empty();
}

function getObjectFromStr(str) {
    let aggregateObj;
    if (str == 'topics') {
        aggregateObj = topicObj;
    } else if (str == 'groups') {
        aggregateObj = groupObj;
    } else if (str == 'users') {
        aggregateObj = userObj;
    }

    return aggregateObj;
}

function createMultiBarChartCanvas() {
    const row1 = $('<div class="row"></div>').appendTo('#js-chart-area');

    const col11 = $('<div class="col-md-6"></div>').appendTo(row1)
    const messagesChart = $('<canvas></canvas>').appendTo(col11);
    messagesChart.attr('id', charts.messages.canvas);

    const col12 = $('<div class="col-md-6"></div>').appendTo(row1)
    const likesChart = $('<canvas></canvas>').appendTo(col12);
    likesChart.attr('id', charts.likes.canvas);

    const row2 = $('<div class="row"></div>').appendTo('#js-chart-area');

    const col21 = $('<div class="col-md-6"></div>').appendTo(row2)
    const textcharsChart = $('<canvas></canvas>').appendTo(col21);
    textcharsChart.attr('id', charts.textchars.canvas);

    const col22 = $('<div class="col-md-6"></div>').appendTo(row2)
    const imagesChart = $('<canvas></canvas>').appendTo(col22);
    imagesChart.attr('id', charts.images.canvas);
}

function createBarChartCanvas() {
    const id = 'js-barchart';
    const barChartCanvas = $('<canvas></canvas>').appendTo('#js-chart-area');
    barChartCanvas.attr('id', id);
}

function createHeatMapCanvas() {
    const id = 'js-heatmap';
    const heatMapCanvas = $('<canvas></canvas>').appendTo('#js-chart-area');
    heatMapCanvas.attr('id', id);
}
