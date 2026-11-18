import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { NotesHeaderAnimations } from './notes-header.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notes-header',
  templateUrl: './notes-header.component.html',
  styleUrls: ['./notes-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: NotesHeaderAnimations,
  standalone: true,
  imports: [
  ],
})
export class NotesHeaderComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** Goal hashtag category */
  hashtag: string = "#apply-internships";

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------

  closeHeader() {
    this.snackbar.open(
      'Clicked on X Icon',
      '',
      {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      },
    );
  };

  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
    private snackbar: MatSnackBar,
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit(): void {
  }
}
