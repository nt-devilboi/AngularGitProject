import {Injectable, OnDestroy} from "@angular/core";
import {Observable, Subject, takeUntil} from "rxjs";

@Injectable()
export class DestroyService implements OnDestroy {
  private readonly _destroy$: Subject<void> = new Subject<void>()
  public readonly takeUntilDestroy = <T>(
    origin: Observable<T>
  ): Observable<T> => origin.pipe(takeUntil(this._destroy$))

  public ngOnDestroy(): void {
    this._destroy$.next()
    this._destroy$.complete()
  }
}
