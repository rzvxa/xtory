export interface TryGetResult<TResult> {
  success: boolean;
  result: TResult | unknown;
}

function ok<TResult>(result: TResult): TryGetResult<TResult> {
  return {
    success: true,
    result,
  };
}

function err<TResult>(result: TResult): TryGetResult<TResult> {
  return {
    success: false,
    result,
  };
}

export function tryGet<TResult>(getter: () => TResult): TryGetResult<TResult> {
  try {
    const result = getter();
    return ok(result);
  } catch (exception) {
    return err(exception);
  }
}

export async function tryGetAsync<TResult>(
  getter: () => Promise<TResult>
): Promise<TryGetResult<TResult>> {
  try {
    const result = await getter();
    return ok(result);
  } catch (exception) {
    return err(exception);
  }
}