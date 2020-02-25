class Api {
  constructor(authCallback) {
    this._authCallback = authCallback;
  }

  async get(url) {
    const headers = this._generateHeaders();

    const response = await fetch(url, {
      headers,
    });

    const responseJson = await response.json();
    if (!this._handleUnauthorized(response, responseJson)) {
      return;
    }

    return responseJson;
  }

  async post(url, data) {
    let headers = this._generateHeaders();
    headers = {
      ...headers,
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      redirect: 'follow',
      body: JSON.stringify(data),
    });

    const responseJson = await response.json();
    if (!this._handleUnauthorized(response, responseJson)) {
      return;
    }

    return responseJson;
  }

  _generateHeaders() {
    const token = localStorage.getItem('tkn');
    return {
      token,
    };
  }

  _handleUnauthorized(response, responseJson) {
    let isAuthorized = false;
    if (response.status === 403) {
      localStorage.setItem('tkn', null);
    } else {
      localStorage.setItem('tkn', responseJson.token);
      isAuthorized = true;
    }

    if (!isAuthorized && this._authCallback) {
      this._authCallback();
    }

    return isAuthorized;
  }
}

export default Api;
