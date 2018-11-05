// ydata should be of the below form
// {
//      label: '',
//      data: []
// }
function createBubbleChart(canvasId, aggregateType, xSelect, ySelect) {
    // get canvas declared in document body
    const ctx = document.getElementById(canvasId).getContext('2d');

    let aggregateObj = null;
    let xKeys = [];
    let yKeys = [];

    if (aggregateType == 'topic') {
        aggregateObj = topicObj;
        xKeys = Object.keys(topicObj);
    } else if (aggregateType == 'group') {
        aggregateObj = groupObj;
        xKeys = Object.keys(groupObj);
    } else if (aggregateType == 'user') {
        aggregateObj = userObj;
        xKeys = Object.keys(userObj);
    }

    if (xSelect == 'users') {
        yKeys = Object.keys(userObj);
    } else if (xSelect == 'groups') {
        yKeys = Object.keys(groupObj);
    } else if (xSelect == 'topics') {
        yKeys = Object.keys(topicObj)
    }

    // data array
    const data = [];

    xKeys.forEach((x, xIndx) => {
        yKeys.forEach((y, yIndx) => {
            // get y object for this x
            const yObj = aggregateObj[x][xSelect];
            const yCount = yObj[y][ySelect];

            data.push({
                x: xIndx + 1,
                y: yIndx + 1,
                value: yCount
            });
        });
    });

    const myBubbleChart = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: [{
                data,
                label: 'No. of messages',
                backgroundColor: 'rgba(0, 0, 0)',
                borderColor: 'rgba(0, 0, 0)',
                borderWidth: 0
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    gridLines: {
                        display:false
                    },
                    ticks: {
                        beginAtZero:true,
                        stepSize: 1,
                        max: yKeys.length + 1,
                        callback: (value, index, values) => {
                            if (index == 0 || index == yKeys.length + 1) {
                                return '';
                            } else {
                                return yKeys[index - 1];
                            }
                        }
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display:false
                    },
                    ticks: {
                        beginAtZero:true,
                        stepSize: 1,
                        max: xKeys.length + 1,
                        callback: (value, index, values) => {
                            if (index == 0 || index == xKeys.length + 1) {
                                return '';
                            } else {
                                return xKeys[index - 1];
                            }
                        }
                    },
                }]
            },
            elements: {
                point: {
                    radius: function(context) {
                        var index = context.dataIndex;
                        var data = context.dataset.data[index];
                        var size = context.chart.width;
                        var base = data.value / 500;
                        console.log((size / 24) * base);
                        return (size / 24) * base;
                    }
                }
            }
        }
    });

    return myBubbleChart;
}

// general function responsible for creating a bar chart from supplied
// axis and their values
function createBarChart(ctx, labels, datasets) {
    // create a new chart
    const myChart = new Chart(ctx, {
        type: 'bar',
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

    if (id == 'all') {
        return createBubbleChart('js-topic-heatmap', aggregateType, attr, 'messages');
    }

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

    return createBarChart(ctx, labels, datasets);
}
