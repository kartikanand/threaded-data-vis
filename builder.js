const chartColors = {
    0: '#fee5d9',
    1: '#fcae91',
    2: '#fb6a4a',
    3: '#de2d26',
    4: '#a50f15',
};

function getColor(messages, msgCount) {
    if (msgCount == 0) {
        return chartColors[0];
    }

    const q25 = Quartile_25(messages);
    const q50 = Quartile_50(messages);
    const q75 = Quartile_75(messages);

    if (msgCount <= q25) {
        return chartColors[1];
    }

    if (msgCount <= q50) {
        return chartColors[2];
    }

    if (msgCount <= q75) {
        return chartColors[3];
    }

    return chartColors[4];
}

function createHeatMap() {
    // no. of users --- labels as no. of data
    let users = Object.keys(userObj);

    // no. of topics --- no. of datasets
    let topics = Object.keys(topicObj);

    // preprocess to get min/max messages
    const messages = [];
    topics.forEach((topic) => {
        users.forEach((user) => {
            // get y object for this x
            const userObj = topicObj[topic].users;
            const msgCount = userObj[user].messages;

            messages.push(msgCount);
        });
    });

    const data = Array(users.length).fill(1);
    const datasets = [];
    topics.forEach((topic) => {
        const colors = [];
        users.forEach((user) => {
            // get y object for this x
            const userObj = topicObj[topic].users;
            const msgCount = userObj[user].messages;

            colors.push(getColor(messages, msgCount));
        });

        datasets.push({
            label: topic,
            backgroundColor: colors,
            borderColor: 'rgb(130,34,34,0.3)',
            borderWidth: 0.5,
            data: data,
        });
    });

    var barChartData = {
        labels: users,
        datasets: datasets
    };

    const ctx = document.getElementById('heatmap').getContext('2d');
    var heatmap = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
            tooltips: {
                mode: 'index',
                intersect: false
            },
            responsive: true,
            scales: {
                xAxes: [{
                    stacked: true,
                    barPercentage: 1.0,
                    categoryPercentage: 1.0,
                    gridLines: {
                        display: false
                    }
                }],
                yAxes: [{
                    stacked: true,
                    barPercentage: 1.0,
                    categoryPercentage: 1.0,
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        beginAtZero:true,
                        stepSize: 1,
                        callback: function(label, index, labels) {
                            return topics[index];
                        }
                    }
                }]
            }
        },
    });
}

// general function responsible for creating a bar chart from supplied
// axis and their values
function createChart(ctx, chartType, labels, datasets) {
    // create a new chart
    const myChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels,
            datasets
        },
        options: {
            scales: {
                yAxes: [{
                    gridLines: {
                        display:false
                    },
                    ticks: {
                        beginAtZero:true
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display:false
                    }
                }]
            }
        }
    });

    return myChart;
}

function createAggregateChart(
    chartType,
    aggregateType,
    key,
    label,
    canvasId,
    selectId,
    selectAttrId,
    bgColor) {
    let aggregateObj;
    if (aggregateType == 'topic') {
        aggregateObj = topicObj;
    } else if (aggregateType == 'group') {
        aggregateObj = groupObj;
    } else if (aggregateType == 'user') {
        aggregateObj = userObj;
    }

    const selectInput = document.getElementById(selectId);
    const selectAttrInput = document.getElementById(selectAttrId);

    const id = selectInput.value;
    const attr = selectAttrInput.value;

    // get canvas declared in document body
    const ctx = document.getElementById(canvasId).getContext('2d');

    // get chart labels as keys
    const labels = Object.keys(aggregateObj[id][attr]);

    // get chart values by iterating over keys
    const data = labels.map((label) => aggregateObj[id][attr][label][key]);

    const datasets = [{
        labels: labels,
        label: label,
        data: data,
        backgroundColor: bgColor,
        borderColor: bgColor
    }];

    return createChart(ctx, chartType, labels, datasets);
}
