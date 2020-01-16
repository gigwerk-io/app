import {Component, OnInit, ViewChild} from '@angular/core';
import {IonSearchbar, ModalController} from '@ionic/angular';
import {FriendsService} from '../../utils/services/friends.service';
import {Router} from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  users;
  query;
  query_length = undefined;
  // Holds results
  public people$: Subject<any> = new Subject();

  // Observable for debouncing input changes
  private searchDecouncer$: Subject<string> = new Subject();
  // @ts-ignore
  @ViewChild(IonSearchbar) searchBar: IonSearchbar;

  constructor(private modalCtrl: ModalController, private friendService: FriendsService, private router: Router) { }

  ngOnInit() {
    setTimeout(() => this.searchBar.setFocus(), 350);
    this.setupSearchDebouncer();
  }

  async closeSearchPage() {
    await this.modalCtrl.dismiss();
  }

  handleSearch() {
    // console.log(this.query);
    this.friendService.searchUsers(this.query).subscribe(res => {
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
    this.searchDecouncer$.next(term);
  }

  private setupSearchDebouncer(): void {
    // Subscribe to `searchDecouncer$` values,
    // but pipe through `debounceTime` and `distinctUntilChanged`
    this.searchDecouncer$.pipe(
      debounceTime(250),
      distinctUntilChanged(),
    ).subscribe((term: string) => {
      this.friendService.searchUsers(term).subscribe(res => {
        this.users = res;
        this.query_length = this.users.length;
      });
    });
  }
}
