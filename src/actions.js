
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

export const createPgRestActionPost = type => (data, meta = {}) => ({
  type,
  meta: { data, ...meta }
});

export const createPgRestActionPatch = type => (query, data, meta = {}) => ({
  type,
  meta: { query, data, ...meta }
});

export const createPgRestActionDelete = type => (query, meta = {}) => ({
  type,
  meta: { query, ...meta }
});
