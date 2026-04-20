/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getCategory = /* GraphQL */ `query GetCategory($id: ID!) {
  getCategory(id: $id) {
    color
    createdAt
    id
    listId
    name
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCategoryQueryVariables,
  APITypes.GetCategoryQuery
>;
export const getListItem = /* GraphQL */ `query GetListItem($id: ID!) {
  getListItem(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetListItemQueryVariables,
  APITypes.GetListItemQuery
>;
export const getShoppingList = /* GraphQL */ `query GetShoppingList($id: ID!) {
  getShoppingList(id: $id) {
    createdAt
    id
    name
    sortOrder
    updatedAt
    userKey
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetShoppingListQueryVariables,
  APITypes.GetShoppingListQuery
>;
export const getUserPreference = /* GraphQL */ `query GetUserPreference($id: ID!) {
  getUserPreference(id: $id) {
    createdAt
    id
    sortMode
    theme
    updatedAt
    userKey
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserPreferenceQueryVariables,
  APITypes.GetUserPreferenceQuery
>;
export const listCategories = /* GraphQL */ `query ListCategories(
  $filter: ModelCategoryFilterInput
  $limit: Int
  $nextToken: String
) {
  listCategories(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      color
      createdAt
      id
      listId
      name
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCategoriesQueryVariables,
  APITypes.ListCategoriesQuery
>;
export const listListItems = /* GraphQL */ `query ListListItems(
  $filter: ModelListItemFilterInput
  $limit: Int
  $nextToken: String
) {
  listListItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListListItemsQueryVariables,
  APITypes.ListListItemsQuery
>;
export const listShoppingLists = /* GraphQL */ `query ListShoppingLists(
  $filter: ModelShoppingListFilterInput
  $limit: Int
  $nextToken: String
) {
  listShoppingLists(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      name
      sortOrder
      updatedAt
      userKey
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListShoppingListsQueryVariables,
  APITypes.ListShoppingListsQuery
>;
export const listUserPreferences = /* GraphQL */ `query ListUserPreferences(
  $filter: ModelUserPreferenceFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserPreferences(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      sortMode
      theme
      updatedAt
      userKey
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserPreferencesQueryVariables,
  APITypes.ListUserPreferencesQuery
>;
