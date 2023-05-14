import {
  Component,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {UserStorageService} from "../../../../shared/Services/user-storage.service";
import {DestroyService} from "../../../../shared/Services/destroy.service";

@Component({
  selector: 'app-body',
  providers: [
    DestroyService
  ],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {
  @ViewChild('users', {read: ViewContainerRef}) usersContainer!: ViewContainerRef
  @ViewChild('user', {read: TemplateRef}) userTemplate!: TemplateRef<any>

  constructor(
    private _userStorage: UserStorageService,
    private _destroy: DestroyService,
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit')
    this._userStorage.nextUser$
      .pipe(this._destroy.TakeUntilDestroy)
      .subscribe(user => {
        this.usersContainer.createEmbeddedView(this.userTemplate, {user}, {index: 0})
      })
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit')
    for (let i = 0; i < 1; i++) {
      this.usersContainer.createEmbeddedView(this.userTemplate, {
        user: {
          id: 927908,
          isCompare: false
        }
      }, {index: 0})
    }
  }
}
