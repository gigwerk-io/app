import {environment} from '../../environments/environment';

export const StorageKeys = {
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  PROFILE: 'PROFILE',
  THEME_PREFERENCE: 'THEME_PREFERENCE',
  CUSTOMER_TUTORIAL: 'CUSTOMER_TUTORIAL',
  PLATFORM_TUTORIAL: 'PLATFORM_TUTORIAL'
};

export const Role = {
  VERIFIED_FREELANCER: 'Verified Freelancer',
  PENDING_FREELANCER: 'Pending Freelancer',
  CUSTOMER: 'Customer'
};

export const TaskStatus = {
  REQUESTED: 'Requested',
  PENDING_APPROVAL: 'Pending Approval',
  PAID: 'Paid',
  IN_PROGRESS: 'In Progress',
  COMPLETE: 'Complete'
};

export const TaskActions = {
  FREELANCER_ACCEPT_TASK: 'freelancerAcceptTask',
  FREELANCER_WITHDRAW_TASK: 'freelancerWithdrawTask',
  FREELANCER_ARRIVE_TASK: 'freelancerArriveTask',
  FREELANCER_COMPLETE_TASK: 'completeTask',
  CUSTOMER_ACCEPT_FREELANCER: 'customerAcceptFreelancer',
  CUSTOMER_REJECT_FREELANCER: 'customerRejectFreelancer',
  CUSTOMER_UPDATE_TASK: 'customerUpdateTask',
  CUSTOMER_CANCEL_TASK: 'customerCancelTask',
  CUSTOMER_COMPLETE_TASK: 'customerCompleteTask'
};

export const API_ADDRESS =  environment.apiUrl;
export const PUSHER_ID = environment.pusherId;
export const STRIPE_PUBLIC = environment.stripeKey;
export const GA_ID = environment.googleAnalyticsId;
export const INTERCOM_ID = environment.intercomId;
export const GCM_KEY = environment.gcmKey;
export const ORIGIN = environment.origin;
