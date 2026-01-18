import { c as connect } from './chunks/connection_B9bDQ4iN.mjs';
import './chunks/astro-designed-error-pages_CtXoiZSa.mjs';
import './chunks/astro/server_CGX8C4Zt.mjs';
import 'clsx';
import { s as sequence } from './chunks/index_B_q0-I5z.mjs';

async function onRequest$1(context, next) {
  connect();
  return next();
}

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
