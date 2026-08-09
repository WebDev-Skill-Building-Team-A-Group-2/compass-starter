import { inject, Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, Signal } from '@angular/core';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { MatMenuTrigger, MatMenu } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatMenuTrigger, MatMenu, MatIconModule],
})
export class NavbarComponent implements OnInit {
  readonly authStore = inject(AuthStore);

  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------

  /** Logout. */
  logout() {
    this.authStore.logout();
  }

  // --------------- OTHER -------------------------------

  constructor() {
  }

  ngOnInit(): void {
  }
}
