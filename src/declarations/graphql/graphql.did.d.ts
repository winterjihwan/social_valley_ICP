import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'graphql_mutation' : ActorMethod<[string, string], string>,
  'graphql_query' : ActorMethod<[string, string], string>,
}
