import {Injectable} from '@angular/core';
import {MainMarketplaceTask} from '../interfaces/main-marketplace/main-marketplace-task';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {MainProposal} from '../interfaces/main-marketplace/main-proposal';
import {RESTService} from './rest.service';
import {AuthService} from './auth.service';
import {UtilsService} from './utils.service';
import {Response} from '../interfaces/response';
import {GenericResponse} from '../interfaces/searchable';
import {Events} from './events';
import {TaskAction} from '../../providers/constants';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService extends RESTService {

  constructor(
    public httpClient: HttpClient,
    public storage: Storage,
    public authService: AuthService,
    public utils: UtilsService,
    public events: Events
  ) {
    super(httpClient, storage);
  }

  public getSingleMainMarketplaceRequest(id: number, coords?: any): Promise<Response<MainMarketplaceTask>> {
    const makeRequest = (coords) ? this.makeHttpRequest<Response<MainMarketplaceTask>>(`marketplace/main/request/${id}`, 'GET', coords) :
      this.makeHttpRequest<Response<MainMarketplaceTask>>(`marketplace/main/request/${id}`, 'GET');
    return makeRequest
      .then(httpRes => httpRes.toPromise().then(res => res))
      .catch((error: HttpErrorResponse) => {
        if (error.error) {
          this.utils.presentToast(error.error.message, 'danger');
        } else {
          this.utils.presentToast(error.message, 'danger');
        }
        return {success: false, message: '', data: null};
      });
  }

  public getMainMarketplaceRequests(filter?: string, coords?: any): Promise<Response<MainMarketplaceTask[]>> {
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

    return this.makeHttpRequest<Response<MainMarketplaceTask[]>>(route, 'GET', coords).then(httpRes => httpRes.toPromise()
      .then(res => res))
      .catch(error => {
        if (error.status === 401) {
          this.authService.isValidToken(); // check whether this user has valid authorization rights
        }
        return {success: false, message: '', data: []};
      });
  }

  public createMainMarketplaceRequest(req: MainMarketplaceTask): Promise<GenericResponse> {
    return this.makeHttpRequest<GenericResponse>('marketplace/main/request', 'POST', req)
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

  public editMainMarketplaceRequest(req: MainMarketplaceTask): Promise<GenericResponse> {
    return this.makeHttpRequest<GenericResponse>(`marketplace/main/edit/${req.id}`, 'PATCH', req)
      .then(httpRes => httpRes.toPromise().then(res => {
        this.utils.presentToast(res.message, 'success')
          .then(() => this.events.publish('task-action', TaskAction.JOB_IS_EDITABLE, req.id));
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

  public freelancerAcceptMainMarketplaceRequest(id: number): Promise<GenericResponse> {
    return this.makeHttpRequest<GenericResponse>(`marketplace/main/accept/${id}`, 'GET')
      .then(httpRes => httpRes.toPromise()
        .then(res => {
          this.utils.presentToast(res.message, 'success')
            .then(() => this.events.publish('task-action', TaskAction.JOB_CAN_BE_ACCEPTED, id));
          return res;
        })
        .catch((error: HttpErrorResponse) => {
          this.utils.presentToast(error.error.message, 'danger');
          return {success: false, message: error.message};
        }));
  }

  public freelancerWithdrawMainMarketplaceRequest(id: number): Promise<GenericResponse> {
    return this.makeHttpRequest<GenericResponse>(`marketplace/main/freelancer/withdraw/${id}`, 'GET')
      .then(httpRes => httpRes.toPromise()
        .then(res => {
          this.utils.presentToast(res.message, 'success')
            .then(() => this.events.publish('task-action', TaskAction.JOB_CAN_BE_ACCEPTED, id));
          return res;
        })
        .catch((error: HttpErrorResponse) => {
          this.utils.presentToast(error.error.message, 'danger');
          return {success: false, message: error.message};
        }));
  }

  public customerCancelMainMarketplaceRequest(id: number): Promise<GenericResponse> {
    return this.makeHttpRequest<GenericResponse>(`marketplace/main/request/cancel/${id}`, 'GET')
      .then(httpRes => httpRes.toPromise()
        .then(res => {
          this.utils.presentToast(res.message, 'success')
              .then(() => this.events.publish('task-action', TaskAction.NO_PERFORMABLE_ACTION, id));
          return res;
        })
        .catch((error: HttpErrorResponse) => {
          this.utils.presentToast(error.error.message, 'danger');
          return {success: false, message: error.message};
        }));
  }

  public customerAcceptFreelancer(taskID: number, freelancerID: number): Promise<GenericResponse> {
    return this.makeHttpRequest<GenericResponse>(`marketplace/main/${taskID}/accept/${freelancerID}`, 'GET')
      .then(httpRes => httpRes.toPromise()
        .then(res => {
          this.utils.presentToast(res.message, 'success')
            .then(() => this.events.publish('task-action', TaskAction.WORKER_HAS_BEEN_APPROVED, taskID));
          return res;
        })
        .catch((error: HttpErrorResponse) => {
          this.utils.presentToast(error.error.message, 'danger');
          return {success: false, message: error.message};
        }));
  }

  public customerDenyFreelancer(taskID: number, freelancerID: number): Promise<GenericResponse> {
    return this.makeHttpRequest<GenericResponse>(`marketplace/main/${taskID}/deny/${freelancerID}`, 'GET')
      .then(httpRes => httpRes.toPromise()
        .then(res => {
          this.utils.presentToast(res.message, 'success')
            .then(() => this.events.publish('task-action', TaskAction.JOB_CAN_BE_ACCEPTED, taskID));
          return res;
        })
        .catch((error: HttpErrorResponse) => {
          this.utils.presentToast(error.error.message, 'danger');
          return {success: false, message: error.message};
        }));
  }

  public freelancerArrivedAtTaskSite(id: number): Promise<GenericResponse> {
    return this.makeHttpRequest<GenericResponse>(`marketplace/main/freelancer/arrive/${id}`, 'GET')
      .then(httpRes => httpRes.toPromise()
        .then(res => {
          this.utils.presentToast(res.message, 'success')
            .then(() => this.events.publish('task-action', TaskAction.WORKER_IS_IN_PROGRESS, id));
          return res;
        })
        .catch((error: HttpErrorResponse) => {
          this.utils.presentToast(error.error.message, 'danger');
          return {success: false, message: error.message};
        }));
  }

  public freelancerCompleteTask(id: number, ratingAndReview: { rating: number, review: string }): Promise<GenericResponse> {
    return this.makeHttpRequest<GenericResponse>(`marketplace/main/freelancer/complete/${id}`, 'POST', ratingAndReview)
      .then(httpRes => httpRes.toPromise()
        .then(res => {
          this.utils.presentToast(res.message, 'success')
            .then(() => this.events.publish('task-action', TaskAction.CUSTOMER_NEEDS_TO_REVIEW, id));
          return res;
        })
        .catch((error: HttpErrorResponse) => {
          this.utils.presentToast(error.error.message, 'danger');
          return {success: false, message: error.message};
        }));
  }

  public customerCompleteTask(id: number, ratingAndReview: { rating: number, review: string }): Promise<GenericResponse> {
    return this.makeHttpRequest<GenericResponse>(`marketplace/main/request/complete/${id}`, 'POST', ratingAndReview)
      .then(httpRes => httpRes.toPromise()
        .then(res => {
          this.utils.presentToast(res.message, 'success')
            .then(() => this.events.publish('task-action', TaskAction.JOB_IS_COMPLETE, id));
          return res;
        })
        .catch((error: HttpErrorResponse) => {
          this.utils.presentToast(error.error.message, 'danger');
          return {success: false, message: error.message};
        }));
  }

  public mainMarketplaceReportTask(id: number, description: string): Promise<GenericResponse> {
    return this.makeHttpRequest<GenericResponse>(`report/main/marketplace/${id}`, 'POST', {description})
      .then(httpRes => httpRes.toPromise()
        .then(res => {
          this.utils.presentToast(res.message, 'success')
            .then(() => this.events.publish('task-action', TaskAction.NO_PERFORMABLE_ACTION, id));
          return res;
        })
        .catch((error: HttpErrorResponse) => {
          this.utils.presentToast(error.error.message, 'danger');
          return {success: false, message: error.message};
        }));
  }

  public checkIsTaskFreelancer(userID: number, task: MainMarketplaceTask): boolean {
    const proposals: MainProposal[] = task.proposals;
    return (proposals) ? proposals.find((proposal: MainProposal) => proposal.user_id === userID) !== undefined : false;
  }
}
