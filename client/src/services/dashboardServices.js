class DashboardServices {
  async loadDashboardInfo() {
    const response = await fetch('/api/ui/dashboard');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  };
}

export default DashboardServices;
