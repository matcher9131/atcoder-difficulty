import { UserNotFoundError } from "../types/fetchUserError";

type UserData = {
    readonly rating: number;
    readonly numContests: number;
};

export const fetchUser = async (userName: string): Promise<UserData> => {
    const response = await fetch(import.meta.env.VITE_FETCH_USER_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_FETCH_USER_API_KEY}`,
        },
        mode: "cors",
        body: JSON.stringify({ userName }),
    });

    if (response.ok) {
        const text = await response.text();
        if (text === "null") throw new UserNotFoundError();
        return JSON.parse(text) as UserData;
    } else {
        throw new Error("An error has occurred.");
    }
};
