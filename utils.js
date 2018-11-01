// returns a promise to decoded json object created from uploaded file
function loadJSON (target) {
    return new Promise(function(resolve, reject) {
        if (!target || !target.files) {
            reject('invalid file');
        }

        const numFiles = target.files.length;
        if (numFiles != 1) {
            reject('invalid file');
        }

        const jsonFile = target.files[0];

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            if (reader.readyState == 2) {
                const jsonText = reader.result;

                resolve(JSON.parse(jsonText));
            } else {
                reject('file load error');
            }
        });

        reader.readAsText(jsonFile);
    });
}

// general function responsible for creating a bar chart from supplied
// axis and their values
function createBarChart(ctx, {labels, label, data}) {
    // create a new chart
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label,
                data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
            responsive: true,
        }
    });

    return myChart;
}

function createAggregateChart(aggregateObj, canvasId, selectId, selectAttrId) {
    const selectInput = document.getElementById(selectId);
    const selectAttrInput = document.getElementById(selectAttrId);

    const id = selectInput.value;
    const attr = selectAttrInput.value;

    // get canvas declared in document body
    const ctx = document.getElementById(canvasId).getContext('2d');

    const discreteData = {
        labels: Object.keys(aggregateObj[id][attr]),
        label: '# of Messages',
        data: Object.values(aggregateObj[id][attr])
    };

    return createBarChart(ctx, discreteData);
}

// schema -> {
//   topicid: {
//     groups: {
//       groupid : #total_message_count
//     },
//     users: {
//       userid : #total_message_count
//     }
//   }
// }
function updateTopicObj(topicObj, messageObj) {
    const {user, topicID, groupID} = messageObj;

    if (!topicObj.hasOwnProperty(topicID)) {
        topicObj[topicID] = {
            'users': {},
            'groups': {}
        };
    }

    const userObj = topicObj[topicID].users;
    if (!userObj.hasOwnProperty(user)) {
        userObj[user] = 1;
    } else {
        userObj[user] += 1;
    }

    const groupObj = topicObj[topicID].groups;
    if (!groupObj.hasOwnProperty(groupID)) {
        groupObj[groupID] = 1;
    } else {
        groupObj[groupID] += 1;
    }
}

// schema -> {
//   groupid: {
//     topics: {
//       topicid : #total_message_count
//     },
//     users: {
//       userid : #total_message_count
//     }
//   }
// }
function updateGroupObj(groupObj, messageObj) {
    const {user, topicID, groupID} = messageObj;

    if (!groupObj.hasOwnProperty(groupID)) {
        groupObj[groupID] = {
            'users': {},
            'topics': {}
        };
    }

    const userObj = groupObj[groupID].users;
    if (!userObj.hasOwnProperty(user)) {
        userObj[user] = 1;
    } else {
        userObj[user] += 1;
    }

    const topicObj = groupObj[groupID].topics;
    if (!topicObj.hasOwnProperty(topicID)) {
        topicObj[topicID] = 1;
    } else {
        topicObj[topicID] += 1;
    }
}

// schema -> {
//   user: {
//     topics: {
//       topicid : #total_message_count
//     },
//     groups: {
//       groupid : #total_message_count
//     }
//   }
// }
function updateUserObj(userObj, messageObj) {
    const {user, topicID, groupID} = messageObj;

    if (!userObj.hasOwnProperty(user)) {
        userObj[user] = {
            'groups': {},
            'topics': {}
        };
    }

    const groupObj = userObj[user].groups;
    if (!groupObj.hasOwnProperty(groupID)) {
        groupObj[groupID] = 1;
    } else {
        groupObj[groupID] += 1;
    }

    const topicObj = userObj[user].topics;
    if (!topicObj.hasOwnProperty(topicID)) {
        topicObj[topicID] = 1;
    } else {
        topicObj[topicID] += 1;
    }
}

// get user, group, and topic level statistics
function getAggregateStatistics(messageJson) {
    let userObj = {};
    let groupObj = {};
    let topicObj = {};

    messageJson.forEach((messageObj) => {
        updateUserObj(userObj, messageObj);
        updateGroupObj(groupObj, messageObj);
        updateTopicObj(topicObj, messageObj);
    });

    return {userObj, groupObj, topicObj};
}

function addOptionsToSelect(select, options) {
    options.forEach((option) => {
        const selectOption = document.createElement("option");
        selectOption.value = option;
        selectOption.text = option;

        select.add(selectOption, null);
    });
}
