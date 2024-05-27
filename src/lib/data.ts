import { writable } from "svelte/store";

export const currentData = writable([])
export const last24h = writable([])
export const last7d = writable([])