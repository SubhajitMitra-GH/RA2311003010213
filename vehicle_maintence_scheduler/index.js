const { getDepots, getVehicles } = require("./api");
const scheduleTasks = require("./scheduler");

const run = async () => {

    try {
        const depots = await getDepots();
        const vehicles = await getVehicles();
        console.log("Depot count:", depots.length);
        for (const depot of depots) {
            const maxHours = depot.MechanicHours;

            const selected = scheduleTasks(vehicles, maxHours);

            console.log(`\nDepot ${depot.ID}`);

            console.log(`Max Hours: ${maxHours}`);

            let totalImpact = 0;
            let totalTime = 0;

            selected.forEach((task) => {
                console.log(task.TaskID, task.Duration, task.Impact);
                totalImpact += task.Impact;
                totalTime += task.Duration;
            });

            console.log("Total Time:", totalTime);
            console.log("Total Impact:", totalImpact);
        }
    } catch (err) {
        console.error(err.response?.data || err.message);
    }
};

run();