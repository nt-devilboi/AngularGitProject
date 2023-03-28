import {Injectable} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GitlabService {


  constructor(private _apiClient: HttpClientModule) {
  }

  GetData<TGet>(url: string): Observable<TGet> {

  }
}
