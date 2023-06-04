import {PushData} from "./PushData";

export type Event = {
  action_name: string;
  author_username: string;
}

export type PushEvent = Event & {
  project_id: number
  push_data: PushData;
}
