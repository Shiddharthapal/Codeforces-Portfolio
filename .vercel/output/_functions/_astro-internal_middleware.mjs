import { c as connect } from './chunks/connection_DAbYXkXZ.mjs';
import './chunks/astro-designed-error-pages_D663Q1vO.mjs';
import { s as sequence } from './chunks/index_vkAzE-44.mjs';

async function onRequest$1(context, next) {
  connect();
  return next();
}

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
