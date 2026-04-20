import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  ShoppingList: a
    .model({
      name: a.string().required(),
      userKey: a.string().required(),
      sortOrder: a.integer(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Category: a
    .model({
      name: a.string(),
      color: a.string(),
      listId: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  ListItem: a
    .model({
      name: a.string(),
      categoryId: a.string(),
      listId: a.string(),
      isCompleted: a.boolean(),
      quantity: a.integer(),
      sortOrder: a.integer(),
      priority: a.boolean().default(false),
      notes: a.string(),
      subtasks: a.json(),
      attachments: a.json(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  UserPreference: a
    .model({
      userKey: a.string(),
      theme: a.string(),
      sortMode: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});