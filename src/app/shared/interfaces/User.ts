import {Actions} from "./Actions";

export type User = {
  id: string,
  username: string,
  name: string,
  avatar_url: string,
  web_url: string
}

export type UserMainData = {
  id: string,
  username: string,
  name: string,
  avatar_url: string,
  web_url: string,
  actions: Actions
}
