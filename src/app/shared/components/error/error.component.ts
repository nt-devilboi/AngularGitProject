import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ErrorService} from "../../services/error.service";
import {DestroyService} from "../../services/destroy.service";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  providers: [DestroyService],
  styleUrls: ['./error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorComponent implements OnInit {

  protected error: string = ''
  protected visible: boolean = false

  constructor(
    private _error: ErrorService,
    private _destroy: DestroyService,
    private _cd: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this._error.error$
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(error => {
        this.error = error
        this.visible = true
        this._cd.detectChanges()
        setTimeout(() => {
          this.visible = false
          this._cd.detectChanges()
        }, 3000)
      })

    // setTimeout(() => {
    //   this.error = 'Ошибка'
    //   this.visible = true
    // }, 300)
    //
    // setTimeout(() => {
    //   this.visible = false
    // }, 1500)
  }

}
