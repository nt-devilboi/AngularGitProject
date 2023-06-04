import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {IGitApi} from "../../app.module";
import {GitLabService} from "../../shared/services/git-lab.service";
import {CompareResult} from "../../shared/types/CompareResult";
import {take} from "rxjs";
import {DestroyService} from "../../shared/services/destroy.service";
import {transition, trigger, useAnimation} from "@angular/animations";
import {opacity} from "../../shared/animations/opacity";

@Component({
  selector: 'app-compare-page',
  templateUrl: './compare-page.component.html',
  styleUrls: ['./compare-page.component.scss'],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('enter', [
      transition(':enter',
        useAnimation(opacity), {
          params: {
            oStart: 0,
            oEnd: 1,
          }
        })
    ]),
    trigger('leave', [
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
export class ComparePageComponent implements OnInit{

  protected compareResult!: CompareResult
  protected isError: boolean = false

  constructor(
    @Inject(IGitApi) private _userData: GitLabService,
    private _destroy: DestroyService,
    private _cd: ChangeDetectorRef
  ) {
  }

  public ngOnInit(): void {
    this._userData.getCompareResult()
      .pipe(
        take(1),
        this._destroy.takeUntilDestroy
      )
      .subscribe({
        next: (result) => {
          this.compareResult = result
          this._cd.markForCheck()
        },
        error: () => {
          this.isError = true
          this._cd.markForCheck()
        }
      })
  }

}
