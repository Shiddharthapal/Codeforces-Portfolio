import { c as connect } from './chunks/connection_suXsM9xL.mjs';
import './chunks/astro-designed-error-pages_wCEeDqdb.mjs';
import './chunks/astro/server_CGX8C4Zt.mjs';
import 'clsx';
import { s as sequence } from './chunks/index_BsA__ajb.mjs';

async function onRequest$1(context, next) {
  connect();
  return next();
}

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
