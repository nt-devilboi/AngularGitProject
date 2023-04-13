import {User} from "./User";
import {MainInfoUser} from "./MainInfoUser";

export interface IGitUser {
  GetUserByName() : User
  GetMainInfoUser(): MainInfoUser;
  GetDetailsUser(): any
}
