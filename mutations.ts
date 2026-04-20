/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createCategory = /* GraphQL */ `mutation CreateCategory(
  $condition: ModelCategoryConditionInput
  $input: CreateCategoryInput!
) {
  createCategory(condition: $condition, input: $input) {
    color
    createdAt
    id
    listId
    name
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateCategoryMutationVariables,
  APITypes.CreateCategoryMutation
>;
export const createListItem = /* GraphQL */ `mutation CreateListItem(
  $condition: ModelListItemConditionInput
  $input: CreateListItemInput!
) {
  createListItem(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateListItemMutationVariables,
  APITypes.CreateListItemMutation
>;
export const createShoppingList = /* GraphQL */ `mutation CreateShoppingList(
  $condition: ModelShoppingListConditionInput
  $input: CreateShoppingListInput!
) {
  createShoppingList(condition: $condition, input: $input) {
    createdAt
    id
    name
    sortOrder
    updatedAt
    userKey
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateShoppingListMutationVariables,
  APITypes.CreateShoppingListMutation
>;
export const createUserPreference = /* GraphQL */ `mutation CreateUserPreference(
  $condition: ModelUserPreferenceConditionInput
  $input: CreateUserPreferenceInput!
) {
  createUserPreference(condition: $condition, input: $input) {
    createdAt
    id
    sortMode
    theme
    updatedAt
    userKey
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserPreferenceMutationVariables,
  APITypes.CreateUserPreferenceMutation
>;
export const deleteCategory = /* GraphQL */ `mutation DeleteCategory(
  $condition: ModelCategoryConditionInput
  $input: DeleteCategoryInput!
) {
  deleteCategory(condition: $condition, input: $input) {
    color
    createdAt
    id
    listId
    name
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteCategoryMutationVariables,
  APITypes.DeleteCategoryMutation
>;
export const deleteListItem = /* GraphQL */ `mutation DeleteListItem(
  $condition: ModelListItemConditionInput
  $input: DeleteListItemInput!
) {
  deleteListItem(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteListItemMutationVariables,
  APITypes.DeleteListItemMutation
>;
export const deleteShoppingList = /* GraphQL */ `mutation DeleteShoppingList(
  $condition: ModelShoppingListConditionInput
  $input: DeleteShoppingListInput!
) {
  deleteShoppingList(condition: $condition, input: $input) {
    createdAt
    id
    name
    sortOrder
    updatedAt
    userKey
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteShoppingListMutationVariables,
  APITypes.DeleteShoppingListMutation
>;
export const deleteUserPreference = /* GraphQL */ `mutation DeleteUserPreference(
  $condition: ModelUserPreferenceConditionInput
  $input: DeleteUserPreferenceInput!
) {
  deleteUserPreference(condition: $condition, input: $input) {
    createdAt
    id
    sortMode
    theme
    updatedAt
    userKey
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUserPreferenceMutationVariables,
  APITypes.DeleteUserPreferenceMutation
>;
export const updateCategory = /* GraphQL */ `mutation UpdateCategory(
  $condition: ModelCategoryConditionInput
  $input: UpdateCategoryInput!
) {
  updateCategory(condition: $condition, input: $input) {
    color
    createdAt
    id
    listId
    name
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateCategoryMutationVariables,
  APITypes.UpdateCategoryMutation
>;
export const updateListItem = /* GraphQL */ `mutation UpdateListItem(
  $condition: ModelListItemConditionInput
  $input: UpdateListItemInput!
) {
  updateListItem(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateListItemMutationVariables,
  APITypes.UpdateListItemMutation
>;
export const updateShoppingList = /* GraphQL */ `mutation UpdateShoppingList(
  $condition: ModelShoppingListConditionInput
  $input: UpdateShoppingListInput!
) {
  updateShoppingList(condition: $condition, input: $input) {
    createdAt
    id
    name
    sortOrder
    updatedAt
    userKey
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateShoppingListMutationVariables,
  APITypes.UpdateShoppingListMutation
>;
export const updateUserPreference = /* GraphQL */ `mutation UpdateUserPreference(
  $condition: ModelUserPreferenceConditionInput
  $input: UpdateUserPreferenceInput!
) {
  updateUserPreference(condition: $condition, input: $input) {
    createdAt
    id
    sortMode
    theme
    updatedAt
    userKey
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserPreferenceMutationVariables,
  APITypes.UpdateUserPreferenceMutation
>;
