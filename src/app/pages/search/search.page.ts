import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonSearchbar, ModalController, ToastController} from '@ionic/angular';
import {FriendsService} from '../../utils/services/friends.service';
import {Router} from '@angular/router';
import {Subject, Subscription} from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {ChatService} from '../../utils/services/chat.service';
import {Searchable} from '../../utils/interfaces/searchable';

@Component({
  selector: 'search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit, OnDestroy {

  @Input() isChat = false;

  users: Searchable[];
  query;
  queryLength = undefined;

  // Observable for debouncing input changes
  private searchDebouncerSubject: Subject<string> = new Subject();
  private searchDebouncerSub: Subscription;
  // @ts-ignore
  @ViewChild(IonSearchbar) searchBar: IonSearchbar;

  constructor(private modalCtrl: ModalController,
              private friendService: FriendsService,
              private router: Router,
              private toastCtrl: ToastController,
              private chatService: ChatService) { }

  ngOnInit() {
    this.setupSearchDebouncer();
    if (this.isChat) {
      this.friendService.getMyFriends()
        .then(res => (res.length > 0) ? this.users = res : undefined);
    }
  }

  ngOnDestroy() {
    this.searchDebouncerSub.unsubscribe();
  }

  async closeSearchPage() {
    await this.modalCtrl.dismiss();
  }

  handleSearch() {
    // console.log(this.query);
    this.friendService.searchUsers(this.query).then(res => {
      this.users = res;
      // console.log(this.users);
    });
  }

  goToUserProfile(id) {
    this.closeSearchPage()
      .then(() => this.router.navigate(['/app/profile', id]));
  }

  public onSearchInputChange(term: string): void {
    // `onSearchInputChange` is called whenever the input is changed.
    // We have to send the value to debouncing observable
    this.searchDebouncerSubject.next(term);
  }

  private setupSearchDebouncer(): void {
    // Subscribe to `searchDebouncerSubject` values,
    // but pipe through `debounceTime` and `distinctUntilChanged`
    this.searchDebouncerSub = this.searchDebouncerSubject.pipe(
      debounceTime(250),
      distinctUntilChanged(),
    ).subscribe((term: string) => {
      this.friendService.searchUsers(term).then(res => {
        this.users = res;
        this.queryLength = this.users.length;
      });
    });
  }

  async presentToast(message) {
    await this.toastCtrl.create({
      message,
      position: 'top',
      duration: 2500,
      color: 'dark',
      buttons: [
        {
          text: 'Done',
          role: 'cancel'
        }
      ]
    }).then(toast => {
      toast.present();
    });
  }

  async errorMessage(message) {
    await this.toastCtrl.create({
      message,
      position: 'top',
      duration: 2500,
      color: 'danger',
      buttons: [
        {
          text: 'Done',
          role: 'cancel'
        }
      ]
    }).then(toast => {
      toast.present();
    });
  }

  startChat(username) {
    this.chatService.startChat(username)
      .then(res => {
        this.router.navigate(['/app/room', res.id]);
      })
      .catch(error => {
      this.errorMessage(error.message);
    });
  }

  goToChatRoom(user: Searchable) {
    this.closeSearchPage()
      .then(() => this.startChat(user.username));
  }
}
