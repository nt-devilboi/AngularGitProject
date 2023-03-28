import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {

  constructor(private _http: HttpClient) {
  }

  //TODO написать хендлер
  GetData<TGet>(url: string): Observable<TGet> {
    return this._http.get<TGet>("https://gitlab.com/api/v4/users/927908/projects");
  }
}
