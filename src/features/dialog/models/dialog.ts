import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const dialogIsOpenAtom = atomFamily((_id: string) => atom(false));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const dialogElementAtom = atomFamily((_id: string) => atom<HTMLDialogElement | null>(null));
