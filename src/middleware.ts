import connect from './lib/connection';

export async function onRequest(context :any, next:any) {
  connect();
  return next();
}