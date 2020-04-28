import {Injectable} from '@angular/core';
import {
  CustomerApproveFreelancerResponse,
  CustomerCancelTaskResponse, CustomerCompleteTaskResponse,
  CustomerDenyFreelancerResponse,
  FreelancerAcceptMainMarketplaceTaskRouteResponse,
  FreelancerArrivedResponse,
  FreelancerCompleteTaskResponse,
  FreelancerWithdrawMainMarketplaceTaskRouteResponse,
  MainMarketplaceRequestRouteResponse,
  MainMarketplaceRouteResponse,
  MainMarketplaceTask, ReportTaskResponse
} from '../interfaces/main-marketplace/main-marketplace-task';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {MainProposal} from '../interfaces/main-marketplace/main-proposal';
import {RESTService} from './rest.service';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {UtilsService} from './utils.service';
import {Response} from '../interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService extends RESTService {

  constructor(
    public httpClient: HttpClient,
    public storage: Storage,
    public authService: AuthService,
    public utils: UtilsService
  ) {
    super(httpClient, storage);
  }

  public getSingleMainMarketplaceRequest(id: number, coords?: any): Promise<Response<MainMarketplaceTask>> {
    return this.makeHttpRequest<Response<MainMarketplaceTask>>(`marketplace/main/request/${id}`, 'GET', coords)
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  public getMainMarketplaceRequests(filter?: string, coords?: any, callback?: (...args) => any): Promise<MainMarketplaceTask[]> {
    let route: string;

    switch (filter) {
      case 'all':
        route = 'marketplace/main/feed';
        break;
      case 'me':
        route = 'marketplace/main/me';
        break;
      case 'proposals':
        route = 'marketplace/main/proposals';
        break;
    }

    const mainMarketplaceTasks: Promise<Observable<MainMarketplaceRouteResponse>> =
      this.makeHttpRequest<MainMarketplaceRouteResponse>(
        route,
        'GET',
        coords
      );

    return mainMarketplaceTasks.then(httpRes => httpRes.toPromise()
      .then(res => {
        if (callback) {
          callback(res);
        }
        return res.data;
      }))
      .catch(error => {
        if (error.status === 401) {
          this.authService.isValidToken(); // check whether this user has valid authorization rights
        }
        return [];
      });
  }

  public createMainMarketplaceRequest(req: MainMarketplaceTask): Promise<MainMarketplaceRequestRouteResponse> {
    return this.makeHttpRequest<MainMarketplaceRequestRouteResponse>('marketplace/main/request', 'POST', req)
      .then(httpRes => httpRes.toPromise().then(res => {
        this.utils.presentToast(res.message, 'success');
        return res;
      }))
      .catch((error: HttpErrorResponse) => {
        if (error.error) {
          this.utils.presentToast(error.error.message, 'danger');
        } else {
          this.utils.presentToast(error.message, 'danger');
        }
        return {success: false, message: '', data: null};
      });
  }

  public editMainMarketplaceRequest(req: MainMarketplaceTask): Promise<MainMarketplaceRequestRouteResponse> {
    return this.makeHttpRequest<MainMarketplaceRequestRouteResponse>(`marketplace/main/edit/${req.id}`, 'POST', req)
      .then(httpRes => httpRes.toPromise().then(res => {
        this.utils.presentToast(res.message, 'success');
        return res;
      }))
      .catch((error: HttpErrorResponse) => {
        if (error.error) {
          this.utils.presentToast(error.error.message, 'danger');
        } else {
          this.utils.presentToast(error.message, 'danger');
        }
        return {success: false, message: '', data: null};
      });
  }

  public freelancerAcceptMainMarketplaceRequest(id: number): Promise<string> {
    return this.makeHttpRequest<FreelancerAcceptMainMarketplaceTaskRouteResponse>(`marketplace/main/accept/${id}`, 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res.message));
  }

  public freelancerWithdrawMainMarketplaceRequest(id: number): Promise<string> {
    return this.makeHttpRequest<FreelancerWithdrawMainMarketplaceTaskRouteResponse>(`marketplace/main/freelancer/withdraw/${id}`, 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res.message));
  }

  public customerCancelMainMarketplaceRequest(id: number): Promise<string> {
    return this.makeHttpRequest<CustomerCancelTaskResponse>(`marketplace/main/request/cancel/${id}`, 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res.message));
  }

  public customerAcceptFreelancer(taskID: number, freelancerID: number): Promise<string> {
    return this.makeHttpRequest<CustomerApproveFreelancerResponse>(`marketplace/main/${taskID}/accept/${freelancerID}`, 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res.message));
  }

  public customerDenyFreelancer(taskID: number, freelancerID: number): Promise<string> {
    return this.makeHttpRequest<CustomerDenyFreelancerResponse>(`marketplace/main/${taskID}/deny/${freelancerID}`, 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res.message));
  }

  public freelancerArrivedAtTaskSite(id: number): Promise<string> {
    return this.makeHttpRequest<FreelancerArrivedResponse>(`marketplace/main/freelancer/arrive/${id}`, 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res.message));
  }

  public freelancerCompleteTask(id: number, ratingAndReview: { rating: number, review: string }): Promise<string> {
    return this.makeHttpRequest<FreelancerCompleteTaskResponse>(`marketplace/main/freelancer/complete/${id}`, 'POST', ratingAndReview)
      .then(httpRes => httpRes.toPromise().then(res => res.message));
  }

  public customerCompleteTask(id: number, ratingAndReview: { rating: number, review: string }): Promise<string> {
    return this.makeHttpRequest<CustomerCompleteTaskResponse>(`marketplace/main/request/complete/${id}`, 'POST', ratingAndReview)
      .then(httpRes => httpRes.toPromise().then(res => res.message));
  }

  public mainMarketplaceReportTask(id: number, description: string): Promise<string> {
    return this.makeHttpRequest<ReportTaskResponse>(`report/main/marketplace/${id}`, 'POST', {description})
      .then(httpRes => httpRes.toPromise().then(res => res.message));
  }

  public checkIsTaskFreelancer(userID: number, task: MainMarketplaceTask): boolean {
    const proposals: MainProposal[] = task.proposals;
    return (proposals) ? proposals.find((proposal: MainProposal) => proposal.user_id === userID) !== undefined : false;
  }
}
