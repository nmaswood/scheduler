import * as t from "io-ts";

export const State = t.keyof({ CT: null });
export type State = t.TypeOf<typeof State>;

export const Store = t.type({
  id: t.string,
  displayName: t.string,
});

export type Store = t.TypeOf<typeof Store>;

export type Appointment = t.TypeOf<typeof Appointment>;

export const Appointment = t.type({
  storeId: t.string,
  time: t.string,
});

export interface Result {
  stores: Store[];
  appointments: Appointment[];
}
