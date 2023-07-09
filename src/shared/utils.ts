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

export function sanitizePath(path: string, unixSep: boolean = true) {
  let output: string = path;
  if (unixSep) output = output.replaceAll('\\', '/');
  return output;
}

export function delay(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}
