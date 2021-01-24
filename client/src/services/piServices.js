class PiServices {
  constructor(api) {
    this._api = api;
  }

  async getTemperatures() {
    return this._api.get('/api/ui/pi/temperatures');
  }

  async shutdownPi() {
    return this._api.post('/api/ui/pi/runcommand', {commandKey: "shutdownPi"});
  }
}

export default PiServices;
