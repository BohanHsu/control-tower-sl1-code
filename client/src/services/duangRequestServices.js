class DuangRequestServices {
  constructor(api) {
    this._api = api;
  }

  async getDuangHistory(api) {
    return this._api.get('/api/ui/operations/duangRequestHistory');
  }

  async requestDuang() {
    return this._api.post('/api/ui/operations/requestDuang', {});
  }

  async cancelDuang(requestId) {
    return this._api.post('/api/ui/operations/cancelDuang', {requestId});
  }
}

export default DuangRequestServices;
