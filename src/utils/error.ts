export enum ErrorType {
  RECOVERABLE = 'RECOVERABLE',
  UNRECOVERABLE = 'UNRECOVERABLE',
}

export class RecoverableError {
  type = ErrorType.RECOVERABLE;
  constructor(public message: string) {}
}

export class UnrecoverableError {
  type = ErrorType.UNRECOVERABLE;
  constructor(public message: string) {}
}
