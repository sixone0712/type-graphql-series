import { Request } from 'express';
import { Session } from 'express-session';

// interface IUserRequest extends Request {
//   session: {
//     userId: any;
//   };
// }

// export interface MyContext {
//   req: Request;
// }

interface ExtendsRequest extends Request {
  session: ExtendsSession;
}

interface ExtendsSession extends Session {
  userId: any;
}

export interface MyContext {
  req: ExtendsRequest;
}
