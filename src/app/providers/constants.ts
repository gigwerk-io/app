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

export const TaskAction = {
  JOB_IS_EDITABLE: 1,
  JOB_CAN_BE_ACCEPTED: 2,
  WORKER_IS_WAITING_FOR_CUSTOMER: 3,
  NO_PERFORMABLE_ACTION: 4,
  WORKER_HAS_BEEN_APPROVED: 5,
  WORKER_IS_IN_PROGRESS: 6,
  CUSTOMER_NEEDS_TO_RESPOND: 7,
  CUSTOMER_WAITING_FOR_WORKER_ARRIVAL: 8,
  CUSTOMER_WAITING_FOR_WORKER_REVIEW: 9,
  CUSTOMER_NEEDS_TO_REVIEW: 10,
  JOB_IS_COMPLETE: 11
};

export const API_ADDRESS =  environment.apiUrl;
export const PUSHER_ID = environment.pusherId;
export const STRIPE_PUBLIC = environment.stripeKey;
export const GA_ID = environment.googleAnalyticsId;
export const INTERCOM_ID = environment.intercomId;
export const GCM_KEY = environment.gcmKey;
export const ORIGIN = environment.origin;
