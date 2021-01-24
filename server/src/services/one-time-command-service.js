const OneTimeCommand = require('../models/one-time-command-model');

module.exports = {
  sendCommand: function(commandKey) {
    return OneTimeCommand.find({commandKey}).then((oneTimeCommandObjs) => {
      if (oneTimeCommandObjs.length == 0) {
        return OneTimeCommand.create({
          commandKey,
          toSend: true,
        });
      } else {
        return oneTimeCommandObjs[0];
      }
    }).then((oneTimeCommandObj) => {
      if (oneTimeCommandObj.toSend === false) {
        oneTimeCommandObj.toSend = true;
        return oneTimeCommandObj.save();
      } else {
        return oneTimeCommandObj;
      }
    });
  },

  findAndFlipToSendCommands: function() {
    const gToSendCommands = [];
    return OneTimeCommand.find({toSend: true}).then((oneTimeCommandObjs) => {
      oneTimeCommandObjs.forEach(obj => {
        gToSendCommands.push(obj.commandKey);
      });

      return setToSendInList(oneTimeCommandObjs, 0);
    }).then(() => {
     return gToSendCommands;
   });
  },
};

function setToSendInList(list, i) {
  if (i >= list.length) {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  list[i].toSend = false;
  return list[i].save().then(() => {
    setToSendInList(list, i + 1);
  });
}
