import { ApiBoundingBox, ApiGeometry, ApiPoint } from "./api-models/geometry";
import { ApiObjectWrapper } from "./base";
export declare class BoundingBox<TParentBlock, TParent extends ApiObjectWrapper<TParentBlock>> extends ApiObjectWrapper<ApiBoundingBox> {
    _parentGeometry: Geometry<TParentBlock, TParent> | null;
    constructor(dict: ApiBoundingBox, parentGeometry?: Geometry<TParentBlock, TParent> | null);
    get bottom(): number;
    get hCenter(): number;
    get height(): number;
    get left(): number;
    get parentGeometry(): Geometry<TParentBlock, TParent> | null;
    get top(): number;
    get right(): number;
    get vCenter(): number;
    get width(): number;
    /**
     * Calculate the minimum box enclosing both this and `other`.
     * @returns A new BoundingBox object with null `parentGeometry`.
     */
    union<T>(other: BoundingBox<T, ApiObjectWrapper<T>>): BoundingBox<T, ApiObjectWrapper<T>>;
    /**
     * Calculate the intersection (if there is one) between two boxes.
     * @returns A new BoundingBox object with null `parentGeometry`, or null if inputs don't overlap
     */
    intersection<T>(other: BoundingBox<T, ApiObjectWrapper<T>>): BoundingBox<T, ApiObjectWrapper<T>> | null;
    str(): string;
}
export declare class Point<TParentBlock, TParent extends ApiObjectWrapper<TParentBlock>> extends ApiObjectWrapper<ApiPoint> {
    _parentGeometry: Geometry<TParentBlock, TParent> | null;
    constructor(dict: ApiPoint, parentGeometry?: Geometry<TParentBlock, TParent> | null);
    get parentGeometry(): Geometry<TParentBlock, TParent> | null;
    get x(): number;
    get y(): number;
    str(): string;
}
export declare class Geometry<TParentBlock, TParent extends ApiObjectWrapper<TParentBlock>> extends ApiObjectWrapper<ApiGeometry> {
    _boundingBox: BoundingBox<TParentBlock, TParent> | undefined;
    _parentObject: TParent | null;
    _polygon: Point<TParentBlock, TParent>[] | undefined;
    constructor(dict: ApiGeometry, parentObject: TParent | null);
    get boundingBox(): BoundingBox<TParentBlock, TParent> | undefined;
    get parentObject(): TParent | null;
    get polygon(): Point<TParentBlock, TParent>[] | undefined;
    /**
     * Get the slope (in radians -pi < x +pi) of the initial segment of the polygon.
     *
     * Because Textract constructs polygons with first two points as T-L and T-R corners, this yields
     * the approximate (since it might not be completely rectangular) orientation of the object.
     */
    orientationRadians(): number | null;
    /**
     * Wrapper over orientationRadians to translate result to degrees (-180 < x < 180).
     */
    orientationDegrees(): number | null;
    str(): string;
}
