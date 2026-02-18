/*
 * MIT License
 *
 * Copyright (c) 2026 rzvxa
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

#ifndef XTROY_H
#define XTROY_H

#if !defined(__WINDOWS__) &&                                                   \
    (defined(WIN32) || defined(WIN64) || defined(_MSC_VER) || defined(_WIN32))
#define __WINDOWS__
#endif

#if defined(__WINDOWS__)
#if defined(XTORY_IMPLEMENTATION)
#define XTORY_API __declspec(dllexport)
#else
#define XTORY_API __declspec(dllimport)
#endif
#else
#define XTORY_API
#endif

#ifndef XTORY_HASHMAP_DEFAULT_CAPACITY
#define XTORY_HASHMAP_DEFAULT_CAPACITY 16
#endif

#ifndef XTORY_HASHMAP_GROW_FACTOR
#define XTORY_HASHMAP_GROW_FACTOR 2
#endif

#ifndef XTORY_HASHMAP_MAX_LOAD
#define XTORY_HASHMAP_MAX_LOAD 0.8f
#endif

#include <stdint.h>
#include <stdlib.h>
#include <string.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef void *(*xtory_malloc_fn_t)(size_t size);
typedef void (*xtory_free_fn_t)(void *ptr);

typedef struct xtory_allocator_t {
  xtory_malloc_fn_t malloc;
  xtory_free_fn_t   free;
} xtory_allocator_t;

typedef struct xtory_configuration_t {
  xtory_malloc_fn_t malloc;
  xtory_free_fn_t   free;
} xtory_configuration_t;

#ifdef XTORY_IMPLEMENTATION
static xtory_malloc_fn_t xtory_malloc = malloc;
static xtory_free_fn_t   xtory_free   = free;
static void             *xtory_calloc(size_t count, size_t size) {
  size_t total = count * size;

  void *ptr = xtory_malloc(total);
  if (!ptr) {
    return NULL;
  }

  memset(ptr, 0, total);
  return ptr;
}
#else
extern xtory_malloc_fn_t xtory_malloc;
extern xtory_free_fn_t   xtory_free;
#endif

/*
 * Arena Allocator
 */
typedef struct xtory_arena_t {
  size_t   size;
  size_t   offset;
  uint8_t *memory;
} xtory_arena_t;

/*
 * Hashmap types
 */
typedef struct xtory_hashmap_bucket_t {
  struct xtory_hashmap_bucket_t *next;
  const void                    *key;
  size_t                         key_size;
  uint32_t                       hash;
  uintptr_t                      value;
} xtory_hashmap_bucket_t;

typedef struct xtory_hashmap_t {
  struct xtory_hashmap_bucket_t *buckets;
  size_t                         capacity;
  size_t                         count;
  size_t                         tombstone_count;

  struct xtory_hashmap_bucket_t *head;
  struct xtory_hashmap_bucket_t *tail;
} xtory_hashmap_t;

/*
 * JSON parser types
 */
#define XTORY_JSON_TOK_BEGIN_OBJ 1 // {
#define XTORY_JSON_TOK_END_OBJ   2 // }
#define XTORY_JSON_TOK_BEGIN_ARR 3 // [
#define XTORY_JSON_TOK_END_ARR   4 // ]
#define XTORY_JSON_TOK_SEP_NAME  5 // :
#define XTORY_JSON_TOK_SEP_VALUE 6 // ,
#define XTORY_JSON_TOK_STRING    7
#define XTORY_JSON_TOK_NUMBER    8
#define XTORY_JSON_TOK_TRUE      9
#define XTORY_JSON_TOK_FALSE     10
#define XTORY_JSON_TOK_NULL      11
#define XTORY_JSON_TOK_EOF       12
#define XTORY_JSON_TOK_ERR       13

typedef struct xtory_json_token_t {
  /* One of the XTORY_JSON_TOK_ defines */
  uint8_t type;

  union {
    struct {
      const char *ptr;
      size_t      len;
    } string;

    double number;
  } as;

} xtory_json_token_t;

typedef struct xtory_json_parser_t {
  const char *cur;
  const char *end;

  const char *tok_start;
} xtory_json_parser_t;

typedef struct xtory_flow_t {
  int canary;
} xtory_flow_t;

typedef struct xtory_t {
  xtory_flow_t *flows;
} xtory_t;

/*
 * Optional configuration, it should be called at the very begining,
 * before any usage of the library functions.
 */
XTORY_API void xtory_configure(xtory_configuration_t config);

/*
 * Arena API
 */
XTORY_API xtory_arena_t xtory_arena_create(size_t size);
XTORY_API void          xtory_arena_destroy(xtory_arena_t *arena);
XTORY_API void         *xtory_arena_alloc(xtory_arena_t *arena, size_t size);
XTORY_API void          xtory_arena_reset(xtory_arena_t *arena);

/*
 * Hashmap API
 */
XTORY_API xtory_hashmap_t *xtory_hashmap_create(void);
XTORY_API void             xtory_hashmap_destroy(xtory_hashmap_t *map);
XTORY_API void             xtory_hashmap_clear(xtory_hashmap_t *map);
XTORY_API size_t           xtory_hashmap_count(xtory_hashmap_t *map);
XTORY_API int xtory_hashmap_get(xtory_hashmap_t *map, const void *key,
                                size_t key_size, uintptr_t *out_val);
XTORY_API
int xtory_hashmap_set(xtory_hashmap_t *map, const void *key, size_t key_size,
                      uintptr_t value);
XTORY_API void xtory_hashmap_remove(xtory_hashmap_t *map, const void *key,
                                    size_t key_size);

/*
 * JSON API
 */
#ifdef XTORY_ENABLE_JSON
XTORY_API void xtory_json_parser_init(xtory_json_parser_t *parser,
                                      const char *buf, size_t len);
XTORY_API int  xtory_json_parser_next(xtory_json_parser_t *parser,
                                      xtory_json_token_t  *out);
#endif

#ifdef XTORY_IMPLEMENTATION
XTORY_API void xtory_configure(xtory_configuration_t config) {
  if (config.malloc != NULL) {
    xtory_malloc = config.malloc;
  }
  if (config.free != NULL) {
    xtory_free = config.free;
  }
}

/*
 * Arena API
 */
XTORY_API xtory_arena_t xtory_arena_create(size_t size) {
  xtory_arena_t arena;
  arena.memory = (uint8_t *)xtory_malloc(size);
  arena.size   = size;
  arena.offset = 0;
  return arena;
}

XTORY_API void xtory_arena_destroy(xtory_arena_t *arena) {
  xtory_free(arena->memory);
  arena->size   = 0;
  arena->offset = 0;
}

XTORY_API void *xtory_arena_alloc(xtory_arena_t *arena, size_t size) {
  if (arena->offset + size > arena->size) {
    /* out of memory */
    return NULL;
  }

  void *ptr = arena->memory + arena->offset;
  arena->offset += size;
  return ptr;
}

XTORY_API void xtory_arena_reset(xtory_arena_t *arena) { arena->offset = 0; }

/*
 * Hashmap API
 */
XTORY_API xtory_hashmap_t *xtory_hashmap_create(void) {
  xtory_hashmap_t *map = xtory_malloc(sizeof(xtory_hashmap_t));
  if (map == NULL) {
    return NULL;
  }

  map->capacity        = XTORY_HASHMAP_DEFAULT_CAPACITY;
  map->count           = 0;
  map->tombstone_count = 0;
  map->buckets         = xtory_calloc(XTORY_HASHMAP_DEFAULT_CAPACITY,
                                      sizeof(xtory_hashmap_bucket_t));
  if (map->buckets == NULL) {
    xtory_free(map);
    return NULL;
  }

  map->head = NULL;
  map->tail = (xtory_hashmap_bucket_t *)&map->head;
  return map;
}

XTORY_API void xtory_hashmap_destroy(xtory_hashmap_t *map) {
  xtory_free(map->buckets);
  xtory_free(map);
}

XTORY_API void xtory_hashmap_clear(xtory_hashmap_t *map) {
  map->count           = 0;
  map->tombstone_count = 0;
  memset(map->buckets, 0, map->capacity * sizeof(xtory_hashmap_bucket_t));
  map->head = NULL;
  map->tail = (xtory_hashmap_bucket_t *)&map->head;
}

xtory_hashmap_bucket_t *
xtory_hashmap_rehash_entry(xtory_hashmap_t        *map,
                           xtory_hashmap_bucket_t *old_entry) {
  uint32_t index = old_entry->hash % map->capacity;

  for (;;) {
    xtory_hashmap_bucket_t *entry = &map->buckets[index];
    if (entry->key == NULL) {
      *entry = *old_entry;
      return entry;
    }

    index = (index + 1) % map->capacity;
  }
}

int xtory_hashmap_resize(xtory_hashmap_t *map) {
  int                     old_capacity = map->capacity;
  xtory_hashmap_bucket_t *old_buckets  = map->buckets;

  map->capacity *= XTORY_HASHMAP_GROW_FACTOR;
  map->buckets = xtory_calloc(map->capacity, sizeof(xtory_hashmap_bucket_t));
  if (map->buckets == NULL) {
    map->capacity = old_capacity;
    map->buckets  = old_buckets;
    return -1;
  }

  map->tail = (xtory_hashmap_bucket_t *)&map->head;
  map->count -= map->tombstone_count;
  map->tombstone_count = 0;

  do {
    xtory_hashmap_bucket_t *current = map->tail->next;

    // skip tombstone entries
    if (current->key == NULL) {
      map->tail->next = current->next;
      continue;
    }

    map->tail->next = xtory_hashmap_rehash_entry(map, current);
    map->tail       = map->tail->next;
  } while (map->tail->next != NULL);

  xtory_free(old_buckets);
  return 0;
}

#define XTORY_FNV1A_32_OFFSET_BASIS 0x811c9dc5
#define XTORY_FNV1A_32_PRIME        1 << 24 | 1 << 8 | 0x93;
static inline uint32_t xtory_hashmap_hash(const void *buf, size_t size) {
  uint32_t hash = XTORY_FNV1A_32_OFFSET_BASIS;
  for (size_t i = 0; i < size; ++i) {
    hash ^= ((const uint8_t *)buf)[i];
    hash *= XTORY_FNV1A_32_PRIME;
  }

  return hash;
}
#undef XTORY_FNV1A_32_OFFSET_BASIS
#undef XTORY_FNV1A_32_PRIME

static xtory_hashmap_bucket_t *xtory_hashmap_find_entry(xtory_hashmap_t *map,
                                                        const void      *key,
                                                        size_t   key_size,
                                                        uint32_t hash) {
  uint32_t index = hash % map->capacity;

  for (;;) {
    xtory_hashmap_bucket_t *entry = &map->buckets[index];

    if ((entry->key == NULL &&
         /* non-zero values with a null key are tombstones */
         entry->value == 0) ||
        (entry->key != NULL && entry->key_size == key_size &&
         entry->hash == hash && memcmp(entry->key, key, key_size) == 0)) {
      return entry;
    }

    index = (index + 1) % map->capacity;
  }
}

XTORY_API size_t xtory_hashmap_count(xtory_hashmap_t *map) {
  return map->count - map->tombstone_count;
}

XTORY_API int xtory_hashmap_get(xtory_hashmap_t *map, const void *key,
                                size_t key_size, uintptr_t *out_val) {
  uint32_t                hash = xtory_hashmap_hash(key, key_size);
  xtory_hashmap_bucket_t *entry =
      xtory_hashmap_find_entry(map, key, key_size, hash);

  *out_val = entry->value;
  return entry->key == NULL ? 0 : 1;
}

XTORY_API int xtory_hashmap_set(xtory_hashmap_t *map, const void *key,
                                size_t key_size, uintptr_t value) {
  if (map->count + 1 > XTORY_HASHMAP_MAX_LOAD * map->capacity) {
    if (xtory_hashmap_resize(map) == -1) {
      return -1;
    }
  }

  uint32_t                hash = xtory_hashmap_hash(key, key_size);
  xtory_hashmap_bucket_t *entry =
      xtory_hashmap_find_entry(map, key, key_size, hash);
  if (entry->key == NULL) {
    map->tail->next = entry;
    map->tail       = entry;
    entry->next     = NULL;

    ++map->count;

    entry->key      = key;
    entry->key_size = key_size;
    entry->hash     = hash;
  }
  entry->value = value;
  return 0;
}

XTORY_API void xtory_hashmap_remove(xtory_hashmap_t *map, const void *key,
                                    size_t key_size) {
  uint32_t                hash = xtory_hashmap_hash(key, key_size);
  xtory_hashmap_bucket_t *entry =
      xtory_hashmap_find_entry(map, key, key_size, hash);

  if (entry->key != NULL) {
    // NOTE: any entry with a NULL key and a non-zero value is tombstone.
    // Use of max value here is arbitrary.
    entry->key   = NULL;
    entry->value = UINT32_MAX;

    ++map->tombstone_count;
  }
}

/*
 * JSON API
 */
#ifdef XTORY_ENABLE_JSON
XTORY_API void xtory_json_parser_init(xtory_json_parser_t *parser,
                                      const char *buf, size_t len) {
  parser->cur       = buf;
  parser->end       = buf + len;
  parser->tok_start = NULL;
}

static inline void xtory_json_skip_whitespaces(xtory_json_parser_t *parser) {
  while (parser->cur < parser->end) {
    char c = *parser->cur;
    if (c == ' ' || c == '\t' || c == '\n' || c == '\r') {
      ++parser->cur;
    } else {
      break;
    }
  }
}

XTORY_API int xtory_json_parser_next(xtory_json_parser_t *parser,
                                     xtory_json_token_t  *out) {
  xtory_json_skip_whitespaces(parser);

  if (parser->cur >= parser->end) {
    out->type = XTORY_JSON_TOK_EOF;
    return 1;
  }

  char c = *parser->cur++;

  switch (c) {
  case '{':
    out->type = XTORY_JSON_TOK_BEGIN_OBJ;
    return 1;
  case '}':
    out->type = XTORY_JSON_TOK_END_OBJ;
    return 1;
  case '[':
    out->type = XTORY_JSON_TOK_BEGIN_ARR;
    return 1;
  case ']':
    out->type = XTORY_JSON_TOK_END_ARR;
    return 1;
  case ':':
    out->type = XTORY_JSON_TOK_SEP_NAME;
    return 1;
  case ',':
    out->type = XTORY_JSON_TOK_SEP_VALUE;
    return 1;

  case '"': {
    const char *start = parser->cur;
    while (parser->cur < parser->end) {
      char ch = *parser->cur++;
      if (ch == '\\') {
        if (parser->cur < parser->end) {
          // skip escaped character
          parser->cur++;
          continue;
        }
      }
      if (ch == '"') {
        out->type          = XTORY_JSON_TOK_STRING;
        out->as.string.ptr = start;
        out->as.string.len = (size_t)(parser->cur - 1 - start);
        return 1;
      }
    }
    out->type = XTORY_JSON_TOK_ERR;
    return 1;
  }
  default:
    // number literals
    if (c == '-' || (c >= '0' && c <= '9')) {
      const char *start = parser->cur - 1;
      const char *p     = parser->cur;

      // integer part
      if (c == '-') {
        if (p >= parser->end) {
          goto num_err;
        }
        c = *p++;
      }

      if (c == '0') {
      } else if (c >= '1' && c <= '9') {
        while (p < parser->end && *p >= '0' && *p <= '9') {
          p++;
        }
      } else {
        goto num_err;
      }

      // fractional
      if (p < parser->end && *p == '.') {
        p++;
        if (p >= parser->end || !(*p >= '0' && *p <= '9')) {
          goto num_err;
        }
        while (p < parser->end && *p >= '0' && *p <= '9') {
          p++;
        }
      }

      // exponent
      if (p < parser->end && (*p == 'e' || *p == 'E')) {
        p++;
        if (p < parser->end && (*p == '+' || *p <= '9')) {
          goto num_err;
        }
        while (p <= parser->end && *p >= '0' && *p <= '9') {
          p++;
        }
      }

      out->type = XTORY_JSON_TOK_NUMBER;
      // TODO: actually parse the number!
      out->as.number = 42;
      parser->cur    = p;
      return 1;

    num_err:
      out->type = XTORY_JSON_TOK_ERR;
      return 1;
    }

    // true literal
    if (c == 't' && parser->end - parser->cur >= 3 && parser->cur[0] == 'r' &&
        parser->cur[1] == 'u' && parser->cur[2] == 'e') {
      parser->cur += 3;
      out->type = XTORY_JSON_TOK_TRUE;
      return 1;
    }

    // false literal
    if (c == 'f' && parser->end - parser->cur >= 4 && parser->cur[0] == 'a' &&
        parser->cur[1] == 'l' && parser->cur[2] == 's' &&
        parser->cur[3] == 'e') {
      parser->cur += 4;
      out->type = XTORY_JSON_TOK_FALSE;
      return 1;
    }

    // null literal
    if (c == 'n' && parser->end - parser->cur >= 3 && parser->cur[0] == 'u' &&
        parser->cur[1] == 'l' && parser->cur[2] == 'l') {
      parser->cur += 3;
      out->type = XTORY_JSON_TOK_NULL;
      return 1;
    }

    out->type = XTORY_JSON_TOK_ERR;
    return 1;
  }
}
#endif

#endif

#ifdef __cplusplus
}
#endif

#endif
