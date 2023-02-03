/**
 * TRP classes for identity document API results (e.g. AnalyzeID)
 */
import { ApiIdentityDocument, ApiIdentityDocumentField } from "./api-models/id";
import { ApiAnalyzeIdResponse } from "./api-models/response";
import { ApiObjectWrapper } from "./base";
/**
 * Enum of Textract identity document field types recognised by TRP.js
 *
 * Any unrecognised types will be mapped to `Other`.
 *
 * https://docs.aws.amazon.com/textract/latest/dg/identitydocumentfields.html
 */
export declare enum IdFieldType {
    FirstName = "FIRST_NAME",
    LastName = "LAST_NAME",
    MiddleName = "MIDDLE_NAME",
    Suffix = "SUFFIX",
    AddressCity = "CITY_IN_ADDRESS",
    AddressZipCode = "ZIP_CODE_IN_ADDRESS",
    AddressState = "STATE_IN_ADDRESS",
    StateName = "STATE_NAME",
    DocumentNumber = "DOCUMENT_NUMBER",
    ExpirationDate = "EXPIRATION_DATE",
    DateOfBirth = "DATE_OF_BIRTH",
    DateOfIssue = "DATE_OF_ISSUE",
    IdType = "ID_TYPE",
    Endorsements = "ENDORSEMENTS",
    Veteran = "VETERAN",
    Restrictions = "RESTRICTIONS",
    Class = "CLASS",
    Address = "ADDRESS",
    County = "COUNTY",
    PlaceOfBirth = "PLACE_OF_BIRTH",
    Other = "OTHER"
}
/**
 * Enum of Textract identity document field *data* types recognised by TRP.js
 *
 * This refers to the actual data type of the value (e.g. date vs other) rather than the field type (e.g.
 * expiration date vs date of issue).
 *
 * https://docs.aws.amazon.com/textract/latest/dg/identitydocumentfields.html
 */
export declare const enum IdFieldValueType {
    Date = "DATE",
    Other = "OTHER"
}
/**
 * Enum of TRP-recognised ID document types (known values for ID_TYPE fields)
 */
export declare enum IdDocumentType {
    DrivingLicense = "DRIVER LICENSE FRONT",
    Passport = "PASSPORT",
    Other = "OTHER"
}
export declare class IdDocumentField extends ApiObjectWrapper<ApiIdentityDocumentField> {
    _parentDocument?: IdDocument;
    constructor(dict: ApiIdentityDocumentField, parentDocument?: IdDocument | undefined);
    get isValueNormalized(): boolean;
    /**
     * Raw "field type" from Amazon Textract
     */
    get fieldTypeRaw(): string | undefined;
    /**
     * TRP-normalized "field type"
     */
    get fieldType(): IdFieldType;
    /**
     * Identity document to which this field object belongs
     */
    get parentDocument(): IdDocument | undefined;
    /**
     * Value of the field, normalized if applicable
     */
    get value(): string;
    get valueConfidence(): number;
    /**
     * Raw value of the field without any normalization
     */
    get valueRaw(): string | undefined;
    /**
     * TRP-normalized data "type" for this field
     */
    get valueType(): IdFieldValueType;
    /**
     * Produce a human-readable string representation of this detected field
     */
    str(): string;
}
export declare class IdDocument extends ApiObjectWrapper<ApiIdentityDocument> {
    _fields: IdDocumentField[];
    _fieldsByNormalizedType: {
        [key in IdFieldType]?: IdDocumentField;
    };
    _parentResult?: TextractIdentity;
    constructor(dict: ApiIdentityDocument, parentResult?: TextractIdentity | undefined);
    get index(): number;
    /**
     * Detected type of this identity document
     */
    get idType(): IdDocumentType;
    get nFields(): number;
    /**
     * Parent API result this document belongs to
     */
    get parentCollection(): TextractIdentity | undefined;
    getFieldByType(fieldType: IdFieldType): IdDocumentField | undefined;
    /**
     * Iterate through the detected fields in this identity document
     * @param skipFieldsWithoutKey Set `true` to skip fields with no field.key (Included by default)
     * @example
     * for (const idDoc of result.iterDocuments()) {
     *   console.log(idDoc.nFields);
     * }
     * @example
     * const idDocs = [...result.iterDocuments()];
     */
    iterFields(): Iterable<IdDocumentField>;
    /**
     * List the detected fields in this identity document
     */
    listFields(): IdDocumentField[];
    /**
     * Produce a human-readable string representation of the ID document
     */
    str(): string;
}
export declare class TextractIdentity extends ApiObjectWrapper<ApiAnalyzeIdResponse> {
    _documents: IdDocument[];
    constructor(dict: ApiAnalyzeIdResponse);
    get modelVersion(): string;
    /**
     * Number of identity documents in this API result
     */
    get nDocuments(): number;
    get nPages(): number;
    /**
     * Get a particular identity document from the result by (0-based) index
     * @throws Error if index is out of bounds 0 <= index < nDocuments
     */
    getDocAtIndex(index: number): IdDocument;
    /**
     * Iterate through the identity documents in the result
     * @param skipFieldsWithoutKey Set `true` to skip fields with no field.key (Included by default)
     * @example
     * for (const idDoc of result.iterDocuments()) {
     *   console.log(idDoc.nFields);
     * }
     * @example
     * const idDocs = [...result.iterDocuments()];
     */
    iterDocuments(): Iterable<IdDocument>;
    /**
     * List the identity documents in the result
     */
    listDocuments(): IdDocument[];
    /**
     * Produce a human-readable string representation of the AnalyzeId response
     */
    str(): string;
}
