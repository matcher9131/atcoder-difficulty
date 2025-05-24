import { atom } from "jotai";
import { atomFamily, atomWithDefault } from "jotai/utils";
import distributionChunkLastIdsUrl from "../../../assets/distribution_chunk.json?url";

const encodedDistributionFiles = import.meta.glob("/assets/distributions/*.json");

const loadEncodedDistributionChunk = async (chunkIndex: number): Promise<Record<string, string>> => {
    const filename = `distribution${chunkIndex.toString()}.json`;
    const matchedKey = Object.keys(encodedDistributionFiles).find((key) => key.endsWith(filename));
    if (matchedKey == null) throw new Error(`${filename} is not found.`);
    return (await encodedDistributionFiles[matchedKey]()) as Record<string, string>;
};

const encodedDistributionChunkAtom = atomFamily((chunkIndex: number) =>
    atomWithDefault(async () => {
        const encodedChunk = await loadEncodedDistributionChunk(chunkIndex);
        return new Map(Object.entries(encodedChunk));
    }),
);

const loadDistributionChunkLastIds = async (): Promise<readonly string[]> => {
    const response = await fetch(distributionChunkLastIdsUrl);
    if (!response.ok) throw new Error("Failed loading distribution chunks.");
    const json = (await response.json()) as string[];
    return json;
};

const distributionChunkLastIds = atom(await loadDistributionChunkLastIds());

export const distributionAtom = atomFamily((problemId: string) =>
    atom((get) => {
        if (problemId === "") return new Uint8Array(0);

        let chunkIndex = 0;
        const lastIds = get(distributionChunkLastIds);
        for (; chunkIndex < lastIds.length; ++chunkIndex) {
            if (problemId.replaceAll("/", "~") < lastIds[chunkIndex]) break;
        }
        if (chunkIndex >= get(distributionChunkLastIds).length) throw new Error(`Invalid problemId: ${problemId}`);
        return get(encodedDistributionChunkAtom(chunkIndex)).then((encodedDistributionChunk) => {
            const encodedDistribution = encodedDistributionChunk.get(problemId);
            if (encodedDistribution == null) throw new Error(`Invalid problemId: ${problemId}`);
            return Uint8Array.from(atob(encodedDistribution), (ch) => ch.charCodeAt(0));
        });
    }),
);
