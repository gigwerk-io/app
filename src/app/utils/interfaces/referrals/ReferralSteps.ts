export interface ReferralSteps {
  has_bank_account: boolean;
  has_profile_photo: boolean;
  has_profile_description: boolean;
}

export interface ReferralStepsResponse {
  steps: ReferralSteps;
}
