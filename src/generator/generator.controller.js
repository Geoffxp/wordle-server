const words = require("../../words.js");
const goodWords = require("../../goodWords.js");
const service = require("./generator.service.js")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary.js")

const get = async (req, res) => {
    let lastUpdate = await service.getTime();
    let current = await service.getCurrent();
    if (!lastUpdate.time) {
        service.setTime({time: new Date()});
        service.setCurrent({current: 0});
        lastUpdate = await service.getTime();
        current = await service.getCurrent();
    }
    const currentTime = new Date();
    const lastTime = new Date(lastUpdate.time);
    let diff = ((currentTime / 1000) - (lastTime / 1000)) / 3600;
    if (diff > 6) {
        service.setTime({
            time_id: 1,
            time: currentTime.toISOString()
        });
        current.current++;
        service.setCurrent({
            current_id: 1,
            current: current.current
        });
        lastUpdate = await service.getTime();
        current = await service.getCurrent();
        diff = 0;
    }
    return res.status(200).json({
        data: {
            word: goodWords[current.current],
            list: words,
            current: current.current,
            timeToUpdate: diff,
            lastTime: lastTime
        }
    });
}
const getList = (req, res) => {
    return res.status(200).json({data: words});
}

module.exports = {
    get: [asyncErrorBoundary(get)],
    getList
}