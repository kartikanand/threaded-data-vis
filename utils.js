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

function createAggregateChart(aggregateObj, key, label, canvasId, selectId, selectAttrId) {
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

    const discreteData = {
        labels: labels,
        label: label,
        data: data
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
    // extract details from the message object
    const {user, topicID, groupID, info} = messageObj;
    const {textchars, images} = info;

    // for some reason json allows likes to be null/false instead of 0
    // so we make it zero
    let likes = messageObj.likes;
    if (!likes) {
        likes = 0;
    }

    if (!topicObj.hasOwnProperty(topicID)) {
        topicObj[topicID] = {
            'users': {},
            'groups': {}
        };
    }

    const userObj = topicObj[topicID].users;
    if (!userObj.hasOwnProperty(user)) {
        userObj[user] = {
            'messages': 1,
            'likes': likes,
            'textchars': textchars,
            'images': images
        };
    } else {
        userObj[user].messages += 1;
        userObj[user].likes += likes;
        userObj[user].textchars += textchars;
        userObj[user].images += images;
    }

    const groupObj = topicObj[topicID].groups;
    if (!groupObj.hasOwnProperty(groupID)) {
        groupObj[groupID] = {
            'messages': 1,
            'likes': likes,
            'textchars': textchars,
            'images': images
        };
    } else {
        groupObj[groupID].messages += 1;
        groupObj[groupID].likes += likes;
        groupObj[groupID].textchars += textchars;
        groupObj[groupID].images += images;
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
    // extract details from the message object
    const {user, topicID, groupID, info} = messageObj;
    const {textchars, images} = info;

    // for some reason json allows likes to be null/false instead of 0
    // so we make it zero
    let likes = messageObj.likes;
    if (!likes) {
        likes = 0;
    }


    if (!groupObj.hasOwnProperty(groupID)) {
        groupObj[groupID] = {
            'users': {},
            'topics': {}
        };
    }

    const userObj = groupObj[groupID].users;
    if (!userObj.hasOwnProperty(user)) {
        userObj[user] = {
            'messages': 1,
            'likes': likes,
            'textchars': textchars,
            'images': images
        };
    } else {
        userObj[user].messages += 1;
        userObj[user].likes += likes;
        userObj[user].textchars += textchars;
        userObj[user].images += images;
    }

    const topicObj = groupObj[groupID].topics;
    if (!topicObj.hasOwnProperty(topicID)) {
        topicObj[topicID] = {
            'messages': 1,
            'likes': likes,
            'textchars': textchars,
            'images': images
        };
    } else {
        topicObj[topicID].messages += 1;
        topicObj[topicID].likes += likes;
        topicObj[topicID].textchars += textchars;
        topicObj[topicID].images += images;
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
    // extract details from the message object
    const {user, topicID, groupID, info} = messageObj;
    const {textchars, images} = info;

    // for some reason json allows likes to be null/false instead of 0
    // so we make it zero
    let likes = messageObj.likes;
    if (!likes) {
        likes = 0;
    }


    if (!userObj.hasOwnProperty(user)) {
        userObj[user] = {
            'groups': {},
            'topics': {}
        };
    }

    const groupObj = userObj[user].groups;
    if (!groupObj.hasOwnProperty(groupID)) {
        groupObj[groupID] = {
            'messages': 1,
            'likes': likes,
            'textchars': textchars,
            'images': images
        };
    } else {
        groupObj[groupID].messages += 1;
        groupObj[groupID].likes += likes;
        groupObj[groupID].textchars += textchars;
        groupObj[groupID].images += images;
    }

    const topicObj = userObj[user].topics;
    if (!topicObj.hasOwnProperty(topicID)) {
        topicObj[topicID] = {
            'messages': 1,
            'likes': likes,
            'textchars': textchars,
            'images': images
        };
    } else {
        topicObj[topicID].messages += 1;
        topicObj[topicID].likes += likes;
        topicObj[topicID].textchars += textchars;
        topicObj[topicID].images += images;
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
