const Agenda = require("agenda");

const mongoConnectionString = "mongodb://localhost:27017/ProductStore";

const agenda = new Agenda({
    db: {
        address: mongoConnectionString,
        collection: 'agendaJobs'
    },
    defaultConcurrency: 3,
    maxConcurrency: 100,
    defaultLockLifetime: 20 * 60000
});

agenda.define(
    "send email report",
    { priority: "high", concurrency: 10 },
    async (job, done) => {
        const { to } = job.attrs.data;
        console.log({ to })
        done();
    }
);

(async function () {
    const report = agenda.create("send email report", {
        to: "example@example.com",
    })
    await agenda.start();
    // await agenda.every("*/1 * * * *", "send email report", {
    //     to: "example@example.com",
    // });
    report.repeatEvery("1 minute").save();
})();