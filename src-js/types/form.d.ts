/**
 * TRP classes for (generic document) key-value form objects
 */
import { ApiKeyValueSetBlock } from "./api-models/document";
import { ApiBlockWrapper, IDocBlocks, WithParentDocBlocks } from "./base";
import { SelectionElement, Word } from "./content";
import { Geometry } from "./geometry";
declare const FieldKeyGeneric_base: {
    new (...args: any[]): {
        _words: Word[];
        readonly nWords: number;
        iterWords(): Iterable<Word>;
        listWords(): Word[];
        wordAtIndex(ix: number): Word;
    };
} & typeof ApiBlockWrapper;
/**
 * Generic base class for a FieldKey, as the parent Page is not defined here.
 *
 * If you're consuming this library, you probably just want to use `document.ts/FieldKey`.
 */
export declare class FieldKeyGeneric<TPage extends WithParentDocBlocks> extends FieldKeyGeneric_base<ApiKeyValueSetBlock> {
    _geometry: Geometry<ApiKeyValueSetBlock, FieldKeyGeneric<TPage>>;
    _parentField: FieldGeneric<TPage>;
    constructor(block: ApiKeyValueSetBlock, parentField: FieldGeneric<TPage>);
    get confidence(): number;
    get geometry(): Geometry<ApiKeyValueSetBlock, FieldKeyGeneric<TPage>>;
    get parentField(): FieldGeneric<TPage>;
    get text(): string;
    str(): string;
}
/**
 * Generic base class for a FieldValue, as the parent Page is not defined here.
 *
 * If you're consuming this library, you probably just want to use `document.ts/FieldValue`.
 */
export declare class FieldValueGeneric<TPage extends WithParentDocBlocks> extends ApiBlockWrapper<ApiKeyValueSetBlock> {
    _content: Array<SelectionElement | Word>;
    _geometry: Geometry<ApiKeyValueSetBlock, FieldValueGeneric<TPage>>;
    _parentField: FieldGeneric<TPage>;
    constructor(valueBlock: ApiKeyValueSetBlock, parentField: FieldGeneric<TPage>);
    get confidence(): number;
    get geometry(): Geometry<ApiKeyValueSetBlock, FieldValueGeneric<TPage>>;
    get parentField(): FieldGeneric<TPage>;
    get text(): string;
    listContent(): Array<SelectionElement | Word>;
    str(): string;
}
/**
 * Generic base class for a Field, as the parent Page is not defined here.
 *
 * If you're consuming this library, you probably just want to use `document.ts/Field`.
 */
export declare class FieldGeneric<TPage extends WithParentDocBlocks> {
    _key: FieldKeyGeneric<TPage>;
    _parentForm: FormGeneric<TPage>;
    _value: FieldValueGeneric<TPage> | null;
    constructor(keyBlock: ApiKeyValueSetBlock, parentForm: FormGeneric<TPage>);
    /**
     * Return average confidence over whichever of {key, value} are present.
     */
    get confidence(): number;
    get key(): FieldKeyGeneric<TPage>;
    get parentForm(): FormGeneric<TPage>;
    get parentPage(): TPage;
    get value(): FieldValueGeneric<TPage> | null;
    str(): string;
}
/**
 * Generic class for a Form, as the parent Page is not defined here.
 *
 * If you're consuming this library, you probably just want to use `document.ts/Form`.
 */
export declare class FormGeneric<TPage extends WithParentDocBlocks> {
    _fields: FieldGeneric<TPage>[];
    _fieldsMap: {
        [keyText: string]: FieldGeneric<TPage>;
    };
    _parentPage: TPage;
    constructor(keyBlocks: ApiKeyValueSetBlock[], parentPage: TPage);
    get nFields(): number;
    get parentPage(): TPage;
    getFieldByKey(key: string): FieldGeneric<TPage> | null;
    /**
     * Iterate through the Fields in the Form.
     * @param skipFieldsWithoutKey Set `true` to skip fields with no field.key (Included by default)
     * @example
     * for (const field of form.iterFields()) {
     *   console.log(field?.key.text);
     * }
     * @example
     * const fields = [...form.iterFields()];
     */
    iterFields(skipFieldsWithoutKey?: boolean): Iterable<FieldGeneric<TPage>>;
    /**
     * List the Fields in the Form.
     * @param skipFieldsWithoutKey Set `true` to skip fields with no field.key (Included by default)
     */
    listFields(skipFieldsWithoutKey?: boolean): FieldGeneric<TPage>[];
    /**
     * List the Fields in the Form with key text containing (case-insensitive) `key`
     * @param key The text to search for in field keys
     */
    searchFieldsByKey(key: string): FieldGeneric<TPage>[];
    str(): string;
}
/**
 * Generic base class for a composite of multiple Forms, as Page and TextractDocument are not defined here.
 *
 * If you're consuming this library, you probably just want to use `document.ts/FormsComposite`.
 *
 * While a Form is associated with a particular page, the FormsComposite class exposes a similar interface
 * for querying detected fields across all pages of the document at once. In general, results are analyzed
 * and presented in page order.
 */
export declare class FormsCompositeGeneric<TPage extends WithParentDocBlocks, TDocument extends IDocBlocks> {
    _forms: FormGeneric<TPage>[];
    _parentDocument: TDocument;
    constructor(forms: FormGeneric<TPage>[], parentDocument: TDocument);
    get nFields(): number;
    get parentDocument(): TDocument;
    getFieldByKey(key: string): FieldGeneric<TPage> | null;
    /**
     * Iterate through the Fields in all Forms.
     * @param skipFieldsWithoutKey Set `true` to skip fields with no field.key (Included by default)
     * @example
     * for (const field of form.iterFields()) {
     *   console.log(field?.key.text);
     * }
     * @example
     * const fields = [...form.iterFields()];
     */
    iterFields(skipFieldsWithoutKey?: boolean): Iterable<FieldGeneric<TPage>>;
    /**
     * List the Fields in all Forms.
     * @param skipFieldsWithoutKey Set `true` to skip fields with no field.key (Included by default)
     */
    listFields(skipFieldsWithoutKey?: boolean): FieldGeneric<TPage>[];
    /**
     * List the Fields in the Form with key text containing (case-insensitive) `key`
     * @param key The text to search for in field keys
     */
    searchFieldsByKey(key: string): FieldGeneric<TPage>[];
    str(): string;
}
export {};
