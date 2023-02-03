/**
 * TRP classes for expense API results (e.g. AnalyzeExpense)
 */
import { ApiExpenseComponentDetection, ApiExpenseDocument, ApiExpenseField, ApiExpenseFieldType, ApiExpenseLineItem, ApiExpenseLineItemGroup } from "./api-models/expense";
import { ApiAnalyzeExpenseResponse } from "./api-models/response";
import { ApiObjectWrapper, DocumentMetadata } from "./base";
import { Geometry } from "./geometry";
export declare class ExpenseComponentDetection extends ApiObjectWrapper<ApiExpenseComponentDetection> {
    _geometry: Geometry<ApiExpenseComponentDetection, ExpenseComponentDetection>;
    _parentField: ExpenseField;
    constructor(dict: ApiExpenseComponentDetection, parentField: ExpenseField);
    get confidence(): number;
    set confidence(newVal: number);
    get geometry(): Geometry<ApiExpenseComponentDetection, ExpenseComponentDetection>;
    get parentField(): ExpenseField;
    get text(): string;
    set text(newVal: string);
}
export declare class ExpenseFieldType extends ApiObjectWrapper<ApiExpenseFieldType> {
    _parentField: ExpenseField;
    constructor(dict: ApiExpenseFieldType, parentField: ExpenseField);
    get confidence(): number;
    set confidence(newVal: number);
    get parentField(): ExpenseField;
    get text(): string;
    set text(newVal: string);
}
export declare class ExpenseField extends ApiObjectWrapper<ApiExpenseField> {
    _fieldType: ExpenseFieldType;
    _label: ExpenseComponentDetection | null;
    _parent: ExpenseDocument | ExpenseLineItem;
    _value: ExpenseComponentDetection;
    constructor(dict: ApiExpenseField, parent: ExpenseDocument | ExpenseLineItem);
    get fieldType(): ExpenseFieldType;
    get label(): ExpenseComponentDetection | null;
    get pageNumber(): number;
    get parent(): ExpenseDocument | ExpenseLineItem;
    get value(): ExpenseComponentDetection;
}
export declare class ExpenseLineItem extends ApiObjectWrapper<ApiExpenseLineItem> {
    _fields: ExpenseField[];
    _parentGroup: ExpenseLineItemGroup;
    constructor(dict: ApiExpenseLineItem, parentGroup: ExpenseLineItemGroup);
    get nFields(): number;
    get parentGroup(): ExpenseLineItemGroup;
    /**
     * Iterate through the fields in an expense line item
     * @example
     * for (const field of lineItem.iterFields()) {
     *   console.log(field.label.text);
     * }
     * @example
     * [...lineItem.iterFields()].forEach(
     *   (field) => console.log(field.label.text)
     * );
     */
    iterFields(): Iterable<ExpenseField>;
    listFields(): ExpenseField[];
    getFieldByType(fieldType: string): ExpenseField | null;
    searchFieldsByType(fieldType: string): ExpenseField[];
}
export declare class ExpenseLineItemGroup extends ApiObjectWrapper<ApiExpenseLineItemGroup> {
    _lineItems: ExpenseLineItem[];
    _parentDoc: ExpenseDocument;
    constructor(dict: ApiExpenseLineItemGroup, parentDoc: ExpenseDocument);
    /**
     * ONE-BASED index of this line item group within the parent expense document.
     */
    get index(): number;
    get nLineItems(): number;
    get parentDoc(): ExpenseDocument;
    /**
     * Iterate through the line items in the group
     * @example
     * for (const lineItem of group.iterLineItems()) {
     *   console.log(lineItem.nFields);
     * }
     * @example
     * [...group.iterLineItems()].forEach(
     *   (item) => console.log(item.nFields)
     * );
     */
    iterLineItems(): Iterable<ExpenseLineItem>;
    listLineItems(): ExpenseLineItem[];
}
export declare class ExpenseDocument extends ApiObjectWrapper<ApiExpenseDocument> {
    _lineItemGroups: ExpenseLineItemGroup[];
    _parentExpense: TextractExpense | null;
    _summaryFields: ExpenseField[];
    constructor(dict: ApiExpenseDocument, parentExpense?: TextractExpense | null);
    /**
     * ONE-BASED index of this expense document within the parent response object.
     */
    get index(): number;
    get nLineItemGroups(): number;
    get nSummaryFields(): number;
    get parentExpense(): TextractExpense | null;
    getSummaryFieldByType(fieldType: string): ExpenseField | null;
    searchSummaryFieldsByType(fieldType: string): ExpenseField[];
    /**
     * Iterate through the line item groups in the document
     * @example
     * for (const group of doc.iterLineItemGroups()) {
     *   console.log(group.nLineItems);
     * }
     * @example
     * [...doc.iterLineItemGroups()].forEach(
     *   (group) => console.log(group.nLineItems)
     * );
     */
    iterLineItemGroups(): Iterable<ExpenseLineItemGroup>;
    /**
     * Iterate through the expense summary fields in the document
     * @example
     * for (const field of doc.iterSummaryFields()) {
     *   console.log(field.label.text);
     * }
     * @example
     * [...doc.iterSummaryFields()].forEach(
     *   (field) => console.log(field.label.text)
     * );
     */
    iterSummaryFields(): Iterable<ExpenseField>;
    listLineItemGroups(): ExpenseLineItemGroup[];
    listSummaryFields(): ExpenseField[];
}
export declare class TextractExpense extends ApiObjectWrapper<ApiAnalyzeExpenseResponse> {
    _docs: ExpenseDocument[];
    _metadata: DocumentMetadata;
    constructor(textractResult: ApiAnalyzeExpenseResponse);
    get metadata(): DocumentMetadata;
    get nDocs(): number;
    /**
     * Iterate through the expense expense documents in the result
     * @example
     * for (const doc of expense.iterDocs()) {
     *   console.log(doc.nSummaryFields);
     * }
     * @example
     * [...expense.iterDocs()].forEach(
     *   (doc) => console.log(doc.nSummaryFields)
     * );
     */
    iterDocs(): Iterable<ExpenseDocument>;
    listDocs(): ExpenseDocument[];
}
