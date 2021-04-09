class AuthServices {
  async login(motto, showHint=false) {
    const data = {
      motto,
      showHint,
    };

    const response = await fetch('/api/ui/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      body: JSON.stringify(data),
    });
    const resp = await response.json();
    let loggedIn = false;
    if (resp && resp.data) {
      if (resp.data.token) {
        localStorage.setItem('tkn', resp.data.token);
        loggedIn = true;
      }
    }

    return loggedIn;
  };

  logout() {
    localStorage.setItem('tkn', null);
  };

}

export default AuthServices;
