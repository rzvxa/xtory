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

#define XTORY_IMPLEMENTATION
#define XTORY_ENABLE_JSON

#include "xtory.h"
#include <stdio.h>

// NOLINTBEGIN(clang-analyzer-security.insecureAPI.DeprecatedOrUnsafeBufferHandling)
static int xtory_test_fail_internal(const char* test, const char* msg) {
    fprintf(stderr, "[FAIL] %s: %s\n", test, msg);
    return 1;
}
// NOLINTEND(clang-analyzer-security.insecureAPI.DeprecatedOrUnsafeBufferHandling)

typedef struct {
  int total;
  int failed;
  const char *current_test;
} xtory_test_context;

static xtory_test_context XTORY_TEST_CTX = {0};

#define XTORY_TEST(name) int name(void)

#define XTORY_BEGIN_TEST(name)                                                 \
  do {                                                                         \
    XTORY_TEST_CTX.current_test = #name;                                       \
    XTORY_TEST_CTX.total++;                                                    \
  } while (0)

#define XTORY_FAIL(msg) \
  do { \
    XTORY_TEST_CTX.failed++; \
    return xtory_test_fail_internal(XTORY_TEST_CTX.current_test, msg); \
  } while (0)

#define XTORY_ASSERT(cond)                                                     \
  do {                                                                         \
    if (!(cond)) {                                                             \
      XTORY_FAIL("Assertion failed: " #cond);                                  \
    }                                                                          \
  } while (0)

#define XTORY_ASSERT_EQ(a, b)                                                  \
  do {                                                                         \
    if ((a) != (b)) {                                                          \
      fprintf(stderr, "[FAIL] %s: %s != %s (%d != %d)\n",                      \
              XTORY_TEST_CTX.current_test, #a, #b, (int)(a), (int)(b));        \
      XTORY_TEST_CTX.failed++;                                                 \
      return 1;                                                                \
    }                                                                          \
  } while (0)

#define XTORY_RUN_TESTS(...)                                                   \
  xtory_run_tests((int (*[])(void)){__VA_ARGS__},                              \
                  sizeof((int (*[])(void)){__VA_ARGS__}) /                     \
                      sizeof(int (*)(void)))

static int xtory_run_tests(int (*tests[])(void), int count) {
  for (int i = 0; i < count; i++) {
    tests[i]();
  }

  if (XTORY_TEST_CTX.failed == 0) {
    printf("All %d tests passed.\n", XTORY_TEST_CTX.total);
    return 0;
  }

  printf("%d/%d tests failed.\n", XTORY_TEST_CTX.failed, XTORY_TEST_CTX.total);
  return 1;
}

XTORY_TEST(test_load_from_json) {
  XTORY_BEGIN_TEST(test_load_from_json);

  XTORY_ASSERT(1 == 1);

  return 0;
}

int main() { return XTORY_RUN_TESTS(test_load_from_json); }
