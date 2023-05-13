import {Actions} from "./Event/Actions";
import {User} from "./User";

export type MainInfoUser = User & {
  actions: Actions
}
