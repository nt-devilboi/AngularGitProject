import {Injectable} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GitlabService {


  constructor(private _apiClient: HttpClientModule) {
  }

  GetData<T>(url: string) {
    
  }
}
