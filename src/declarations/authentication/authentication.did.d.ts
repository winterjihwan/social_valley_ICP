import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'query_secretProvided' : ActorMethod<[string], boolean>,
  'status_initialize' : ActorMethod<[string], boolean>,
  'update_secretProvided' : ActorMethod<[string, boolean], boolean>,
}
