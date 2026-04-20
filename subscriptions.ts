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
    listId
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
    attachments
    categoryId
    createdAt
    id
    isCompleted
    listId
    name
    notes
    priority
    quantity
    sortOrder
    subtasks
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateListItemSubscriptionVariables,
  APITypes.OnCreateListItemSubscription
>;
export const onCreateShoppingList = /* GraphQL */ `subscription OnCreateShoppingList(
  $filter: ModelSubscriptionShoppingListFilterInput
) {
  onCreateShoppingList(filter: $filter) {
    createdAt
    id
    name
    sortOrder
    updatedAt
    userKey
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateShoppingListSubscriptionVariables,
  APITypes.OnCreateShoppingListSubscription
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
    listId
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
    attachments
    categoryId
    createdAt
    id
    isCompleted
    listId
    name
    notes
    priority
    quantity
    sortOrder
    subtasks
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteListItemSubscriptionVariables,
  APITypes.OnDeleteListItemSubscription
>;
export const onDeleteShoppingList = /* GraphQL */ `subscription OnDeleteShoppingList(
  $filter: ModelSubscriptionShoppingListFilterInput
) {
  onDeleteShoppingList(filter: $filter) {
    createdAt
    id
    name
    sortOrder
    updatedAt
    userKey
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteShoppingListSubscriptionVariables,
  APITypes.OnDeleteShoppingListSubscription
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
    listId
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
    attachments
    categoryId
    createdAt
    id
    isCompleted
    listId
    name
    notes
    priority
    quantity
    sortOrder
    subtasks
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateListItemSubscriptionVariables,
  APITypes.OnUpdateListItemSubscription
>;
export const onUpdateShoppingList = /* GraphQL */ `subscription OnUpdateShoppingList(
  $filter: ModelSubscriptionShoppingListFilterInput
) {
  onUpdateShoppingList(filter: $filter) {
    createdAt
    id
    name
    sortOrder
    updatedAt
    userKey
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateShoppingListSubscriptionVariables,
  APITypes.OnUpdateShoppingListSubscription
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
