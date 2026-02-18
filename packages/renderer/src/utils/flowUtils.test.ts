import { Transform } from 'reactflow';
import { pointToRendererPoint, rendererPointToPoint } from './flowUtils';

describe('pointToRendererPoint', () => {
  it('should convert screen point to renderer point without transform', () => {
    const point = { x: 100, y: 200 };
    const transform: Transform = [0, 0, 1]; // no translation, scale 1
    const result = pointToRendererPoint(point, transform, false, [1, 1]);

    expect(result).toEqual({ x: 100, y: 200 });
  });

  it('should apply translation transform', () => {
    const point = { x: 100, y: 200 };
    const transform: Transform = [50, 30, 1]; // translate x=50, y=30, scale 1
    const result = pointToRendererPoint(point, transform, false, [1, 1]);

    expect(result).toEqual({ x: 50, y: 170 });
  });

  it('should apply scale transform', () => {
    const point = { x: 100, y: 200 };
    const transform: Transform = [0, 0, 2]; // no translation, scale 2
    const result = pointToRendererPoint(point, transform, false, [1, 1]);

    expect(result).toEqual({ x: 50, y: 100 });
  });

  it('should apply both translation and scale', () => {
    const point = { x: 200, y: 400 };
    const transform: Transform = [100, 200, 2]; // translate and scale
    const result = pointToRendererPoint(point, transform, false, [1, 1]);

    expect(result).toEqual({ x: 50, y: 100 });
  });

  it('should snap to grid when enabled', () => {
    const point = { x: 123, y: 187 };
    const transform: Transform = [0, 0, 1];
    const result = pointToRendererPoint(point, transform, true, [10, 10]);

    expect(result).toEqual({ x: 120, y: 190 });
  });

  it('should snap to custom grid size', () => {
    const point = { x: 123, y: 187 };
    const transform: Transform = [0, 0, 1];
    const result = pointToRendererPoint(point, transform, true, [25, 25]);

    expect(result).toEqual({ x: 125, y: 175 });
  });

  it('should snap with non-uniform grid', () => {
    const point = { x: 123, y: 187 };
    const transform: Transform = [0, 0, 1];
    const result = pointToRendererPoint(point, transform, true, [15, 20]);

    expect(result).toEqual({ x: 120, y: 180 });
  });

  it('should combine transform and grid snapping', () => {
    const point = { x: 100, y: 100 };
    const transform: Transform = [10, 10, 2];
    const result = pointToRendererPoint(point, transform, true, [10, 10]);

    // (100 - 10) / 2 = 45, (100 - 10) / 2 = 45
    // snap to 10: 40, 40
    expect(result.x).toBeCloseTo(50, 0);
    expect(result.y).toBeCloseTo(50, 0);
  });
});

describe('rendererPointToPoint', () => {
  it('should convert renderer point to screen point without transform', () => {
    const point = { x: 100, y: 200 };
    const transform: Transform = [0, 0, 1]; // no translation, scale 1
    const result = rendererPointToPoint(point, transform);

    expect(result).toEqual({ x: 100, y: 200 });
  });

  it('should apply translation transform', () => {
    const point = { x: 100, y: 200 };
    const transform: Transform = [50, 30, 1]; // translate x=50, y=30, scale 1
    const result = rendererPointToPoint(point, transform);

    expect(result).toEqual({ x: 150, y: 230 });
  });

  it('should apply scale transform', () => {
    const point = { x: 100, y: 200 };
    const transform: Transform = [0, 0, 2]; // no translation, scale 2
    const result = rendererPointToPoint(point, transform);

    expect(result).toEqual({ x: 200, y: 400 });
  });

  it('should apply both translation and scale', () => {
    const point = { x: 50, y: 100 };
    const transform: Transform = [100, 200, 2]; // translate and scale
    const result = rendererPointToPoint(point, transform);

    expect(result).toEqual({ x: 200, y: 400 });
  });

  it('should be inverse of pointToRendererPoint without snapping', () => {
    const originalPoint = { x: 123, y: 456 };
    const transform: Transform = [50, 75, 1.5];

    const rendererPoint = pointToRendererPoint(
      originalPoint,
      transform,
      false,
      [1, 1]
    );
    const backToOriginal = rendererPointToPoint(rendererPoint, transform);

    expect(backToOriginal.x).toBeCloseTo(originalPoint.x, 10);
    expect(backToOriginal.y).toBeCloseTo(originalPoint.y, 10);
  });

  it('should handle negative coordinates', () => {
    const point = { x: -50, y: -100 };
    const transform: Transform = [10, 20, 2];
    const result = rendererPointToPoint(point, transform);

    expect(result).toEqual({ x: -90, y: -180 });
  });

  it('should handle fractional scales', () => {
    const point = { x: 100, y: 200 };
    const transform: Transform = [0, 0, 0.5];
    const result = rendererPointToPoint(point, transform);

    expect(result).toEqual({ x: 50, y: 100 });
  });
});
