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

    fixMissingEntries();
}

function fixMissingEntries() {
    const users = Object.keys(userObj);
    const topics = Object.keys(topicObj);
    const groups = Object.keys(groupObj);

    for (let topic of topics) {
        for (let groupid in groupObj) {
            const groupTopicObj = groupObj[groupid].topics;
            if (!groupTopicObj.hasOwnProperty(topic)) {
                groupTopicObj[topic] = {
                    'messages': 0,
                    'likes': 0,
                    'textchars': 0,
                    'images': 0
                };
            }
        }

        for (let userid in userObj) {
            const userTopicObj = userObj[userid].topics;
            if (!userTopicObj.hasOwnProperty(topic)) {
                userTopicObj[topic] = {
                    'messages': 0,
                    'likes': 0,
                    'textchars': 0,
                    'images': 0
                };
            }
        }
    }

    for (let group of groups) {
        for (let topicid in topicObj) {
            const topicUserObj = topicObj[topicid].groups;
            if (!topicUserObj.hasOwnProperty(group)) {
                topicUserObj[group] = {
                    'messages': 0,
                    'likes': 0,
                    'textchars': 0,
                    'images': 0
                };
            }
        }

        for (let userid in userObj) {
            const userGroupObj = userObj[userid].groups;
            if (!userGroupObj.hasOwnProperty(group)) {
                userGroupObj[group] = {
                    'messages': 0,
                    'likes': 0,
                    'textchars': 0,
                    'images': 0
                };
            }
        }
    }

    for (let user of users) {
        for (let topicid in topicObj) {
            const topicUserObj = topicObj[topicid].users;
            if (!topicUserObj.hasOwnProperty(user)) {
                topicUserObj[user] = {
                    'messages': 0,
                    'likes': 0,
                    'textchars': 0,
                    'images': 0
                };
            }
        }

        for (let groupid in groupObj) {
            const groupUserObj = groupObj[groupid].users;
            if (!groupUserObj.hasOwnProperty(user)) {
                groupUserObj[user] = {
                    'messages': 0,
                    'likes': 0,
                    'textchars': 0,
                    'images': 0
                };
            }
        }
    }
}
