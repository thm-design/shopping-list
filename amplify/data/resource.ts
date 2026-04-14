import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Category: a
    .model({
      name: a.string(),
      color: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  ListItem: a
    .model({
      name: a.string(),
      categoryId: a.string(),
      isCompleted: a.boolean(),
      quantity: a.integer(),
      sortOrder: a.integer(),
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
