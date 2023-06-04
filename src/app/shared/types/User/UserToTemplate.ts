import {EmbeddedViewRef} from "@angular/core";


export type UserToTemplate = {
  identificator: string,
  searchById: boolean,
  template: EmbeddedViewRef<any>
}
