/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateCategory = /* GraphQL */ `subscription OnCreateCategory($filter: ModelSubscriptionCategoryFilterInput) {
  onCreateCategory(filter: $filter) {
    color
    createdAt
    id
    name
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateCategorySubscriptionVariables,
  APITypes.OnCreateCategorySubscription
>;
export const onCreateListItem = /* GraphQL */ `subscription OnCreateListItem($filter: ModelSubscriptionListItemFilterInput) {
  onCreateListItem(filter: $filter) {
    categoryId
    createdAt
    id
    isCompleted
    name
    quantity
    sortOrder
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateListItemSubscriptionVariables,
  APITypes.OnCreateListItemSubscription
>;
export const onCreateUserPreference = /* GraphQL */ `subscription OnCreateUserPreference(
  $filter: ModelSubscriptionUserPreferenceFilterInput
) {
  onCreateUserPreference(filter: $filter) {
    createdAt
    id
    sortMode
    theme
    updatedAt
    userKey
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserPreferenceSubscriptionVariables,
  APITypes.OnCreateUserPreferenceSubscription
>;
export const onDeleteCategory = /* GraphQL */ `subscription OnDeleteCategory($filter: ModelSubscriptionCategoryFilterInput) {
  onDeleteCategory(filter: $filter) {
    color
    createdAt
    id
    name
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteCategorySubscriptionVariables,
  APITypes.OnDeleteCategorySubscription
>;
export const onDeleteListItem = /* GraphQL */ `subscription OnDeleteListItem($filter: ModelSubscriptionListItemFilterInput) {
  onDeleteListItem(filter: $filter) {
    categoryId
    createdAt
    id
    isCompleted
    name
    quantity
    sortOrder
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteListItemSubscriptionVariables,
  APITypes.OnDeleteListItemSubscription
>;
export const onDeleteUserPreference = /* GraphQL */ `subscription OnDeleteUserPreference(
  $filter: ModelSubscriptionUserPreferenceFilterInput
) {
  onDeleteUserPreference(filter: $filter) {
    createdAt
    id
    sortMode
    theme
    updatedAt
    userKey
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserPreferenceSubscriptionVariables,
  APITypes.OnDeleteUserPreferenceSubscription
>;
export const onUpdateCategory = /* GraphQL */ `subscription OnUpdateCategory($filter: ModelSubscriptionCategoryFilterInput) {
  onUpdateCategory(filter: $filter) {
    color
    createdAt
    id
    name
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateCategorySubscriptionVariables,
  APITypes.OnUpdateCategorySubscription
>;
export const onUpdateListItem = /* GraphQL */ `subscription OnUpdateListItem($filter: ModelSubscriptionListItemFilterInput) {
  onUpdateListItem(filter: $filter) {
    categoryId
    createdAt
    id
    isCompleted
    name
    quantity
    sortOrder
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateListItemSubscriptionVariables,
  APITypes.OnUpdateListItemSubscription
>;
export const onUpdateUserPreference = /* GraphQL */ `subscription OnUpdateUserPreference(
  $filter: ModelSubscriptionUserPreferenceFilterInput
) {
  onUpdateUserPreference(filter: $filter) {
    createdAt
    id
    sortMode
    theme
    updatedAt
    userKey
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserPreferenceSubscriptionVariables,
  APITypes.OnUpdateUserPreferenceSubscription
>;
