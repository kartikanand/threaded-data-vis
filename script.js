'use strict';

window.onload = () => {
    resetEverything();

    fetch('example1.json').then((response) => {
        return response.json();
    }).then((jsonObj) => {
        getAggregateStatistics(jsonObj);
        createHeatMap();
    });
};
