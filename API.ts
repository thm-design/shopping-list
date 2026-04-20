/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Category = {
  __typename: "Category",
  color?: string | null,
  createdAt: string,
  id: string,
  listId?: string | null,
  name?: string | null,
  updatedAt: string,
};

export type ListItem = {
  __typename: "ListItem",
  attachments?: string | null,
  categoryId?: string | null,
  createdAt: string,
  id: string,
  isCompleted?: boolean | null,
  listId?: string | null,
  name?: string | null,
  notes?: string | null,
  priority?: boolean | null,
  quantity?: number | null,
  sortOrder?: number | null,
  subtasks?: string | null,
  updatedAt: string,
};

export type ShoppingList = {
  __typename: "ShoppingList",
  createdAt: string,
  id: string,
  name: string,
  sortOrder?: number | null,
  updatedAt: string,
  userKey: string,
};

export type UserPreference = {
  __typename: "UserPreference",
  createdAt: string,
  id: string,
  sortMode?: string | null,
  theme?: string | null,
  updatedAt: string,
  userKey?: string | null,
};

export type ModelCategoryFilterInput = {
  and?: Array< ModelCategoryFilterInput | null > | null,
  color?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  listId?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelCategoryFilterInput | null,
  or?: Array< ModelCategoryFilterInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelCategoryConnection = {
  __typename: "ModelCategoryConnection",
  items:  Array<Category | null >,
  nextToken?: string | null,
};

export type ModelListItemFilterInput = {
  and?: Array< ModelListItemFilterInput | null > | null,
  attachments?: ModelStringInput | null,
  categoryId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  isCompleted?: ModelBooleanInput | null,
  listId?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelListItemFilterInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelListItemFilterInput | null > | null,
  priority?: ModelBooleanInput | null,
  quantity?: ModelIntInput | null,
  sortOrder?: ModelIntInput | null,
  subtasks?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelBooleanInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelIntInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelListItemConnection = {
  __typename: "ModelListItemConnection",
  items:  Array<ListItem | null >,
  nextToken?: string | null,
};

export type ModelShoppingListFilterInput = {
  and?: Array< ModelShoppingListFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelShoppingListFilterInput | null,
  or?: Array< ModelShoppingListFilterInput | null > | null,
  sortOrder?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
  userKey?: ModelStringInput | null,
};

export type ModelShoppingListConnection = {
  __typename: "ModelShoppingListConnection",
  items:  Array<ShoppingList | null >,
  nextToken?: string | null,
};

export type ModelUserPreferenceFilterInput = {
  and?: Array< ModelUserPreferenceFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelUserPreferenceFilterInput | null,
  or?: Array< ModelUserPreferenceFilterInput | null > | null,
  sortMode?: ModelStringInput | null,
  theme?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userKey?: ModelStringInput | null,
};

export type ModelUserPreferenceConnection = {
  __typename: "ModelUserPreferenceConnection",
  items:  Array<UserPreference | null >,
  nextToken?: string | null,
};

export type ModelCategoryConditionInput = {
  and?: Array< ModelCategoryConditionInput | null > | null,
  color?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  listId?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelCategoryConditionInput | null,
  or?: Array< ModelCategoryConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateCategoryInput = {
  color?: string | null,
  id?: string | null,
  listId?: string | null,
  name?: string | null,
};

export type ModelListItemConditionInput = {
  and?: Array< ModelListItemConditionInput | null > | null,
  attachments?: ModelStringInput | null,
  categoryId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  isCompleted?: ModelBooleanInput | null,
  listId?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelListItemConditionInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelListItemConditionInput | null > | null,
  priority?: ModelBooleanInput | null,
  quantity?: ModelIntInput | null,
  sortOrder?: ModelIntInput | null,
  subtasks?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateListItemInput = {
  attachments?: string | null,
  categoryId?: string | null,
  id?: string | null,
  isCompleted?: boolean | null,
  listId?: string | null,
  name?: string | null,
  notes?: string | null,
  priority?: boolean | null,
  quantity?: number | null,
  sortOrder?: number | null,
  subtasks?: string | null,
};

export type ModelShoppingListConditionInput = {
  and?: Array< ModelShoppingListConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelShoppingListConditionInput | null,
  or?: Array< ModelShoppingListConditionInput | null > | null,
  sortOrder?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
  userKey?: ModelStringInput | null,
};

export type CreateShoppingListInput = {
  id?: string | null,
  name: string,
  sortOrder?: number | null,
  userKey: string,
};

export type ModelUserPreferenceConditionInput = {
  and?: Array< ModelUserPreferenceConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  not?: ModelUserPreferenceConditionInput | null,
  or?: Array< ModelUserPreferenceConditionInput | null > | null,
  sortMode?: ModelStringInput | null,
  theme?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userKey?: ModelStringInput | null,
};

export type CreateUserPreferenceInput = {
  id?: string | null,
  sortMode?: string | null,
  theme?: string | null,
  userKey?: string | null,
};

export type DeleteCategoryInput = {
  id: string,
};

export type DeleteListItemInput = {
  id: string,
};

export type DeleteShoppingListInput = {
  id: string,
};

export type DeleteUserPreferenceInput = {
  id: string,
};

export type UpdateCategoryInput = {
  color?: string | null,
  id: string,
  listId?: string | null,
  name?: string | null,
};

export type UpdateListItemInput = {
  attachments?: string | null,
  categoryId?: string | null,
  id: string,
  isCompleted?: boolean | null,
  listId?: string | null,
  name?: string | null,
  notes?: string | null,
  priority?: boolean | null,
  quantity?: number | null,
  sortOrder?: number | null,
  subtasks?: string | null,
};

export type UpdateShoppingListInput = {
  id: string,
  name?: string | null,
  sortOrder?: number | null,
  userKey?: string | null,
};

export type UpdateUserPreferenceInput = {
  id: string,
  sortMode?: string | null,
  theme?: string | null,
  userKey?: string | null,
};

export type ModelSubscriptionCategoryFilterInput = {
  and?: Array< ModelSubscriptionCategoryFilterInput | null > | null,
  color?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  listId?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionCategoryFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionListItemFilterInput = {
  and?: Array< ModelSubscriptionListItemFilterInput | null > | null,
  attachments?: ModelSubscriptionStringInput | null,
  categoryId?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  isCompleted?: ModelSubscriptionBooleanInput | null,
  listId?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  notes?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionListItemFilterInput | null > | null,
  priority?: ModelSubscriptionBooleanInput | null,
  quantity?: ModelSubscriptionIntInput | null,
  sortOrder?: ModelSubscriptionIntInput | null,
  subtasks?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionBooleanInput = {
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelSubscriptionIntInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionShoppingListFilterInput = {
  and?: Array< ModelSubscriptionShoppingListFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionShoppingListFilterInput | null > | null,
  sortOrder?: ModelSubscriptionIntInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userKey?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionUserPreferenceFilterInput = {
  and?: Array< ModelSubscriptionUserPreferenceFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionUserPreferenceFilterInput | null > | null,
  sortMode?: ModelSubscriptionStringInput | null,
  theme?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userKey?: ModelSubscriptionStringInput | null,
};

export type GetCategoryQueryVariables = {
  id: string,
};

export type GetCategoryQuery = {
  getCategory?:  {
    __typename: "Category",
    color?: string | null,
    createdAt: string,
    id: string,
    listId?: string | null,
    name?: string | null,
    updatedAt: string,
  } | null,
};

export type GetListItemQueryVariables = {
  id: string,
};

export type GetListItemQuery = {
  getListItem?:  {
    __typename: "ListItem",
    attachments?: string | null,
    categoryId?: string | null,
    createdAt: string,
    id: string,
    isCompleted?: boolean | null,
    listId?: string | null,
    name?: string | null,
    notes?: string | null,
    priority?: boolean | null,
    quantity?: number | null,
    sortOrder?: number | null,
    subtasks?: string | null,
    updatedAt: string,
  } | null,
};

export type GetShoppingListQueryVariables = {
  id: string,
};

export type GetShoppingListQuery = {
  getShoppingList?:  {
    __typename: "ShoppingList",
    createdAt: string,
    id: string,
    name: string,
    sortOrder?: number | null,
    updatedAt: string,
    userKey: string,
  } | null,
};

export type GetUserPreferenceQueryVariables = {
  id: string,
};

export type GetUserPreferenceQuery = {
  getUserPreference?:  {
    __typename: "UserPreference",
    createdAt: string,
    id: string,
    sortMode?: string | null,
    theme?: string | null,
    updatedAt: string,
    userKey?: string | null,
  } | null,
};

export type ListCategoriesQueryVariables = {
  filter?: ModelCategoryFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCategoriesQuery = {
  listCategories?:  {
    __typename: "ModelCategoryConnection",
    items:  Array< {
      __typename: "Category",
      color?: string | null,
      createdAt: string,
      id: string,
      listId?: string | null,
      name?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListListItemsQueryVariables = {
  filter?: ModelListItemFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListListItemsQuery = {
  listListItems?:  {
    __typename: "ModelListItemConnection",
    items:  Array< {
      __typename: "ListItem",
      attachments?: string | null,
      categoryId?: string | null,
      createdAt: string,
      id: string,
      isCompleted?: boolean | null,
      listId?: string | null,
      name?: string | null,
      notes?: string | null,
      priority?: boolean | null,
      quantity?: number | null,
      sortOrder?: number | null,
      subtasks?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListShoppingListsQueryVariables = {
  filter?: ModelShoppingListFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListShoppingListsQuery = {
  listShoppingLists?:  {
    __typename: "ModelShoppingListConnection",
    items:  Array< {
      __typename: "ShoppingList",
      createdAt: string,
      id: string,
      name: string,
      sortOrder?: number | null,
      updatedAt: string,
      userKey: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUserPreferencesQueryVariables = {
  filter?: ModelUserPreferenceFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserPreferencesQuery = {
  listUserPreferences?:  {
    __typename: "ModelUserPreferenceConnection",
    items:  Array< {
      __typename: "UserPreference",
      createdAt: string,
      id: string,
      sortMode?: string | null,
      theme?: string | null,
      updatedAt: string,
      userKey?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CreateCategoryMutationVariables = {
  condition?: ModelCategoryConditionInput | null,
  input: CreateCategoryInput,
};

export type CreateCategoryMutation = {
  createCategory?:  {
    __typename: "Category",
    color?: string | null,
    createdAt: string,
    id: string,
    listId?: string | null,
    name?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateListItemMutationVariables = {
  condition?: ModelListItemConditionInput | null,
  input: CreateListItemInput,
};

export type CreateListItemMutation = {
  createListItem?:  {
    __typename: "ListItem",
    attachments?: string | null,
    categoryId?: string | null,
    createdAt: string,
    id: string,
    isCompleted?: boolean | null,
    listId?: string | null,
    name?: string | null,
    notes?: string | null,
    priority?: boolean | null,
    quantity?: number | null,
    sortOrder?: number | null,
    subtasks?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateShoppingListMutationVariables = {
  condition?: ModelShoppingListConditionInput | null,
  input: CreateShoppingListInput,
};

export type CreateShoppingListMutation = {
  createShoppingList?:  {
    __typename: "ShoppingList",
    createdAt: string,
    id: string,
    name: string,
    sortOrder?: number | null,
    updatedAt: string,
    userKey: string,
  } | null,
};

export type CreateUserPreferenceMutationVariables = {
  condition?: ModelUserPreferenceConditionInput | null,
  input: CreateUserPreferenceInput,
};

export type CreateUserPreferenceMutation = {
  createUserPreference?:  {
    __typename: "UserPreference",
    createdAt: string,
    id: string,
    sortMode?: string | null,
    theme?: string | null,
    updatedAt: string,
    userKey?: string | null,
  } | null,
};

export type DeleteCategoryMutationVariables = {
  condition?: ModelCategoryConditionInput | null,
  input: DeleteCategoryInput,
};

export type DeleteCategoryMutation = {
  deleteCategory?:  {
    __typename: "Category",
    color?: string | null,
    createdAt: string,
    id: string,
    listId?: string | null,
    name?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteListItemMutationVariables = {
  condition?: ModelListItemConditionInput | null,
  input: DeleteListItemInput,
};

export type DeleteListItemMutation = {
  deleteListItem?:  {
    __typename: "ListItem",
    attachments?: string | null,
    categoryId?: string | null,
    createdAt: string,
    id: string,
    isCompleted?: boolean | null,
    listId?: string | null,
    name?: string | null,
    notes?: string | null,
    priority?: boolean | null,
    quantity?: number | null,
    sortOrder?: number | null,
    subtasks?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteShoppingListMutationVariables = {
  condition?: ModelShoppingListConditionInput | null,
  input: DeleteShoppingListInput,
};

export type DeleteShoppingListMutation = {
  deleteShoppingList?:  {
    __typename: "ShoppingList",
    createdAt: string,
    id: string,
    name: string,
    sortOrder?: number | null,
    updatedAt: string,
    userKey: string,
  } | null,
};

export type DeleteUserPreferenceMutationVariables = {
  condition?: ModelUserPreferenceConditionInput | null,
  input: DeleteUserPreferenceInput,
};

export type DeleteUserPreferenceMutation = {
  deleteUserPreference?:  {
    __typename: "UserPreference",
    createdAt: string,
    id: string,
    sortMode?: string | null,
    theme?: string | null,
    updatedAt: string,
    userKey?: string | null,
  } | null,
};

export type UpdateCategoryMutationVariables = {
  condition?: ModelCategoryConditionInput | null,
  input: UpdateCategoryInput,
};

export type UpdateCategoryMutation = {
  updateCategory?:  {
    __typename: "Category",
    color?: string | null,
    createdAt: string,
    id: string,
    listId?: string | null,
    name?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateListItemMutationVariables = {
  condition?: ModelListItemConditionInput | null,
  input: UpdateListItemInput,
};

export type UpdateListItemMutation = {
  updateListItem?:  {
    __typename: "ListItem",
    attachments?: string | null,
    categoryId?: string | null,
    createdAt: string,
    id: string,
    isCompleted?: boolean | null,
    listId?: string | null,
    name?: string | null,
    notes?: string | null,
    priority?: boolean | null,
    quantity?: number | null,
    sortOrder?: number | null,
    subtasks?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateShoppingListMutationVariables = {
  condition?: ModelShoppingListConditionInput | null,
  input: UpdateShoppingListInput,
};

export type UpdateShoppingListMutation = {
  updateShoppingList?:  {
    __typename: "ShoppingList",
    createdAt: string,
    id: string,
    name: string,
    sortOrder?: number | null,
    updatedAt: string,
    userKey: string,
  } | null,
};

export type UpdateUserPreferenceMutationVariables = {
  condition?: ModelUserPreferenceConditionInput | null,
  input: UpdateUserPreferenceInput,
};

export type UpdateUserPreferenceMutation = {
  updateUserPreference?:  {
    __typename: "UserPreference",
    createdAt: string,
    id: string,
    sortMode?: string | null,
    theme?: string | null,
    updatedAt: string,
    userKey?: string | null,
  } | null,
};

export type OnCreateCategorySubscriptionVariables = {
  filter?: ModelSubscriptionCategoryFilterInput | null,
};

export type OnCreateCategorySubscription = {
  onCreateCategory?:  {
    __typename: "Category",
    color?: string | null,
    createdAt: string,
    id: string,
    listId?: string | null,
    name?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateListItemSubscriptionVariables = {
  filter?: ModelSubscriptionListItemFilterInput | null,
};

export type OnCreateListItemSubscription = {
  onCreateListItem?:  {
    __typename: "ListItem",
    attachments?: string | null,
    categoryId?: string | null,
    createdAt: string,
    id: string,
    isCompleted?: boolean | null,
    listId?: string | null,
    name?: string | null,
    notes?: string | null,
    priority?: boolean | null,
    quantity?: number | null,
    sortOrder?: number | null,
    subtasks?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateShoppingListSubscriptionVariables = {
  filter?: ModelSubscriptionShoppingListFilterInput | null,
};

export type OnCreateShoppingListSubscription = {
  onCreateShoppingList?:  {
    __typename: "ShoppingList",
    createdAt: string,
    id: string,
    name: string,
    sortOrder?: number | null,
    updatedAt: string,
    userKey: string,
  } | null,
};

export type OnCreateUserPreferenceSubscriptionVariables = {
  filter?: ModelSubscriptionUserPreferenceFilterInput | null,
};

export type OnCreateUserPreferenceSubscription = {
  onCreateUserPreference?:  {
    __typename: "UserPreference",
    createdAt: string,
    id: string,
    sortMode?: string | null,
    theme?: string | null,
    updatedAt: string,
    userKey?: string | null,
  } | null,
};

export type OnDeleteCategorySubscriptionVariables = {
  filter?: ModelSubscriptionCategoryFilterInput | null,
};

export type OnDeleteCategorySubscription = {
  onDeleteCategory?:  {
    __typename: "Category",
    color?: string | null,
    createdAt: string,
    id: string,
    listId?: string | null,
    name?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteListItemSubscriptionVariables = {
  filter?: ModelSubscriptionListItemFilterInput | null,
};

export type OnDeleteListItemSubscription = {
  onDeleteListItem?:  {
    __typename: "ListItem",
    attachments?: string | null,
    categoryId?: string | null,
    createdAt: string,
    id: string,
    isCompleted?: boolean | null,
    listId?: string | null,
    name?: string | null,
    notes?: string | null,
    priority?: boolean | null,
    quantity?: number | null,
    sortOrder?: number | null,
    subtasks?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteShoppingListSubscriptionVariables = {
  filter?: ModelSubscriptionShoppingListFilterInput | null,
};

export type OnDeleteShoppingListSubscription = {
  onDeleteShoppingList?:  {
    __typename: "ShoppingList",
    createdAt: string,
    id: string,
    name: string,
    sortOrder?: number | null,
    updatedAt: string,
    userKey: string,
  } | null,
};

export type OnDeleteUserPreferenceSubscriptionVariables = {
  filter?: ModelSubscriptionUserPreferenceFilterInput | null,
};

export type OnDeleteUserPreferenceSubscription = {
  onDeleteUserPreference?:  {
    __typename: "UserPreference",
    createdAt: string,
    id: string,
    sortMode?: string | null,
    theme?: string | null,
    updatedAt: string,
    userKey?: string | null,
  } | null,
};

export type OnUpdateCategorySubscriptionVariables = {
  filter?: ModelSubscriptionCategoryFilterInput | null,
};

export type OnUpdateCategorySubscription = {
  onUpdateCategory?:  {
    __typename: "Category",
    color?: string | null,
    createdAt: string,
    id: string,
    listId?: string | null,
    name?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateListItemSubscriptionVariables = {
  filter?: ModelSubscriptionListItemFilterInput | null,
};

export type OnUpdateListItemSubscription = {
  onUpdateListItem?:  {
    __typename: "ListItem",
    attachments?: string | null,
    categoryId?: string | null,
    createdAt: string,
    id: string,
    isCompleted?: boolean | null,
    listId?: string | null,
    name?: string | null,
    notes?: string | null,
    priority?: boolean | null,
    quantity?: number | null,
    sortOrder?: number | null,
    subtasks?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateShoppingListSubscriptionVariables = {
  filter?: ModelSubscriptionShoppingListFilterInput | null,
};

export type OnUpdateShoppingListSubscription = {
  onUpdateShoppingList?:  {
    __typename: "ShoppingList",
    createdAt: string,
    id: string,
    name: string,
    sortOrder?: number | null,
    updatedAt: string,
    userKey: string,
  } | null,
};

export type OnUpdateUserPreferenceSubscriptionVariables = {
  filter?: ModelSubscriptionUserPreferenceFilterInput | null,
};

export type OnUpdateUserPreferenceSubscription = {
  onUpdateUserPreference?:  {
    __typename: "UserPreference",
    createdAt: string,
    id: string,
    sortMode?: string | null,
    theme?: string | null,
    updatedAt: string,
    userKey?: string | null,
  } | null,
};
