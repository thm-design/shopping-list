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
` as GeneratedQuery<
  APITypes.GetListItemQueryVariables,
  APITypes.GetListItemQuery
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListListItemsQueryVariables,
  APITypes.ListListItemsQuery
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
