export type Pos = {
  start: number;
};

// These are used when `options.locations` is on, for the
// `startLoc` and `endLoc` properties.

export class Position {
  // If `declare` is used here, the `jquery` benchmark will drop by 10%. :)
  line: number;
  column: number;
  declare index: number;

  constructor(line: number, col: number, index?: number) {
    this.line = line;
    this.column = col;
    if (index !== undefined) this.index = index;
  }
}

export class SourceLocation {
  start: Position;
  end: Position;
  filename: string;
  identifierName: string | undefined | null;

  constructor(start: Position, end?: Position) {
    this.start = start;
    // (may start as null, but initialized later)
    this.end = end;
  }
}

/**
 * creates a new position with a non-zero column offset from the given position.
 * This function should be only be used when we create AST node out of the token
 * boundaries, such as TemplateElement ends before tt.templateNonTail. This
 * function does not skip whitespaces.
 */
export function createPositionWithColumnOffset(
  position: Position,
  columnOffset: number,
) {
  const { line, column, index } = position;
  return new Position(line, column + columnOffset, index + columnOffset);
}
