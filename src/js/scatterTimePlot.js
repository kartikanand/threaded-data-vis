function isTopPost(messageId, messageJson) {
    for (let message of messageJson) {
        if (message.id == messageId) {
            if (message.parent == null) {
                return true;
            } else {
                return false;
            }
        }
    }
}

function scatterTimePlot(col, id) {
    moment().format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');

    const labels = [];
    const postdata = [];
    const topReplydata = [];
    const replydata = [];
    for (let message of messageJson) {
        const time = message.time;

        const date = moment(time).format('MMMM DD')
        const hour = parseInt(moment(time).format('hh'));
        const minutes = 60*hour + parseInt(moment(time).format('mm'));
        const isReply = message.parent != null;
        const isTopReply = isReply && isTopPost(message.parent, messageJson);

        if (id != 'all') {
            if (col == 'users' && message.user != id)
                continue;

            if (col == 'groups' && message.groupID != id)
                continue;

            if (col == 'topics' && message.topicID != id)
                continue;
        }

        labels.push(date);

        if (isTopReply) {
            topReplydata.push({
                x: date,
                y: minutes
            });
        }
        else if (isReply) {
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

    var ctx = document.getElementById('js-timescatter').getContext('2d');
    var cfg = {
        type: 'scatter',
        data: {
            labels: labels,
            datasets: [{
                label: 'Initial Post',
                data: postdata,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 0.7)'
            },{
                label: 'Top Level Replies',
                data: topReplydata,
                backgroundColor: 'rgba(255, 206, 86, 0.7)',
                borderColor: 'rgba(255, 206, 86, 0.7)'
            },{
                label: 'Replies',
                data: replydata,
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                borderColor: 'rgba(255, 99, 132, 0.7)'
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    distribution: 'series',
                    ticks: {
                        beginAtZero:true,
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
