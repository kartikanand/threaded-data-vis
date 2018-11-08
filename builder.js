const chartColors = {
    0: '#eff3ff',
    1: '#bdd7e7',
    2: '#6baed6',
    3: '#3182bd',
    4: '#08519c',
};

function getColor(arr, count) {
    if (count == 0) {
        return chartColors[0];
    }

    const q25 = Quartile_25(arr);
    const q50 = Quartile_50(arr);
    const q75 = Quartile_75(arr);

    if (count <= q25) {
        return chartColors[1];
    }

    if (count <= q50) {
        return chartColors[2];
    }

    if (count <= q75) {
        return chartColors[3];
    }

    return chartColors[4];
}

function createHeatMap(
    canvasId,
    row,
    col,
    attr) {
    const rowObject = getObjectFromStr(row);
    const colObject = getObjectFromStr(col);

    // no. of xKeys --- labels as no. of data
    let xKeys = Object.keys(rowObject);

    // no. of yKeys --- no. of datasets
    let yKeys = Object.keys(colObject);

    // preprocess to get min/max countArr
    const countArr = [];
    yKeys.forEach((y) => {
        xKeys.forEach((x) => {
            // get y object for this x
            const rObj = colObject[y][row];
            const count = rObj[x][attr];

            countArr.push(count);
        });
    });

    const data = Array(xKeys.length).fill(1);
    const datasets = [];
    yKeys.forEach((y) => {
        const colors = [];
        xKeys.forEach((x) => {
            // get y object for this x
            const rObj = colObject[y][row];
            const count = rObj[x][attr];

            colors.push(getColor(countArr, count));
        });

        datasets.push({
            label: y,
            backgroundColor: colors,
            borderColor: '#000',
            borderWidth: 0.3,
            data: data,
        });
    });

    var barChartData = {
        labels: xKeys,
        datasets: datasets
    };

    const ctx = document.getElementById(canvasId).getContext('2d');
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
                            return yKeys[index];
                        }
                    }
                }]
            }
        },
    });
}

// general function responsible for creating a bar chart from supplied
// axis and their values
function createBarChart(
    canvasId,
    row,
    col,
    id,
    attr,
    bgColor) {
    let labels = [];
    let data = [];
    if (row == col) {
        // get aggregate object using row value
        const aggregateObj = getObjectFromStr(row);
        const rows = Object.keys(aggregateObj);

        for (let rowid of rows) {
            let attrCount = 0;

            let k = 'groups';
            if (row == 'groups') {
                k = 'users';
            }

            const colObj = aggregateObj[rowid][k];
            for (let col in colObj) {
                attrCount += colObj[col][attr];
            }

            if (id == 'all' || (id == rowid)) {
                labels.push(rowid);
                data.push(attrCount);
            }
        }
    } else {
        // get aggregate object using row value
        const aggregateObj = getObjectFromStr(col);

        // get chart labels as keys
        labels = Object.keys(aggregateObj[id][row]);

        // get chart values by iterating over keys
        data = labels.map((rowid) => aggregateObj[id][row][rowid][attr]);
    }

    const datasets = [{
        labels: labels,
        label: `# of ${attr}`,
        data: data,
        backgroundColor: bgColor,
        borderColor: bgColor
    }];

    // get canvas declared in document body
    const ctx = document.getElementById(canvasId).getContext('2d');
    const barChart = new Chart(ctx, {
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
}
