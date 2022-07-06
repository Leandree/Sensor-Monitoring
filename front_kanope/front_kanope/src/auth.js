import api from "src/api";

const auth = {
  user: null,

  getUser() {
    return this.user;
  },

  reaAuthenticate() {
    return api.reAuthenticate().then((response) => {
      this.user = response.user;
    });
  },

  fetchUser(accessToken) {
    return api
      .reAuthenticate()
      .then((payload) => {
        return api.service("users").get(payload.userId);
      })
      .then((user) => {
        return Promise.resolve(user);
      });
  },

  authenticate() {
    return api
      .authenticate()
      .then((response) => {
        this.user = response.user;
        return Promise.resolve(this.user);
      })
      .catch((err) => {
        this.user = null;
        return Promise.reject(err);
      });
  },

  authenticated() {
    return this.user != null;
  },

  signout() {
    return api
      .logout()
      .then(() => {
        this.user = null;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  onLogout(callback) {
    api.on("logout", () => {
      this.user = null;
      callback();
    });
  },

  onAuthenticated(callback) {
    api.on("authenticated", (response) => {
      this.user = response.user;
      callback(this.user);
    });
  },

  register(email, password) {
    return api.service("users").create({
      email: email,
      password: password,
    });
  },

  login(email, password) {
    return api.authenticate({
      strategy: "local",
      email: email,
      password: password,
    });
  },
};

export default auth;
