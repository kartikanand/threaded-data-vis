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
        const borderColors = [];
        xKeys.forEach((x) => {
            // get y object for this x
            const rObj = colObject[y][row];
            const count = rObj[x][attr];

            colors.push(getColor(countArr, count));
            borderColors.push(getColor(countArr, count));
        });

        datasets.push({
            label: y,
            backgroundColor: colors,
            borderColor: borderColors,
            //borderWidth: 0.3,
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
                        display: false,
                        offsetGridLines: false
                    }
                }],
                yAxes: [{
                    stacked: true,
                    barPercentage: 1.0,
                    categoryPercentage: 1.0,
                    gridLines: {
                        display: false,
                        offsetGridLines: false
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
    const colObj = getObjectFromStr(col);
    // get aggregate object using row value
    const cols = Object.keys(colObj);

    // column count to calculate the average
    const colCount = cols.length;

    const rowObj = getObjectFromStr(row);
    // get aggregate object using row value
    const rows = Object.keys(rowObj);

    let avgData = [];
    for (let rowid of rows) {
        let attrCount = 0;

        let k = 'groups';
        if (row == 'groups') {
            k = 'users';
        }

        const localColObj = rowObj[rowid][k];
        for (let col in localColObj) {
            attrCount += localColObj[col][attr];
        }

        avgData.push(attrCount/colCount);
    }

    let labels = [];
    let attrData = [];
    for (let rowid of rows) {
        let attrCount = 0;

        let k = 'groups';
        if (row == 'groups') {
            k = 'users';
        }

        const localColObj = rowObj[rowid][k];
        for (let col in localColObj) {
            attrCount += localColObj[col][attr];
        }

        if (id == 'all' || (id == rowid)) {
            labels.push(rowid);
            attrData.push(attrCount);
        }
    }

    let data = [];
    if (row == col) {
        data = attrData;
    } else {
        labels = [];

        // get chart labels as keys
        // get chart values by iterating over keys
        data = rows.map((rowid) => {
            labels.push(rowid);
            return colObj[id][row][rowid][attr]
        });
    }

    const datasets = [{
        labels: labels,
        label: `# of ${attr}`,
        data: data,
        backgroundColor: bgColor,
        borderColor: bgColor
    }];

    if (row != col) {
        datasets.push({
            labels: labels,
            label: `Average`,
            data: avgData,
            type: 'line'
        });
    }

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
