import {Actions} from "./Event/Actions";

export type MainInfoUser = {
  id: string,
  username: string,
  name: string,
  avatar_url: string,
  web_url: string,
  actions: Actions
}
