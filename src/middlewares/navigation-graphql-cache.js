"use strict";

const TTL_MS = (Number(process.env.NAV_GQL_CACHE_TTL_SECONDS) || 1800) * 1000;
const cache = new Map();

module.exports = (_config, { strapi }) => async (ctx, next) => {
  const body = ctx.request.body || {};
  const isNavQuery =
    ctx.method === "POST" &&
    ctx.path === "/graphql" &&
    !ctx.request.headers.authorization &&
    typeof body.query === "string" &&
    body.query.includes("renderNavigation");

  if (!isNavQuery) {
    return next();
  }

  const key = body.query + JSON.stringify(body.variables || null);
  const now = Date.now();
  const hit = cache.get(key);

  if (hit && hit.expiresAt > now) {
    ctx.status = 200;
    ctx.set("x-navigation-cache", "HIT");
    ctx.body = hit.data;
    return;
  }

  const start = Date.now();
  await next();
  strapi.log.debug(`[navigation-cache] MISS — renderNavigation took ${Date.now() - start}ms`);

  if (ctx.status === 200 && ctx.body && !ctx.body.errors) {
    cache.set(key, { data: ctx.body, expiresAt: now + TTL_MS });
    ctx.set("x-navigation-cache", "MISS");
  }
};
