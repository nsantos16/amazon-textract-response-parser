/**
 * Common shared utilities, interfaces, etc.
 */
import { ApiBlock, ApiBlockType, ApiDocumentMetadata } from "./api-models";
/**
 * Base class for all classes which wrap over an actual Textract API object.
 *
 * Exposes the underlying object for access as `dict`.
 */
export declare class ApiObjectWrapper<T> {
    _dict: T;
    constructor(dict: T);
    get dict(): T;
}
/**
 * Base class for classes which wrap over a Textract API 'Block' object.
 */
export declare class ApiBlockWrapper<T extends ApiBlock> extends ApiObjectWrapper<T> {
    get id(): string;
    get blockType(): ApiBlockType;
}
export declare class DocumentMetadata extends ApiObjectWrapper<ApiDocumentMetadata> {
    get nPages(): number;
}
/**
 * Utility function to create an iterable from a collection
 *
 * Input is a collection *fetching function*, rather than a direct collection, in case a user
 * re-uses the iterable after the parent object is mutated. For example:
 *
 * @example
 * const iterWords = line.iterWords(); // Implemented with getIterable(() => this._words)
 * let words = [...iterWords];
 * line._words = [];
 * let words = [...iterWords]; // Should return [] as expected
 */
export declare function getIterable<T>(collectionFetcher: () => T[]): Iterable<T>;
/**
 * Get the most common value in an Iterable of numbers
 */
export declare function modalAvg(arr: Iterable<number>): number | null;
/**
 * Interface for a (TextractDocument-like) object that can query Textract Blocks
 *
 * This is used to avoid circular references in child classes which need to reference some
 * TextractDocument-like parent, before the actual TextractDocument class is defined.
 */
export interface IDocBlocks {
    getBlockById: {
        (blockId: string): ApiBlock | undefined;
    };
    listBlocks: {
        (): ApiBlock[];
    };
}
/**
 * Interface for a (Page-like) object that references a parent document
 *
 * This is used to avoid circular references in child classes which need to reference some
 * Page-like parent, before the actual Page class is defined.
 */
export interface WithParentDocBlocks {
    readonly parentDocument: IDocBlocks;
}
