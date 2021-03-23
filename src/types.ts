import * as t from "io-ts";

export const Entity = t.keyof({ walmart: null });
export type Entity = t.TypeOf<typeof Entity>;

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

export const EntityAppointments = t.type({
  entity: Entity,
  appointments: Appointment,
});
export type EntityAppointments = t.TypeOf<typeof EntityAppointments>;
