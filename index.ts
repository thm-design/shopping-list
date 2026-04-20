import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";
import { initSchema } from "@aws-amplify/datastore";

import { schema } from "./schema";



type EagerShoppingListModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ShoppingList, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly userKey: string;
  readonly sortOrder?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyShoppingListModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ShoppingList, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly userKey: string;
  readonly sortOrder?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ShoppingListModel = LazyLoading extends LazyLoadingDisabled ? EagerShoppingListModel : LazyShoppingListModel

export declare const ShoppingListModel: (new (init: ModelInit<ShoppingListModel>) => ShoppingListModel) & {
  copyOf(source: ShoppingListModel, mutator: (draft: MutableModel<ShoppingListModel>) => MutableModel<ShoppingListModel> | void): ShoppingListModel;
}

type EagerCategoryModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Category, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly color?: string | null;
  readonly listId?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCategoryModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Category, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly color?: string | null;
  readonly listId?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type CategoryModel = LazyLoading extends LazyLoadingDisabled ? EagerCategoryModel : LazyCategoryModel

export declare const CategoryModel: (new (init: ModelInit<CategoryModel>) => CategoryModel) & {
  copyOf(source: CategoryModel, mutator: (draft: MutableModel<CategoryModel>) => MutableModel<CategoryModel> | void): CategoryModel;
}

type EagerListItemModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ListItem, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly categoryId?: string | null;
  readonly listId?: string | null;
  readonly isCompleted?: boolean | null;
  readonly quantity?: number | null;
  readonly sortOrder?: number | null;
  readonly priority?: boolean | null;
  readonly notes?: string | null;
  readonly subtasks?: string | null;
  readonly attachments?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyListItemModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ListItem, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly categoryId?: string | null;
  readonly listId?: string | null;
  readonly isCompleted?: boolean | null;
  readonly quantity?: number | null;
  readonly sortOrder?: number | null;
  readonly priority?: boolean | null;
  readonly notes?: string | null;
  readonly subtasks?: string | null;
  readonly attachments?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ListItemModel = LazyLoading extends LazyLoadingDisabled ? EagerListItemModel : LazyListItemModel

export declare const ListItemModel: (new (init: ModelInit<ListItemModel>) => ListItemModel) & {
  copyOf(source: ListItemModel, mutator: (draft: MutableModel<ListItemModel>) => MutableModel<ListItemModel> | void): ListItemModel;
}

type EagerUserPreferenceModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserPreference, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userKey?: string | null;
  readonly theme?: string | null;
  readonly sortMode?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUserPreferenceModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserPreference, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userKey?: string | null;
  readonly theme?: string | null;
  readonly sortMode?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type UserPreferenceModel = LazyLoading extends LazyLoadingDisabled ? EagerUserPreferenceModel : LazyUserPreferenceModel

export declare const UserPreferenceModel: (new (init: ModelInit<UserPreferenceModel>) => UserPreferenceModel) & {
  copyOf(source: UserPreferenceModel, mutator: (draft: MutableModel<UserPreferenceModel>) => MutableModel<UserPreferenceModel> | void): UserPreferenceModel;
}



const { ShoppingList, Category, ListItem, UserPreference } = initSchema(schema) as {
  ShoppingList: PersistentModelConstructor<ShoppingListModel>;
  Category: PersistentModelConstructor<CategoryModel>;
  ListItem: PersistentModelConstructor<ListItemModel>;
  UserPreference: PersistentModelConstructor<UserPreferenceModel>;
};

export {
  ShoppingList,
  Category,
  ListItem,
  UserPreference
};