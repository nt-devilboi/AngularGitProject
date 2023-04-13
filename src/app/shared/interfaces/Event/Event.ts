import {PushData} from "./PushData";

export type Event = {
  action_name: string;
  author_username: string;
  push_data: PushData;
}
