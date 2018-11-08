function scatterTimePlot(messageJson) {
    moment().format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');

    const labels = [];
    const postdata = [];
    const replydata = [];
    for (let message of messageJson) {
        const time = message.time;

        const date = moment(time).format('MMMM DD')
        const hour = parseInt(moment(time).format('hh'));
        const minutes = 60*hour + parseInt(moment(time).format('mm'));
        const isReply = message.parent != null;

        labels.push(date);

        if (isReply) {
            replydata.push({
                x: date,
                y: minutes
            });
        } else {
            postdata.push({
                x: date,
                y: minutes
            });
        }
    }

    var ctx = document.getElementById('chart1').getContext('2d');
    var cfg = {
        type: 'scatter',
        data: {
            labels: labels,
            datasets: [{
                label: 'Initial Post',
                data: postdata,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 0.5)'
            },{
                label: 'Replies',
                data: replydata,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 0.5)'
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    distribution: 'series',
                    ticks: {
                        source: 'labels'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Time of message'
                    },
                    ticks: {
                        beginAtZero:true,
                        stepSize: 60,
                    }
                }]
            }
        }
    };

    var chart = new Chart(ctx, cfg);
}
