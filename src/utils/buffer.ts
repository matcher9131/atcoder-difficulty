export const base64ToUint8Array = (base64: string): Uint8Array => {
    return new Uint8Array(
        atob(base64)
            .split("")
            .map((s) => s.charCodeAt(0)),
    );
};
