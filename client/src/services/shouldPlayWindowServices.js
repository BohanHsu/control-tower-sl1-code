class ShouldPlayWindowServices {
  constructor(api) {
    this._api = api;
  }

  async updateUseShouldPlayWindow(shouldUseShouldPlayWindow) {
    return this._api.post('/api/ui/operations/shouldPlayWindow/flip', {
      shouldUseShouldPlayWindow,
    });
  }

  async addShouldPlayWindow(startHour, startMinute, startSecond, endHour, endMinute, endSecond) {
    return this._api.post('/api/ui/operations/shouldPlayWindow/add', {
      startHour,
      startMinute,
      startSecond,
      endHour,
      endMinute,
      endSecond,
    });
  }

  async removeShouldPlayWindow(shouldPlayWindowId) {
    return this._api.post('/api/ui/operations/shouldPlayWindow/remove', {
      shouldPlayWindowId,
    });
  }

  async getAllShouldPlayWindow() {
    return this._api.get('/api/ui/operations/shouldPlayWindow/');
  }
}

export default ShouldPlayWindowServices;
