export function createPgRestActions(type) {
  return {
    get: createPgRestActionGet(type),
    post: createPgRestActionPost(type),
    patch: createPgRestActionPatch(type),
    delete: createPgRestActionDelete(type)
  };
}

export const createPgRestActionGet = type => (query, meta = {}) => ({
  type,
  meta: { query, ...meta }
});

export const createPgRestActionPost = type => (body, meta = {}) => ({
  type,
  meta: { body, method: "POST", ...meta }
});

export const createPgRestActionPatch = type => (query, body, meta = {}) => ({
  type,
  meta: { query, method: "PATCH", body, ...meta }
});

export const createPgRestActionDelete = type => (query, meta = {}) => ({
  type,
  meta: { query, method: "DELETE", ...meta }
});
