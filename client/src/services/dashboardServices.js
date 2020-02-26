class DashboardServices {
  constructor(api) {
    this._api = api;
  }

  async loadDashboardInfo(api) {
    return this._api.get('/api/ui/dashboard');
  }

  async updateGlobalSwitch(isOn) {
    return this._api.post('/api/ui/operations/globalSwitch', {isOn});
  }

  async updateShouldPlay(shouldPlay) {
    return this._api.post('/api/ui/operations/shouldPlay', {shouldPlay});
  }
}

export default DashboardServices;
