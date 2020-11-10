import { Request } from 'express';

interface IUserRequest extends Request {
  session: {
    userId: any;
  };
}
export interface MyContext {
  req: IUserRequest;
}
