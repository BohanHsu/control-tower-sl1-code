class PiServices {
  constructor(api) {
    this._api = api;
  }

  async getTemperatures() {
    return this._api.get('/api/ui/pi/temperatures');
  }
}

export default PiServices;
