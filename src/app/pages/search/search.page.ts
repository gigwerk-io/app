import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonSearchbar, ModalController} from '@ionic/angular';
import {FriendsService} from '../../utils/services/friends.service';
import {Router} from '@angular/router';
import {Subject, BehaviorSubject, Subscription} from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {User} from '../../utils/interfaces/user';
import {EventsService} from '../../utils/services/events.service';

@Component({
  selector: 'search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit, OnDestroy {

  @Input() isChat = false;

  users: User[];
  query;
  queryLength = undefined;

  // Observable for debouncing input changes
  private searchDebouncerSubject: Subject<string> = new Subject();
  private searchDebouncerSub: Subscription;
  // @ts-ignore
  @ViewChild(IonSearchbar) searchBar: IonSearchbar;

  constructor(private modalCtrl: ModalController,
              private friendService: FriendsService,
              private router: Router) { }

  ngOnInit() {
    setTimeout(() => this.searchBar.setFocus(), 350);
    this.setupSearchDebouncer();
    if (this.isChat) {
      this.friendService.getMyFriends()
        .then(res => this.users = res);
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
    this.friendService.searchUsers(this.query).toPromise().then(res => {
      this.users = res;
      // console.log(this.users);
    });
  }

  goToUserProfile(id) {
    this.closeSearchPage();
    this.router.navigate(['/app/profile', id]);
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
      this.friendService.searchUsers(term).toPromise().then(res => {
        this.users = res;
        this.queryLength = this.users.length;
      });
    });
  }

  goToChatRoom() {
    console.log(this.isChat);
  }
}
