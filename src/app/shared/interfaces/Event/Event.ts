import {PushData} from "./PushData";

export type Event = {
  action_name: string;
  author_username: string;
}

export type PushEvent = Event & {
  push_data: PushData;
}
