class DashboardServices {
  async loadDashboardInfo() {
    const response = await fetch('/api/ui/dashboard');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  async updateGlobalSwitch(isOn) {
    const data = {
      isOn
    };

    const response = await fetch('/api/ui/operations/globalSwitch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      body: JSON.stringify(data),
    });
    return await response.json();
  }
}

export default DashboardServices;
