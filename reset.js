// reset everything when file form is submitted
function resetEverything() {
    resetSelects();
    resetCharts();
    resetChartObjs();
}

function resetChartObjs() {
    topicObj = {};
    groupObj = {};
    userObj = {};
}

function resetSelects() {
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

function resetCharts() {
    const charArr = [topicCharts, userCharts, groupCharts];
    charArr.forEach((chart) => {
        for(let chartKey in chart) {
            // get chart properties such as canvas id and chart object
            const chartProp = chart[chartKey];

            // destroy any previous chart
            if (chartProp.chartObj) {
                chartProp.chartObj.destroy();
                chartProp.chartObj = null;
            }
        }
    });
}
