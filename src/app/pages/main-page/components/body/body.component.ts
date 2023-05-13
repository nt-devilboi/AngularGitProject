import {AfterViewInit, Component, ViewChild, ViewContainerRef} from '@angular/core';
import {UserNoCompareCard} from "../../../../shared/interfaces/Staff/UserNoCompareCard";
import {CardComponent} from "../../../../shared/components/card/card.component";

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements AfterViewInit{
  @ViewChild('users', {read: ViewContainerRef}) usersContainer!: ViewContainerRef

  constructor(
  ) {}

  protected addUser(userType?: UserNoCompareCard): void {
    let userComponentRef = this.usersContainer.createComponent(CardComponent)

    userComponentRef.instance.userType = {
      id: 1,
      isCompare: false
    }

  }

  ngAfterViewInit(): void {
    console.log(this.usersContainer)
  }

}
