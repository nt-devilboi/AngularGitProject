import {Actions} from "./Actions";

export type User = {
  id: string,
  username: string,
  name: string,
  avatar_url: string,
  web_url: string
}

export type UserMainData = User & {
  actions: Actions
}

export type UserAllData = UserMainData & {

}
