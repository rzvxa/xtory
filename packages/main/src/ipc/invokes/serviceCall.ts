import { IpcMainInvokeEvent } from 'electron';
import project from 'main/project';
import { BuiltinServices } from '@xtory/main/services/types';

// TODO: add type safety for methods/arguments and return types
export default async function serviceCall<
  SVC extends keyof BuiltinServices | (string & {})
>(
  _event: IpcMainInvokeEvent,
  serviceName: SVC,
  methodName: string,
  args: any[]
): Promise<any> {
  const service = project.getService(serviceName);
  if (!service) {
    throw new Error(`Invalid service name ${serviceName}`);
  }
  if (!(methodName in service)) {
    throw new Error(`Invalid method ${methodName} on ${serviceName} service`);
  }

  const maybeFn = (service as any)[methodName];
  if (typeof maybeFn !== 'function') {
    throw new Error(
      `Property ${methodName} exists on ${serviceName} service but it is ${typeof maybeFn} instead of a valid function`
    );
  }
  // NOTE: here we use the original value for the call to avoid discarding this assigned to the function
  return ((service as any)[methodName] as (...args: any) => any)(
    ...(args ?? [])
  );
}
