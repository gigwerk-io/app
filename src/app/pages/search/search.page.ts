import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonSearchbar, ModalController} from '@ionic/angular';
import {FriendsService} from '../../utils/services/friends.service';
import {Router} from '@angular/router';
import {Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Searchable} from '../../utils/interfaces/searchable';
import {UtilsService} from '../../utils/services/utils.service';
import { Response } from '../../utils/interfaces/response';

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

  constructor(
    private modalCtrl: ModalController,
    private friendService: FriendsService,
    private router: Router,
    private utils: UtilsService,
  ) { }

  ngOnInit() {
    this.setupSearchDebouncer();
    if (this.isChat) {
      this.friendService.getMyFriends()
        .then(res => (res.data.length > 0) ? this.users = res.data : undefined);
    }
  }

  ngOnDestroy() {
    this.searchDebouncerSub.unsubscribe();
  }

  async closeSearchPage() {
    await this.modalCtrl.dismiss();
  }

  handleSearch() {
    this.friendService.searchUsers(this.query).then((res: Response<Searchable[]>) => {
      this.users = res.data;
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
      this.friendService.searchUsers(term).then((res: Response<Searchable[]>) => {
        this.users = res.data;
        this.queryLength = this.users.length;
      });
    });
  }

  goToChatRoom(user: Searchable) {
    this.closeSearchPage()
      .then(() => this.utils.startChat(user.username));
  }
}
