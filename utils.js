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

// ydata should be of the below form
// {
//      label: '',
//      data: []
// }
function createBubbleChart(ctx, data) {
    const myBubbleChart = new Chart(ctx, {
        type: 'bubble',
        labels: ['asd','asd1','zxc','zxc1'],
        data: {
            datasets: [{
                data,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1
            }]
        }
    });

    return myBubbleChart;
}

function createTopicGroupBubbleChart(topicObj, groupObj, canvasId) {
    // get canvas declared in document body
    const ctx = document.getElementById(canvasId).getContext('2d');

    // data array
    const data = [];

    const groups = Object.keys(groupObj);
    const topics = Object.keys(topicObj);

    topics.forEach((topic, topicIndx) => {
        groups.forEach((group, groupIndx) => {
            // get group object for this topic
            const groupObj = topicObj[topic].groups;
            const messageCount = groupObj[group].messages;

            data.push({
                x: topicIndx,
                y: groupIndx,
                r: messageCount
            });
        });
    });

    return createBubbleChart(ctx, data);
}

// general function responsible for creating a bar chart from supplied
// axis and their values
function createBarChart(ctx, {labels, label, data}, bgColor) {
    // create a new chart
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label,
                data,
                backgroundColor: bgColor,
                borderColor: bgColor
            }]
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

    // get canvas declared in document body
    const ctx = document.getElementById(canvasId).getContext('2d');

    let labels;
    // get chart labels as keys
    try {
        labels = Object.keys(aggregateObj[id][attr]);
    } catch(e) {
        console.log(e);
        console.log(aggregateObj);
        console.log(id);
        console.log(attr);
    }

    // get chart values by iterating over keys
    const data = labels.map((label) => aggregateObj[id][attr][label][key]);

    const discreteData = {
        labels: labels,
        label: label,
        data: data
    };

    return createBarChart(ctx, discreteData, bgColor);
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
function updateTopicObj(messageObj) {
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
function updateGroupObj(messageObj) {
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
function updateUserObj(messageObj) {
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
    messageJson.forEach((messageObj) => {
        updateUserObj(messageObj);
        updateGroupObj(messageObj);
        updateTopicObj(messageObj);
    });
}

function addOptionsToSelect(select, options) {
    options.forEach((option) => {
        const selectOption = document.createElement("option");
        selectOption.value = option;
        selectOption.text = option;

        select.add(selectOption, null);
    });
}
