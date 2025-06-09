import { atom } from "jotai";
import type { UserNameValidationState } from "../types/userNameValidationState";

export const userNameAtom = atom("");

export const userNameValidationStateAtom = atom<UserNameValidationState>("none");

export const userNameValidationMessageAtom = atom("");
