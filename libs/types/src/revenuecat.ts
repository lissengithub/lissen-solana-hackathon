/* eslint-disable @typescript-eslint/no-namespace */
import { BigQueryTimestamp } from "@google-cloud/bigquery";

export namespace RevenueCat {
  export type Event = {
    aliases: string[];
    app_id: string;
    app_user_id: string;
    commission_percentage: number | null;
    country_code: string;
    currency: string | null;
    entitlement_ids: string[];
    environment: "PRODUCTION" | "SANDBOX";
    event_timestamp_ms: number;
    expiration_at_ms: number | null;
    id: string;
    is_family_share: boolean;
    offer_code: string | null;
    original_app_user_id: string;
    original_transaction_id: string;
    period_type: "NORMAL" | "INTRO" | "TRIAL" | "PROMOTIONAL" | "PREPAID";
    presented_offering_id: string | null;
    price: number | null;
    price_in_purchased_currency: number | null;
    product_id: string;
    purchased_at_ms: number | null;
    store:
      | "AMAZON"
      | "APP_STORE"
      | "MAC_APP_STORE"
      | "PROMOTIONAL"
      | "STRIPE"
      | "PLAY_STORE";
    subscriber_attributes: object;
    tax_percentage: number | null;
    transaction_id: string;
    type:
      | "TEST"
      | "INITIAL_PURCHASE"
      | "NON_RENEWING_PURCHASE"
      | "RENEWAL"
      | "PRODUCT_CHANGE"
      | "CANCELLATION"
      | "BILLING_ISSUE"
      | "SUBSCRIBER_ALIAS"
      | "SUBSCRIPTION_PAUSED"
      | "UNCANCELLATION"
      | "TRANSFER"
      | "SUBSCRIPTION_EXTENDED"
      | "EXPIRATION";
    entitlement_id?: number;
    takehome_percentage?: number;
    cancel_reason:
      | "UNSUBSCRIBE"
      | "BILLING_ERROR"
      | "DEVELOPER_INITIATED"
      | "PRICE_INCREASE"
      | "CUSTOMER_SUPPORT"
      | "UNKNOWN";
    expiration_reason:
      | "UNSUBSCRIBE"
      | "BILLING_ERROR"
      | "DEVELOPER_INITIATED"
      | "PRICE_INCREASE"
      | "CUSTOMER_SUPPORT"
      | "UNKNOWN";
    grace_period_expiration_at_ms: number | null;
    auto_resume_at_ms: number | null;
    is_trial_conversion: boolean | null;
    new_product_id: string | null;
    transferred_from: string[];
    transferred_to: string[];
  };

  export type BigQueryEvent = Omit<
    Event,
    | "entitlement_id"
    | "takehome_percentage"
    | "event_timestamp_ms"
    | "expiration_at_ms"
    | "subscriber_attributes"
    | "grace_period_expiration_at_ms"
    | "auto_resume_at_ms"
    | "purchased_at_ms"
  > & {
    api_version: string;
    event_timestamp_ms: BigQueryTimestamp;
    expiration_at_ms: BigQueryTimestamp | null;
    subscriber_attributes: string;
    grace_period_expiration_at_ms: BigQueryTimestamp | null;
    auto_resume_at_ms: BigQueryTimestamp | null;
    purchased_at_ms: BigQueryTimestamp | null;
    raw_event: any;
  };

  export type Webhook = {
    api_version: string;
    event: Event;
  };
}
