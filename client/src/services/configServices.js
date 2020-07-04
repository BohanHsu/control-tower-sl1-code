class ConfigServices {
  constructor(api) {
    this._api = api;
  }

  async getConfig(api) {
    return this._api.get('/api/ui/config/config');
  }

  async updateConfig(configJsonString) {
    return this._api.post('/api/ui/config/updateConfig', {
      humanOverrideConfig: configJsonString
    });
  }

  async setPinConfigHistoryValue(configHistoryId, pinned) {
    return this._api.post('/api/ui/config/updateConfigHistory', {
      configHistoryId,
      pinned,
    });
  }

  async updateConfigHistoryDescription(configHistoryId, description) {
    return this._api.post('/api/ui/config/updateConfigHistory', {
      configHistoryId,
      description,
    });
  }
}

export default ConfigServices;
