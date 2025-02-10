import 'express';

declare module 'express' {
  interface Response {
    locals: Record<string, any>;
  }
}
