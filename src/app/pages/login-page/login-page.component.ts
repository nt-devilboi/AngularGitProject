import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {TokenService} from "../../shared/services/token.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit{
  protected _loginForm!: FormGroup

  constructor(
    private _router: Router,
    private _token: TokenService
  ) {
    this.createForm()
  }

  private createForm() {
    this._loginForm = new FormGroup({
      token: new FormControl('', [Validators.required])
    })
  }

  submit() {
    localStorage.setItem('token', this._loginForm.get('token')?.value)
    this._router.navigate([''])
  }

  ngOnInit(): void {
    let sub = this._token.isValidToken().subscribe(isValid => {
      if (isValid)
        this._router.navigate([''])

      sub.unsubscribe()
    })
  }
}
