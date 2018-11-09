// global objects
let topicObj = {}, groupObj = {}, userObj = {};

function masterFormHandler(ev) {
    if (ev) {
        ev.preventDefault();
    }

    // clear and remove any chart present
    clearChartArea();

    const row = document.getElementById('js-master-select-row').value;
    const col = document.getElementById('js-master-select-col').value;
    const id = document.getElementById('js-master-select-id').value;
    const attr = document.getElementById('js-master-select-attr').value;

    if (id == 'all' && row != col) {
        // create single heatmap canvas
        createHeatMapCanvas();
        createHeatMap('js-heatmap', row, col, attr);
        return;
    } else {
        // get chart type
        let chartType = 'bar';
        const chartTypeLine = document.getElementById('chartTypeLine');
        if (chartTypeLine.checked) {
            chartType = 'line';
        }

        // null behavior
        let showNull = true;
        const hideNull = document.getElementById('hideNull');
        if (hideNull.checked) {
            showNull = false;
        }

        if (attr != 'all') {
            // create single barchart canvas
            createBarChartCanvas();
            createBarChart('js-barchart', row, col, id, attr, charts[attr].bgColor, chartType, showNull);
            return;
        }

        // create multi-barchart canvas
        createMultiBarChartCanvas();
        for (let attr in charts) {
            createBarChart(charts[attr].canvas, row, col, id, attr, charts[attr].bgColor, chartType, showNull);
        }
    }
}

function addFormHandlers() {
    const form = document.getElementById('js-master-form');
    form.addEventListener('submit', masterFormHandler);

    const row = document.getElementById('js-master-select-row');
    row.addEventListener('change', selectRowHandler);

    const col = document.getElementById('js-master-select-col');
    col.addEventListener('change', selectColHandler);

    const id = document.getElementById('js-master-select-id');
    id.addEventListener('change', selectIdHandler);

    const attr = document.getElementById('js-master-select-attr');
    attr.addEventListener('change', selectAttrHandler);

    const chartTypeLine = document.getElementById('chartTypeLine');
    chartTypeLine.addEventListener('change', chartTypeHandler);

    const chartTypeBar = document.getElementById('chartTypeBar');
    chartTypeBar.addEventListener('change', chartTypeHandler);

    const showNull = document.getElementById('showNull');
    showNull.addEventListener('change', nullHandler);

    const hideNull = document.getElementById('hideNull');
    hideNull.addEventListener('change', nullHandler);
}

function resetFormHandlers() {
    const form = document.getElementById('js-master-form');
    form.removeEventListener('submit', masterFormHandler);

    const row = document.getElementById('js-master-select-row');
    row.removeEventListener('change', selectRowHandler);

    const col = document.getElementById('js-master-select-col');
    col.removeEventListener('change', selectColHandler);

    const id = document.getElementById('js-master-select-id');
    id.removeEventListener('change', selectIdHandler);

    const attr = document.getElementById('js-master-select-attr');
    attr.removeEventListener('change', selectAttrHandler);

    const chartTypeLine = document.getElementById('chartTypeLine');
    chartTypeLine.removeEventListener('change', chartTypeHandler);

    const chartTypeBar = document.getElementById('chartTypeBar');
    chartTypeBar.removeEventListener('change', chartTypeHandler);

    const showNull = document.getElementById('showNull');
    showNull.removeEventListener('change', nullHandler);

    const hideNull = document.getElementById('hideNull');
    hideNull.removeEventListener('change', nullHandler);
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

function nullHandler(ev) {
    ev.preventDefault()

    // clear and remove any chart present
    clearChartArea();

    // submit the form
    masterFormHandler(null);
}

function chartTypeHandler(ev) {
    ev.preventDefault();

    // clear and remove any chart present
    clearChartArea();

    // submit the form
    masterFormHandler(null);
}

function selectRowHandler(ev) {
    ev.preventDefault();

    // clear and remove any chart present
    clearChartArea();

    // change attr options by calling id handler
    selectIdHandler(null);
}

function selectColHandler(ev) {
    ev.preventDefault();

    // clear and remove any chart present
    clearChartArea();

    const colType = ev.target.value;
    const select = document.getElementById('js-master-select-id');
    addSelectIdOptions(colType, select);

    // change attr options by calling id handler
    selectIdHandler(null);
}

function selectAttrHandler(ev) {
    ev.preventDefault();

    // clear and remove any chart present
    clearChartArea();

    // submit the form
    masterFormHandler(null);
}

function selectIdHandler(ev) {
    if (ev) {
        ev.preventDefault();
    }

    // clear and remove any chart present
    clearChartArea();

    const row = document.getElementById('js-master-select-row').value;
    const col = document.getElementById('js-master-select-col').value;
    const id = document.getElementById('js-master-select-id').value;
    const select = document.getElementById('js-master-select-attr');

    // remove all existing options
    resetSelect(select);

    let keys = ['messages', 'images', 'likes', 'textchars'];
    if (id != 'all' || row == col) {
        keys.push('all');
    }

    addOptionsToSelect(select, keys);

    // submit the form
    masterFormHandler(null);
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

function addHeatMapLegends(arr) {
    const q25 = Quartile_25(arr);
    const q50 = Quartile_50(arr);
    const q75 = Quartile_75(arr);
    const max = Math.max(...arr);

    const legendRow = $('<div class"row"></div>');
    const legendCol = $('<div class="col-12 text-center"></div>');

    legendCol.appendTo(legendRow);

    $('<button class="btn btn-primary btn-sm">0</button>').css("color", "black").css("background-color", "#eff3ff").appendTo(legendCol);

    if (q25 > 0) {
        $(`<button class="btn btn-primary btn-sm">${q25}</button>`).css("color", "black").css("background-color", "#bdd7e7").appendTo(legendCol);
    }

    if (q50 > q25) {
        $(`<button class="btn btn-primary btn-sm">${q50}</button>`).css("background-color", "#6baed6").appendTo(legendCol);
    }

    if (q75 > q50) {
        $(`<button class="btn btn-primary btn-sm">${q75}</button>`).css("background-color", "#3182bd").appendTo(legendCol);
    }

    if (max > q75) {
        $(`<button class="btn btn-primary btn-sm">${max}</button>`).css("background-color", "#08519c").appendTo(legendCol);
    }

    legendRow.appendTo('#js-chart-area')
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
