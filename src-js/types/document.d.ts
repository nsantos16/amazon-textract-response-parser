/**
 * TRP classes for standard document/OCR results (e.g. DetectText and AnalyzeDocument)
 */
import { ApiBlock, ApiCellBlock, ApiMergedCellBlock, ApiPageBlock } from "./api-models/document";
import { ApiResponsePage, ApiResponsePages, ApiResponseWithContent } from "./api-models/response";
import { ApiBlockWrapper, ApiObjectWrapper, IDocBlocks, WithParentDocBlocks } from "./base";
import { LineGeneric } from "./content";
import { FieldGeneric, FieldKeyGeneric, FieldValueGeneric, FormsCompositeGeneric, FormGeneric } from "./form";
import { BoundingBox, Geometry } from "./geometry";
import { CellBaseGeneric, CellGeneric, MergedCellGeneric, RowGeneric, TableGeneric } from "./table";
export { ApiBlockWrapper } from "./base";
export { SelectionElement, Word } from "./content";
/**
 * @experimental
 */
export interface HeuristicReadingOrderModelParams {
    /**
     * Minimum ratio (0-1) of overlap to count a paragraph within a detected column. Applied relative
     * to the *minimum* of {paragraph width, column width}. Can set close to 1 if your columns are
     * well-defined with little skew and no hanging indents.
     */
    colHOverlapThresh?: number;
    /**
     * Minimum ratio (0-1) of intersection to count a paragraph within a detected column. Applied
     * relative to the *union* of {paragraph, column} horizontal span, and *only* when both the
     * paragraph and column contain multiple lines (since single-line paragraphs may be significantly
     * short). Can set close to 1 if your text is justified, since individual paragraphs in a column
     * should have reliably very similar widths.
     */
    colHMultilineUnionThresh?: number;
    /**
     * Maximum vertical distance, in multiples of line height, for a line to be considered eligible
     * for merging into a paragraph. 1.0 may make a sensible default. May set >1.0 if your text has
     * large spacing between lines within a paragraph, or <1.0 if your paragraphs have little
     * vertical separating space between them.
     */
    paraVDistTol?: number;
    /**
     * Maximum ratio of deviation of this line height from average line height in a paragraph, for a
     * line to be considered eligible for merging into a paragraph. Set close to 0 to encourage text
     * size changes to be represented as paragraph breaks (e.g. close-together heading/subheading).
     */
    paraLineHeightTol?: number;
    /**
     * Optional maximum indentation of a line versus previous, after which the line will be forced
     * into a new paragraph even if vertical distance is small. Set =0 to disable this behavior (for
     * e.g. with center-aligned text or where paragraphs are marked by vertical whitespace), or >0 to
     * specify paragraph indentation in terms of a multiplier on text line-height. Default 0.
     */
    paraIndentThresh?: number;
}
/**
 * @experimental
 */
export interface HeaderFooterSegmentModelParams {
    /**
     * Cut-off maximum proportion of the page height that the header/footer must be within. Set close
     * to 0 if main content is known to start very close to the page edge, or higher to allow more
     * space for the header/footer search. Default 0.16 (16% page height).
     * @default 0.16 (16% page height)
     */
    maxMargin?: number;
    /**
     * Minimum vertical spacing between header/footer and main page content, as a proportion of
     * average local text LINE height. The header/footer will break on the first gap bigger than
     * this, working in from the edge of the page towards content. Set close to 0 if the main content
     * is known to start very close, or higher if multiple vertically-separate paragraphs/lines
     * should be captured in the header/footer. Default 0.8 (80% line height).
     * @default 0.8 (80% line height)
     */
    minGap?: number;
}
export declare class Page extends ApiBlockWrapper<ApiPageBlock> implements WithParentDocBlocks {
    _blocks: ApiBlock[];
    _content: Array<LineGeneric<Page> | TableGeneric<Page> | FieldGeneric<Page>>;
    _form: FormGeneric<Page>;
    _geometry: Geometry<ApiPageBlock, Page>;
    _lines: LineGeneric<Page>[];
    _parentDocument: TextractDocument;
    _tables: TableGeneric<Page>[];
    constructor(pageBlock: ApiPageBlock, blocks: ApiBlock[], parentDocument: TextractDocument);
    _parse(blocks: ApiBlock[]): void;
    /**
     * Calculate the most common orientation (in whole degrees) of 'WORD' content in the page.
     */
    getModalWordOrientationDegrees(): number | null;
    /**
     * List lines in reading order, grouped by pseudo-'paragraph' and contiguous 'column'
     * @returns Nested array of text lines by column, paragraph, line
     * @private
     */
    _getLineClustersByColumn({ colHOverlapThresh, colHMultilineUnionThresh, paraVDistTol, paraLineHeightTol, paraIndentThresh, }?: HeuristicReadingOrderModelParams): LineGeneric<Page>[][][];
    /**
     * List lines in reading order, grouped by 'cluster' (somewhat like a paragraph)
     *
     * This method works by applying local heuristics to group text together into paragraphs, and then sorting
     * paragraphs into "columns" in reading order. Although parameters are exposed to customize the behaviour,
     * note that this customization API is experimental and subject to change. For complex requirements,
     * consider implementing your own more robust approach - perhaps using expected global page structure.
     *
     * @returns Nested array of text lines by paragraph, line
     */
    getLineClustersInReadingOrder({ colHOverlapThresh, colHMultilineUnionThresh, paraVDistTol, paraLineHeightTol, paraIndentThresh, }?: HeuristicReadingOrderModelParams): LineGeneric<Page>[][];
    getTextInReadingOrder({ colHOverlapThresh, colHMultilineUnionThresh, paraVDistTol, paraLineHeightTol, paraIndentThresh, }?: HeuristicReadingOrderModelParams): string;
    /**
     * Split lines of text into vertically contiguous groups, and describe the gaps between groups
     *
     * Useful for finding vertical cut-offs by looking for largest vertical gaps in a region. Note
     * that by 'contiguous' here we mean literally overlapping: small gaps are not filtered out, and
     * the iterative splitting process may cause the output order to be different from either the
     * human reading order or the Amazon Textract output order.
     *
     * @param {number} focusTop Top coordinate of the search area on the page. All lines above the
     *      search area will be compressed into one group regardless of separation.
     * @param {number} focusHeight Height of the search area on the page. All lines below the search
     *      area will be compressed into one group regardless of separation.
     * @param {Line[]} [lines] Optional array of Line objects to group. By default, the full list of
     *      lines on the page will be analyzed.
     * @returns Object with props 'lines' (the list of Lines in each group) and 'vGaps' (a
     *      list of BoundingBox objects describing the gaps between the groups). Note that this means
     *      `lines.length == vGaps.length + 1`.
     */
    _groupLinesByVerticalGaps(focusTop: number, focusHeight: number, lines?: LineGeneric<Page>[]): {
        vGaps: BoundingBox<unknown, ApiObjectWrapper<unknown>>[];
        lines: LineGeneric<Page>[][];
    };
    /**
     * Identify (via heuristics) the list of Lines likely to be page header or page footer.
     *
     * Output lines are not guaranteed to be sorted either in reading order or strictly in the
     * default Amazon Textract output order.
     *
     * @param {boolean} isHeader Set true for header, or false for footer.
     * @param {HeaderFooterSegmentModelParams} [config] (Experimental) heuristic configurations.
     * @param {Line[]} [fromLines] Optional array of Line objects to group. By default, the full list
     *      of lines on the page will be analyzed.
     * @returns {Line[]} Array of Lines in the relevant section.
     */
    _getHeaderOrFooterLines(isHeader: boolean, { maxMargin, minGap }?: HeaderFooterSegmentModelParams, fromLines?: LineGeneric<Page>[]): LineGeneric<Page>[];
    /**
     * Identify (via heuristics) the list of Lines likely to be page footer.
     *
     * Output lines are not guaranteed to be sorted either in reading order or strictly in the
     * default Amazon Textract output order. See also getLinesByLayoutArea() for this.
     *
     * @param {HeaderFooterSegmentModelParams} [config] (Experimental) heuristic configurations.
     * @param {Line[]} [fromLines] Optional array of Line objects to group. By default, the full list
     *      of lines on the page will be analyzed.
     * @returns {Line[]} Array of Lines in the relevant section.
     */
    getFooterLines(config?: HeaderFooterSegmentModelParams, fromLines?: LineGeneric<Page>[]): LineGeneric<Page>[];
    /**
     * Identify (via heuristics) the list of Lines likely to be page header.
     *
     * Output lines are not guaranteed to be sorted either in reading order or strictly in the
     * default Amazon Textract output order. See also getLinesByLayoutArea() for this.
     *
     * @param {HeaderFooterSegmentModelParams} [config] (Experimental) heuristic configurations.
     * @param {Line[]} [fromLines] Optional array of Line objects to group. By default, the full list
     *      of lines on the page will be analyzed.
     * @returns {Line[]} Array of Lines in the relevant section.
     */
    getHeaderLines(config?: HeaderFooterSegmentModelParams, fromLines?: LineGeneric<Page>[]): LineGeneric<Page>[];
    /**
     * Segment page text into header, content, and footer - optionally in (approximate) reading order
     *
     * @param {boolean|HeuristicReadingOrderModelParams} [inReadingOrder=false] Set true to sort text
     *      in reading order, or leave false (the default) to use the standard Textract ouput order
     *      instead. To customize the (experimental) parameters of the reading order model, pass in a
     *      configuration object instead of true.
     * @param {HeaderFooterSegmentModelParams} [headerConfig] (Experimental) heuristic configurations
     *      for header extraction.
     * @param {HeaderFooterSegmentModelParams} [footerConfig] (Experimental) heuristic configurations
     *      for footer extraction.
     * @returns Object with .header, .content, .footer properties: Each of type Line[].
     */
    getLinesByLayoutArea(inReadingOrder?: boolean | HeuristicReadingOrderModelParams, headerConfig?: HeaderFooterSegmentModelParams, footerConfig?: HeaderFooterSegmentModelParams): {
        header: LineGeneric<Page>[];
        content: LineGeneric<Page>[];
        footer: LineGeneric<Page>[];
    };
    /**
     * Iterate through the lines on the page in raw Textract order
     *
     * For reading order, see getLineClustersInReadingOrder instead.
     *
     * @example
     * for (const line of page.iterLines()) {
     *   console.log(line.text);
     * }
     */
    iterLines(): Iterable<LineGeneric<Page>>;
    /**
     * Iterate through the tables on the page
     * @example
     * for (const table of page.iterTables()) {
     *   console.log(table.str());
     * }
     * @example
     * const tables = [...page.iterTables()];
     */
    iterTables(): Iterable<TableGeneric<Page>>;
    lineAtIndex(ix: number): LineGeneric<Page>;
    listBlocks(): ApiBlock[];
    listLines(): LineGeneric<Page>[];
    listTables(): TableGeneric<Page>[];
    tableAtIndex(ix: number): TableGeneric<Page>;
    get form(): FormGeneric<Page>;
    get geometry(): Geometry<ApiPageBlock, Page>;
    get nLines(): number;
    get nTables(): number;
    /**
     * 1-based page number of this Page in the parent TextractDocument
     */
    get pageNumber(): number;
    get parentDocument(): TextractDocument;
    get text(): string;
    str(): string;
}
export declare class Line extends LineGeneric<Page> {
}
export declare class Field extends FieldGeneric<Page> {
}
export declare class FieldKey extends FieldKeyGeneric<Page> {
}
export declare class FieldValue extends FieldValueGeneric<Page> {
}
export declare class Form extends FormGeneric<Page> {
}
export declare class Cell extends CellGeneric<Page> {
}
export declare abstract class CellBase<T extends ApiCellBlock | ApiMergedCellBlock> extends CellBaseGeneric<T, Page> {
}
export declare class MergedCell extends MergedCellGeneric<Page> {
}
export declare class Row extends RowGeneric<Page> {
}
export declare class Table extends TableGeneric<Page> {
}
export declare class TextractDocument extends ApiObjectWrapper<ApiResponsePage & ApiResponseWithContent> implements IDocBlocks {
    _blockMap: {
        [blockId: string]: ApiBlock;
    };
    _form: FormsCompositeGeneric<Page, TextractDocument>;
    _pages: Page[];
    /**
     * @param textractResults A (parsed) Textract response JSON, or an array of multiple from the same job
     */
    constructor(textractResults: ApiResponsePage | ApiResponsePages);
    _parse(): void;
    static _consolidateMultipleResponses(textractResultArray: ApiResponsePages): ApiResponsePage & ApiResponseWithContent;
    get form(): FormsComposite;
    get nPages(): number;
    getBlockById(blockId: string): ApiBlock | undefined;
    /**
     * Iterate through the pages of the document
     * @example
     * for (const page of doc.iterPages()) {
     *   console.log(page.str());
     * }
     * @example
     * const pages = [...doc.iterPages()];
     */
    iterPages(): Iterable<Page>;
    listBlocks(): ApiBlock[];
    listPages(): Page[];
    pageNumber(pageNum: number): Page;
    str(): string;
}
export declare class FormsComposite extends FormsCompositeGeneric<Page, TextractDocument> {
}
