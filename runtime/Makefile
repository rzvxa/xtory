# MIT License
#
# Copyright (c) 2026 rzvxa
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

# ---------------------------------------
# Build directories
# ---------------------------------------

BUILDDIR := build
LIBDIR   := $(BUILDDIR)
BINDIR   := $(BUILDDIR)

HEADER   := xtory.h
SRC      := xtory.c
TARGET   := xtory
TESTSRC  := xtory_test.c

ifeq ($(OS),Windows_NT)
TESTBIN := $(BINDIR)/xtory_test.exe
else
TESTBIN := $(BINDIR)/xtory_test
endif

# Optional JSON support
ifeq ($(JSON),1)
CFLAGS += -DXTORY_ENABLE_JSON
endif

# Detect platform
ifeq ($(OS),Windows_NT)
PLATFORM := windows
else
UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Darwin)
PLATFORM := mac
else
PLATFORM := linux
endif
endif

# ---------------------------------------
# Platform-specific settings
# ---------------------------------------

ifeq ($(PLATFORM),windows)
CC       := clang
CFLAGS   += -O2
OUTFILE  := $(LIBDIR)/xtory.dll
IMPLIB   := $(LIBDIR)/xtory.lib
TEST_LIB := $(IMPLIB)
endif

ifeq ($(PLATFORM),mac)
CC       := clang
CFLAGS   += -O2 -dynamiclib
OUTFILE  := $(LIBDIR)/lib$(TARGET).dylib
TEST_LIB := $(OUTFILE)
endif

ifeq ($(PLATFORM),linux)
CC       := gcc
CFLAGS   += -O2 -fPIC -shared
OUTFILE  := $(LIBDIR)/lib$(TARGET).so
TEST_LIB := $(OUTFILE)
endif

ifeq ($(PLATFORM),windows)
MKDIR = cmd /C "mkdir"
else
MKDIR = mkdir -p $(1)
endif

# ---------------------------------------
# Build rules
# ---------------------------------------

all: $(OUTFILE)

$(BUILDDIR):
	$(MKDIR) $(BUILDDIR)

# Windows: DLL + import library
ifeq ($(PLATFORM),windows)
$(OUTFILE): $(SRC) $(HEADER) | $(BUILDDIR)
	$(CC) -o $(OUTFILE) $(SRC) \
	-Wl,/DLL \
	-Wl,/IMPLIB:$(IMPLIB)
endif

# macOS shared library
ifeq ($(PLATFORM),mac)
$(OUTFILE): $(SRC) $(HEADER) | $(BUILDDIR)
	$(CC) $(CFLAGS) $(SRC) -o $(OUTFILE)
endif

# Linux shared library
ifeq ($(PLATFORM),linux)
$(OUTFILE): $(SRC) $(HEADER) | $(BUILDDIR)
	$(CC) $(CFLAGS) $(SRC) -o $(OUTFILE)
endif

# ---------------------------------------
# Test build + run
# ---------------------------------------

test: $(OUTFILE) $(TESTSRC) | $(BUILDDIR)
	$(CC) $(TESTSRC) -o $(TESTBIN) $(TEST_LIB)
	./$(TESTBIN)

# ---------------------------------------
# Cleanup
# ---------------------------------------

clean:
	rm -rf $(BUILDDIR)

.PHONY: all clean test
