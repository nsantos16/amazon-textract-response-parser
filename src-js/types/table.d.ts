/**
 * TRP classes for (generic document) table objects
 */
import { ApiCellBlock, ApiMergedCellBlock, ApiTableBlock } from "./api-models/document";
import { ApiBlockWrapper, WithParentDocBlocks } from "./base";
import { SelectionElement, Word } from "./content";
import { Geometry } from "./geometry";
/**
 * Generic base class for a table cell, which may be merged or not
 *
 * If you're consuming this library, you probably just want to use `document.ts/CellBase`.
 */
export declare abstract class CellBaseGeneric<T extends ApiCellBlock | ApiMergedCellBlock, TPage extends WithParentDocBlocks> extends ApiBlockWrapper<T> {
    _geometry: Geometry<T, CellBaseGeneric<T, TPage>>;
    _parentTable: TableGeneric<TPage>;
    constructor(block: T, parentTable: TableGeneric<TPage>);
    get columnIndex(): number;
    get columnSpan(): number;
    get confidence(): number;
    set confidence(newVal: number);
    get geometry(): Geometry<T, CellBaseGeneric<T, TPage>>;
    get parentTable(): TableGeneric<TPage>;
    get rowIndex(): number;
    get rowSpan(): number;
    abstract get text(): string;
    abstract listContent(): Array<SelectionElement | Word>;
    abstract str(): string;
}
/**
 * Generic base class for a non-merged table cell (or sub-cell of a merged cell)
 *
 * If you're consuming this library, you probably just want to use `document.ts/Cell`.
 */
export declare class CellGeneric<TPage extends WithParentDocBlocks> extends CellBaseGeneric<ApiCellBlock, TPage> {
    _content: Array<SelectionElement | Word>;
    _text: string;
    constructor(block: ApiCellBlock, parentTable: TableGeneric<TPage>);
    get text(): string;
    listContent(): Array<SelectionElement | Word>;
    str(): string;
}
/**
 * Generic base class for a merged table cell (Spanning more than one row or column of the table)
 *
 * If you're consuming this library, you probably just want to use `document.ts/MergedCell`.
 */
export declare class MergedCellGeneric<TPage extends WithParentDocBlocks> extends CellBaseGeneric<ApiMergedCellBlock, TPage> {
    _cells: CellGeneric<TPage>[];
    constructor(block: ApiMergedCellBlock, parentTable: TableGeneric<TPage>);
    get text(): string;
    listContent(): Array<SelectionElement | Word>;
    str(): string;
}
/**
 * Generic base class for a table row
 *
 * If you're consuming this library, you probably just want to use `document.ts/Row`.
 */
export declare class RowGeneric<TPage extends WithParentDocBlocks> {
    _cells: Array<CellGeneric<TPage> | MergedCellGeneric<TPage>>;
    _parentTable: TableGeneric<TPage>;
    constructor(cells: Array<CellGeneric<TPage> | MergedCellGeneric<TPage>>, parentTable: TableGeneric<TPage>);
    get nCells(): number;
    get parentTable(): TableGeneric<TPage>;
    /**
     * Iterate through the cells in this row
     * @example
     * for (const cell of row.iterCells()) {
     *   console.log(cell.text);
     * }
     * @example
     * [...row.iterCells()].forEach(
     *   (cell) => console.log(cell.text)
     * );
     */
    iterCells(): Iterable<CellGeneric<TPage> | MergedCellGeneric<TPage>>;
    listCells(): Array<CellGeneric<TPage> | MergedCellGeneric<TPage>>;
    str(): string;
}
/**
 * Generic base class for a table, since Page is not defined yet here
 *
 * If you're consuming this library, you probably just want to use `document.ts/Table`.
 */
export declare class TableGeneric<TPage extends WithParentDocBlocks> extends ApiBlockWrapper<ApiTableBlock> {
    _cells: CellGeneric<TPage>[];
    _cellsById: {
        [id: string]: CellGeneric<TPage>;
    };
    _mergedCells: MergedCellGeneric<TPage>[];
    _geometry: Geometry<ApiTableBlock, TableGeneric<TPage>>;
    _nCols: number;
    _nRows: number;
    _parentPage: TPage;
    constructor(block: ApiTableBlock, parentPage: TPage);
    /**
     * Sort an array of table cells by position (row, column) in-place
     * @param cells Array of (merged or raw) cells
     */
    _sortCellsByLocation<T extends CellGeneric<TPage> | MergedCellGeneric<TPage>>(cells: Array<T>): void;
    /**
     * Update this Table instance's map of (split) Cells by ID for efficient retrieval
     */
    _updateCellsById(): void;
    /**
     * Efficiently retrieve a (split) Cell in this table by Textract block ID
     *
     * This allows MergedCell objects to retrieve references to parsed Cells they wrap, instead of raw
     * ApiCellBlocks.
     * @throws (Rather than returning undefined) if the block ID is missing from the table.
     */
    _getSplitCellByBlockId(id: string): CellGeneric<TPage>;
    /**
     * Get the Cell at a particular Y, X coordinate in the table.
     * @param rowIndex 1-based index of the target row in the table
     * @param columnIndex 1-based index of the target column in the table
     * @param ignoreMerged Set `true` to ignore merged cells (returning specific sub-cells)
     * @returns Cell at the specified row & column, or undefined if none is present.
     */
    cellAt(rowIndex: number, columnIndex: number, ignoreMerged?: boolean): CellGeneric<TPage> | MergedCellGeneric<TPage> | undefined;
    /**
     * List the cells at a particular {row, column, or combination} in the table
     * @param rowIndex 1-based index of the target row in the table
     * @param columnIndex 1-based index of the target column in the table
     * @param ignoreMerged Set `true` to ignore merged cells (returning specific sub-cells)
     * @returns Cell at the specified row & column, or undefined if none is present.
     */
    cellsAt(rowIndex: number | null, columnIndex: number | null, ignoreMerged?: boolean): Array<CellGeneric<TPage> | MergedCellGeneric<TPage>>;
    /**
     * Iterate through the rows of the table
     * @param repeatMultiRowCells Set `true` to include rowspan>1 cells in every `Row` they intersect with.
     * @example
     * for (const row of table.iterRows()) {
     *   for (const cell of row.iterCells()) {
     *     console.log(cell.text);
     *   }
     * }
     * @example
     * [...table.iterRows()].forEach(
     *   (row) => [...row.iterCells()].forEach(
     *     (cell) => console.log(cell.text)
     *   )
     * );
     */
    iterRows(repeatMultiRowCells?: boolean): Iterable<RowGeneric<TPage>>;
    /**
     * List the rows of the table
     * @param repeatMultiRowCells Set `true` to include rowspan>1 cells in every `Row` they intersect with.
     */
    listRows(repeatMultiRowCells?: boolean): RowGeneric<TPage>[];
    /**
     * List the cells at a particular {row, column, or combination} in the table
     * @param rowIndex 1-based index of the target row in the table
     * @param repeatMultiRowCells Set `true` to include rowspan>1 cells in every `Row` they intersect with.
     */
    rowAt(rowIndex: number, repeatMultiRowCells?: boolean): RowGeneric<TPage>;
    get confidence(): number;
    set confidence(newVal: number);
    get geometry(): Geometry<ApiTableBlock, TableGeneric<TPage>>;
    get nCells(): number;
    get nColumns(): number;
    get nRows(): number;
    get parentPage(): TPage;
    str(): string;
}
