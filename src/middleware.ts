import connect from './lib/connection';

export async function onRequest(context, next) {
  connect();
  return next();
}