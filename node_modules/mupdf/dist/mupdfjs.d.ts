import * as mupdf from "mupdf";
export * from "mupdf";
export type PDFWord = {
    rect: mupdf.Rect;
    text: string;
    font: mupdf.Font;
    size: number;
};
export declare class PDFDocument extends mupdf.PDFDocument {
    static createBlankDocument(width?: number, height?: number): PDFDocument;
    static openDocument(from: mupdf.Buffer | ArrayBuffer | Uint8Array | mupdf.Stream, magic: string): PDFDocument;
    copyPage(pno: number, to?: number): void;
    newPage(pno?: number, width?: number, height?: number): mupdf.PDFPage;
    deletePages(...args: any[]): void;
    getPageLabels(): PageLabelRule[];
    setPageLabelsArray(labels: PageLabelRule[]): void;
    authenticate(password: string): number;
    getPageNumbers(label: string, onlyOne?: boolean): number[];
    private getPageLabel;
    private toRoman;
    private toAlpha;
    merge(sourcePDF: mupdf.PDFDocument, fromPage?: number, toPage?: number, startAt?: number, rotate?: 0 | 90 | 180 | 270, copyLinks?: boolean, copyAnnotations?: boolean): void;
    private copyPageLinks;
    private copyPageAnnotations;
    split(range: number[] | undefined): PDFDocument[];
    scrub(options: {
        attachedFiles?: boolean;
        cleanPages?: boolean;
        embeddedFiles?: boolean;
        hiddenText?: boolean;
        javascript?: boolean;
        metadata?: boolean;
        redactions?: boolean;
        redactImages?: number;
        removeLinks?: boolean;
        resetFields?: boolean;
        resetResponses?: boolean;
        thumbnails?: boolean;
        xmlMetadata?: boolean;
    }): void;
    attachFile(name: string, data: Buffer | ArrayBuffer | Uint8Array, options?: {
        filename?: string;
        creationDate?: Date;
        modificationDate?: Date;
    }): void;
    private guessMimeType;
}
export declare class PDFPage extends mupdf.PDFPage {
    constructor(doc: mupdf.PDFDocument, pno: number);
    insertText(value: string, point: mupdf.Point, fontName?: string, fontSize?: number, graphics?: {
        strokeColor: mupdf.Color;
        fillColor: mupdf.Color;
        strokeThickness: number;
    }): void;
    insertImage(data: {
        image: mupdf.Image;
        name: string;
    }, metrics?: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
    }): void;
    insertLink(metrics: {
        x: number;
        y: number;
        width: number;
        height: number;
    }, uri: string): void;
    rotate(r: number): void;
    addAnnotation(type: mupdf.PDFAnnotationType, metrics: {
        x: number;
        y: number;
        width: number;
        height: number;
    }, author?: string, contents?: string): mupdf.PDFAnnotation;
    addRedaction(metrics: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): mupdf.PDFAnnotation;
    applyRedactions(blackBoxes?: boolean | number, imageMethod?: number, lineArtMethod?: number, textMethod?: number): void;
    search(needle: string, maxHits?: number): mupdf.Quad[][];
    setCropBox(rect: mupdf.Rect): void;
    setArtBox(rect: mupdf.Rect): void;
    setBleedBox(rect: mupdf.Rect): void;
    setTrimBox(rect: mupdf.Rect): void;
    setMediaBox(rect: mupdf.Rect): void;
    getText(): string;
    getWords(): PDFWord[];
    getImages(): {
        bbox: mupdf.Rect;
        matrix: mupdf.Matrix;
        image: mupdf.Image;
    }[];
    delete(ref: mupdf.PDFAnnotation | mupdf.PDFWidget | mupdf.Link | string): void;
    getResourcesXrefObjects(): {
        key: string | number;
        value: string;
    }[];
}
interface PageLabelRule {
    startpage: number;
    prefix?: string;
    style?: string;
    firstpagenum?: number;
}
