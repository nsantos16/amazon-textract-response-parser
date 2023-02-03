/**
 * TRP classes for (generic document) low-level content objects
 */
import { ApiLineBlock, ApiSelectionElementBlock, ApiSelectionStatus, ApiTextType, ApiWordBlock } from "./api-models/document";
import { ApiBlockWrapper, WithParentDocBlocks } from "./base";
import { Geometry } from "./geometry";
type Constructor<T> = new (...args: any[]) => T;
export declare class Word extends ApiBlockWrapper<ApiWordBlock> {
    _geometry: Geometry<ApiWordBlock, Word>;
    constructor(block: ApiWordBlock);
    get confidence(): number;
    set confidence(newVal: number);
    get geometry(): Geometry<ApiWordBlock, Word>;
    get text(): string;
    get textType(): ApiTextType;
    set textType(newVal: ApiTextType);
    str(): string;
}
export declare function WithWords<T extends Constructor<{}>>(SuperClass: T): {
    new (...args: any[]): {
        _words: Word[];
        readonly nWords: number;
        /**
         * Iterate through the Words in this object
         * @example
         * for (const word of line.iterWords) {
         *   console.log(word.text);
         * }
         * @example
         * [...line.iterWords()].forEach(
         *   (word) => console.log(word.text)
         * );
         */
        iterWords(): Iterable<Word>;
        listWords(): Word[];
        /**
         * Get a particular Word from the object by index
         * @param ix 0-based index in the word list
         * @throws if the index is out of bounds
         */
        wordAtIndex(ix: number): Word;
    };
} & T;
declare const LineGeneric_base: {
    new (...args: any[]): {
        _words: Word[];
        readonly nWords: number;
        /**
         * Iterate through the Words in this object
         * @example
         * for (const word of line.iterWords) {
         *   console.log(word.text);
         * }
         * @example
         * [...line.iterWords()].forEach(
         *   (word) => console.log(word.text)
         * );
         */
        iterWords(): Iterable<Word>;
        listWords(): Word[];
        /**
         * Get a particular Word from the object by index
         * @param ix 0-based index in the word list
         * @throws if the index is out of bounds
         */
        wordAtIndex(ix: number): Word;
    };
} & typeof ApiBlockWrapper;
/**
 * Generic base class for a Line, as the parent Page is not defined here.
 *
 * If you're consuming this library, you probably just want to use `document.ts/Line`.
 */
export declare class LineGeneric<TPage extends WithParentDocBlocks> extends LineGeneric_base<ApiLineBlock> {
    _geometry: Geometry<ApiLineBlock, LineGeneric<TPage>>;
    _parentPage: TPage;
    constructor(block: ApiLineBlock, parentPage: TPage);
    get confidence(): number;
    set confidence(newVal: number);
    get geometry(): Geometry<ApiLineBlock, LineGeneric<TPage>>;
    get parentPage(): TPage;
    get text(): string;
    str(): string;
}
export declare class SelectionElement extends ApiBlockWrapper<ApiSelectionElementBlock> {
    _geometry: Geometry<ApiSelectionElementBlock, SelectionElement>;
    constructor(block: ApiSelectionElementBlock);
    get confidence(): number;
    set confidence(newVal: number);
    get geometry(): Geometry<ApiSelectionElementBlock, SelectionElement>;
    get selectionStatus(): ApiSelectionStatus;
    set selectionStatus(newVal: ApiSelectionStatus);
}
export {};
