const generateHabitsTable = require('./src/habitsTrackerGenerator');
const config = require('./habits.config.json');


async function main(config) {
    return generateHabitsTable(config);
}


main(config)
    .then()
