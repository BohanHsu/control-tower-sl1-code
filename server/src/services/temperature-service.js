const Temperature = require('../models/temperature-model');

const G_LEVEL0_NUMBER_OF_RECORD = 1200;
const G_LEVEL0_BUMP_MODULER = 1200;

const G_LEVEL1_NUMBER_OF_RECORD = 72;
const G_LEVEL1_BUMP_MODULER = 24;

const G_LEVEL2_NUMBER_OF_RECORD = 30;
const G_LEVEL2_BUMP_MODULER = 30;

// Debug settings
// const G_LEVEL0_NUMBER_OF_RECORD = 2;
// const G_LEVEL0_BUMP_MODULER = 2;
// 
// const G_LEVEL1_NUMBER_OF_RECORD = 4;
// const G_LEVEL1_BUMP_MODULER = 2;
// 
// const G_LEVEL2_NUMBER_OF_RECORD = 3;
// const G_LEVEL2_BUMP_MODULER = 10;

module.exports = {
  recordTemperature: function(temperatureString) {
    if (temperatureString.length == 0) {
      return;
    }

    const floatTemperature = parseFloat(temperatureString)

    if (floatTemperature.toString() !== temperatureString) {
      return;
    }
    
    const currentTime = new Date();

    let gLevel0ShouldBump = false;
    let gLevel0AvgTemperature = 0;

    let gLevel1ShouldBump = false;
    let gLevel1AvgTemperature = 0;

    return cleanQueueAndCalculateNextCursorAndShouldBump(0, G_LEVEL0_NUMBER_OF_RECORD, G_LEVEL0_BUMP_MODULER).then((level0NextCursorAndShouldBump) => {
      const level0NextCursor = level0NextCursorAndShouldBump.nextCursor;
      const level0ShouldBump = level0NextCursorAndShouldBump.shouldBump;

      gLevel0ShouldBump = level0ShouldBump;
      gLevel0AvgTemperature = level0NextCursorAndShouldBump.avgTemperature;

      const level0TemperatureRecord = {
        recordTime: currentTime,
        temperature: floatTemperature,
        aggregatedLevel: 0,
        cursor: level0NextCursor,
      };

      // console.log("debug ", JSON.stringify(level0TemperatureRecord), 0);

      return Temperature.create(level0TemperatureRecord);
    }).then(() => {
      if (gLevel0ShouldBump) {
        return cleanQueueAndCalculateNextCursorAndShouldBump(1, G_LEVEL1_NUMBER_OF_RECORD, G_LEVEL1_BUMP_MODULER).then((level1NextCursorAndShouldBump) => {
          const level1NextCursor = level1NextCursorAndShouldBump.nextCursor;
          const level1ShouldBump = level1NextCursorAndShouldBump.shouldBump;

          gLevel1ShouldBump = level1ShouldBump;
          gLevel1AvgTemperature = level1NextCursorAndShouldBump.avgTemperature;

          const level1TemperatureRecord = {
            recordTime: currentTime,
            temperature: gLevel0AvgTemperature,
            aggregatedLevel: 1,
            cursor: level1NextCursor,
          };

          // console.log("debug     ", JSON.stringify(level1TemperatureRecord), 1);

          return Temperature.create(level1TemperatureRecord);
        });
      }

      return null;
    }).then(() => {
      if (gLevel1ShouldBump) {
        return cleanQueueAndCalculateNextCursorAndShouldBump(2, G_LEVEL2_NUMBER_OF_RECORD, G_LEVEL2_BUMP_MODULER).then((level2NextCursorAndShouldBump) => {
          const level2NextCursor = level2NextCursorAndShouldBump.nextCursor;

          const level2TemperatureRecord = {
            recordTime: currentTime,
            temperature: gLevel1AvgTemperature,
            aggregatedLevel: 2,
            cursor: level2NextCursor,
          };
          
          // console.log("debug         ", JSON.stringify(level2TemperatureRecord), 2);
          
          return Temperature.create(level2TemperatureRecord);
        })
      }
      
      return null;
    });
  },

  getTemperature: function() {
    return Temperature.find({}).sort({recordTime: 1}).then((temperatureObjs) => {

      const level0 = [];
      let level0Idx = 0;
      const level1 = [];
      const level2 = [];

      temperatureObjs.forEach((obj) => {
        if (obj.aggregatedLevel === 0) {
          if (level0Idx % 20 === 0) {
            level0.push(obj.temperature)
          }
          level0Idx += 1;
        } else if (obj.aggregatedLevel === 1) {
            level1.push(obj.temperature)
        } else if (obj.aggregatedLevel === 2) {
            level2.push(obj.temperature)
        }
      })
      return {
        level0,
        level1,
        level2,
      };
    });
  },
};

function cleanQueueAndCalculateNextCursorAndShouldBump(aggregatedLevel, numberOfRecordToKeep, bumpModuler) {
  let gNextCurosr = 1;
  let gShouldBump = false;
  let gAvgTemperature = 0;

  return Temperature.find({aggregatedLevel: aggregatedLevel}).sort({recordTime: 1}).exec().then((temperatureObjs) => {
    if (temperatureObjs.length > 0) {
      const currentCursor = temperatureObjs[temperatureObjs.length - 1].cursor;
      if (currentCursor) {
        const nextCursor = (currentCursor + 1) > numberOfRecordToKeep ? 1 : (currentCursor + 1);
        gNextCurosr = nextCursor;
      }
      gShouldBump = (currentCursor % bumpModuler === 0);
    }

    if (gShouldBump) {
      let temperatureSum = 0;
      temperatureObjs.forEach((obj) => {
        temperatureSum += obj.temperature;
      });

      gAvgTemperature = temperatureSum * 1.0 / temperatureObjs.length;
      gAvgTemperature = Math.round(gAvgTemperature * 10) / 10;
    }
    
    if (temperatureObjs.length === numberOfRecordToKeep) {
      return Temperature.findByIdAndDelete(temperatureObjs[0]._id).then(() => {
        return {
          nextCursor: gNextCurosr,
          shouldBump: gShouldBump,
          avgTemperature: gAvgTemperature,
        };
      });
    }

    return {
      nextCursor: gNextCurosr,
      shouldBump: gShouldBump,
      avgTemperature: gAvgTemperature,
    };
  });
}
