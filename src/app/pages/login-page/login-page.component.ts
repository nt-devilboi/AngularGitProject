import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {TokenService} from "../../shared/services/token.service";
import {take} from "rxjs";
import {transition, trigger, useAnimation} from "@angular/animations";
import {opacity} from "../../shared/animations/opacity";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  animations: [
    trigger('appear', [
      transition(':enter',
        useAnimation(opacity), {
          params: {
            oStart: 0,
            oEnd: 1,
          }
        }),
      transition(':leave',
        useAnimation(opacity), {
          params: {
            oStart: 1,
            oEnd: 0,
          }
        })
    ])
  ]
})
export class LoginPageComponent implements OnInit{
  protected _loginForm!: FormGroup

  constructor(
    private _router: Router,
    private _token: TokenService,
  ) {
    this.createForm()
  }

  private createForm() {
    this._loginForm = new FormGroup({
      token: new FormControl('', [Validators.required])
    })
  }

  protected submit() {
    localStorage.setItem('token', this._loginForm.get('token')?.value)
    this._router.navigate([''])
  }

  public ngOnInit(): void {
    this._token.isValidToken()
      .pipe(take(1))
      .subscribe(isValid => {
      if (isValid)
        this._router.navigate([''])
    })
  }
}
