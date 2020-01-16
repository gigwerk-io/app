import { Injectable } from '@angular/core';
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
import {Observable, from} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {API_ADDRESS, StorageKeys} from '../../providers/constants';
import {AuthorizationToken} from '../interfaces/user-options';
import {MainProposal} from '../interfaces/main-marketplace/main-proposal';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private httpClient: HttpClient,
              private storage: Storage) {
  }

  public getSingleMainMarketplaceRequest(id: number, coords?: any): Promise<MainMarketplaceTask> {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader = {
            headers: {
              Authorization: (token) ? token : ''
            },
            params: coords
          };
          return this.httpClient.get<MainMarketplaceTask>(`${API_ADDRESS}/marketplace/main/request/${id}`, authHeader)
            .toPromise()
            .then((res: MainMarketplaceTask) => res);
        });
  }

  public getMainMarketplaceRequests(filter?: string, coords?: any): Observable<MainMarketplaceTask[]> {
    switch (filter) {
      case 'all':
        return from(
          this.storage.get(StorageKeys.ACCESS_TOKEN)
            .then(token => {
              const authHeader = {
                headers: {
                  Authorization: (token) ? token : ''
                },
                params: coords
              };
              return this.httpClient.get<MainMarketplaceRouteResponse>(`${API_ADDRESS}/marketplace/main/feed`, authHeader)
                .toPromise()
                .then((res: MainMarketplaceRouteResponse) => res.requests);
            })
        );
      case 'me':
        return from(
          this.storage.get(StorageKeys.ACCESS_TOKEN)
            .then(token => {
              const authHeader: AuthorizationToken = {
                headers: {
                  Authorization: (token) ? token : ''
                }
              };
              return this.httpClient.get<MainMarketplaceRouteResponse>(`${API_ADDRESS}/marketplace/main/me`, authHeader)
                .toPromise()
                .then((res: MainMarketplaceRouteResponse) => res.requests);
            })
        );
      case 'proposals':
        return from(
          this.storage.get(StorageKeys.ACCESS_TOKEN)
            .then(token => {
              const authHeader: AuthorizationToken = {
                headers: {
                  Authorization: (token) ? token : ''
                }
              };
              return this.httpClient.get<MainMarketplaceRouteResponse>(`${API_ADDRESS}/marketplace/main/proposals`, authHeader)
                .toPromise()
                .then((res: MainMarketplaceRouteResponse) => res.requests);
            })
        );
    }
  }

  public createMainMarketplaceRequest(req: MainMarketplaceTask): Promise<string> {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
      .then(token => {
        const authHeader: AuthorizationToken = {
          headers: {
            Authorization: (token) ? token : ''
          }
        };
        return this.httpClient.post<MainMarketplaceRequestRouteResponse>(`${API_ADDRESS}/marketplace/main/request`, req, authHeader)
          .toPromise()
          .then((res: MainMarketplaceRequestRouteResponse) => res.message);
      });
  }

  public editMainMarketplaceRequest(req: MainMarketplaceTask): Promise<string> {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
      .then(token => {
        const authHeader: AuthorizationToken = {
          headers: {
            Authorization: (token) ? token : ''
          }
        };
        return this.httpClient.post<MainMarketplaceRequestRouteResponse>(`${API_ADDRESS}/marketplace/main/edit/${req.id}`, req, authHeader)
          .toPromise()
          .then((res: MainMarketplaceRequestRouteResponse) => res.message);
      });
  }

  public freelancerAcceptMainMarketplaceRequest(id: number): Promise<string> {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
      .then(token => {
        const authHeader: AuthorizationToken = {
          headers: {
            Authorization: (token) ? token : ''
          }
        };
        // tslint:disable-next-line
        return this.httpClient.get<FreelancerAcceptMainMarketplaceTaskRouteResponse>(`${API_ADDRESS}/marketplace/main/accept/${id}`, authHeader)
          .toPromise()
          .then((res: FreelancerAcceptMainMarketplaceTaskRouteResponse) => res.message);
      });
  }

  public freelancerWithdrawMainMarketplaceRequest(id: number): Promise<string> {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
      .then(token => {
        const authHeader: AuthorizationToken = {
          headers: {
            Authorization: (token) ? token : ''
          }
        };
        // tslint:disable-next-line
        return this.httpClient.get<FreelancerWithdrawMainMarketplaceTaskRouteResponse>(`${API_ADDRESS}/marketplace/main/freelancer/withdraw/${id}`, authHeader)
          .toPromise()
          .then((res: FreelancerWithdrawMainMarketplaceTaskRouteResponse) => res.message);
      });
  }

  public customerCancelMainMarketplaceRequest(id: number): Promise<string> {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
      .then(token => {
        const authHeader: AuthorizationToken = {
          headers: {
            Authorization: (token) ? token : ''
          }
        };

        return this.httpClient.get<CustomerCancelTaskResponse>(`${API_ADDRESS}/marketplace/main/request/cancel/${id}`, authHeader)
          .toPromise()
          .then((res: CustomerCancelTaskResponse) => res.message);
      });
  }

  public customerApproveFreelancer(taskID: number, freelancerID: number): Promise<string> {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
      .then(token => {
        const authHeader: AuthorizationToken = {
          headers: {
            Authorization: (token) ? token : ''
          }
        };

        // tslint:disable-next-line
        return this.httpClient.get<CustomerApproveFreelancerResponse>(`${API_ADDRESS}/marketplace/main/${taskID}/accept/${freelancerID}`, authHeader)
          .toPromise()
          .then((res: CustomerApproveFreelancerResponse) => res.message);
      });
  }

  public customerDenyFreelancer(taskID: number, freelancerID: number): Promise<string> {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
      .then(token => {
        const authHeader: AuthorizationToken = {
          headers: {
            Authorization: (token) ? token : ''
          }
        };

        // tslint:disable-next-line
        return this.httpClient.get<CustomerDenyFreelancerResponse>(`${API_ADDRESS}/marketplace/main/${taskID}/deny/${freelancerID}`, authHeader)
          .toPromise()
          .then((res: CustomerDenyFreelancerResponse) => res.message);
      });
  }

  public freelancerArrivedAtTaskSite(id: number): Promise<string> {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
      .then(token => {
        const authHeader: AuthorizationToken = {
          headers: {
            Authorization: (token) ? token : ''
          }
        };

        // tslint:disable-next-line
        return this.httpClient.get<FreelancerArrivedResponse>(`${API_ADDRESS}/marketplace/main/freelancer/arrive/${id}`, authHeader)
          .toPromise()
          .then((res: FreelancerArrivedResponse) => res.message);
      });
  }

  public freelancerCompleteTask(id: number, ratingAndReview: {rating: number, review: string}): Promise<string> {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
      .then(token => {
        const authHeader: AuthorizationToken = {
          headers: {
            Authorization: (token) ? token : ''
          }
        };

        // tslint:disable-next-line
        return this.httpClient.post<FreelancerCompleteTaskResponse>(`${API_ADDRESS}/marketplace/main/freelancer/complete/${id}`, ratingAndReview, authHeader)
          .toPromise()
          .then((res: FreelancerCompleteTaskResponse) => res.message);
      });
  }

  public customerCompleteTask(id: number, ratingAndReview: {rating: number, review: string}): Promise<string> {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
      .then(token => {
        const authHeader: AuthorizationToken = {
          headers: {
            Authorization: (token) ? token : ''
          }
        };

        // tslint:disable-next-line
        return this.httpClient.post<CustomerCompleteTaskResponse>(`${API_ADDRESS}/marketplace/main/request/complete/${id}`, ratingAndReview, authHeader)
          .toPromise()
          .then((res: CustomerCompleteTaskResponse) => res.message);
      });
  }

  public mainMarketplaceReportTask(id: number, description: string): Promise<string> {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
      .then(token => {
        const authHeader: AuthorizationToken = {
          headers: {
            Authorization: (token) ? token : ''
          }
        };

        return this.httpClient.post<ReportTaskResponse>(`${API_ADDRESS}/report/main/marketplace/${id}`,
          {description: description}, authHeader)
          .toPromise()
          .then((res: ReportTaskResponse) => res.message);
      });
  }

  public checkIsTaskFreelancer(userID: number, task: MainMarketplaceTask): boolean {
    const proposals: MainProposal[] = task.proposals;
    return (proposals) ? proposals.find((proposal: MainProposal) => proposal.user_id === userID) !== undefined : false;
  }
}
