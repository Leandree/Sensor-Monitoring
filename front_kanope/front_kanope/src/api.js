import io from "socket.io-client";
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import authentication from "@feathersjs/authentication-client";

const socket = io("http://localhost:3030/", {
  transports: ["websocket"],
});
const api = feathers();

api.configure(socketio(socket));
api.configure(
  authentication({
    storage: window.localStorage,
  })
);

const userService = api.service("/users");
const messageServie = api.service("/messages");

export default api;
