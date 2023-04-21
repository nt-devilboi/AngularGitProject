import {Observable} from "rxjs";
import {HttpParams, HttpResponse} from "@angular/common/http";
import {HttpRequestService} from "./http-request.service";

export type Params = { [id: string]: string; };

export abstract class ApiAdapter {
  constructor(private _http: HttpRequestService) {
  }

  // Todo ваще его можно сделать универасльным, - вместо action page per_page он будет брать словарь и идти фором
  protected RequestWithParams<T>(url: string, parameters: Params): Observable<HttpResponse<T>> {
    let params = this.SetAllParameter(parameters);
    return this._http.getData<T>(`${url}`, params)
  }

  private SetAllParameter(parameters: Params) {
    let params: HttpParams = new HttpParams()
    for (let key in parameters) {
      console.log(key + ": " + parameters[key])
      params = params.append(key, parameters[key]) // TOdo ваще хз за этот append set, set не работает a append, ток так работает
    }

    return params;
  }
}
