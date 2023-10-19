# BS-less Object Notation specification 23.0.0 (BSON23)
## Overview of BSON
- BSON is designed as a general purpose application based object notation (not designed for web or JavaScript in mind)
- Store integers, floating points, arrays, objects, and arrays/objects containing more of the before mentioned
- BS-less:
  - Many symbols could have been implicit
  - Remove bloat and dependencies
  - < 1.0% makefile
## Overview of 23.0.0 (Replacement of BSON-prototype)
 - Full and intuitive replacement of BSON-prototype
 - Utilize tree structure to organize and read from BSON text
	 - Full potential of the scopes
 - Passing of BSON text as apposed to a file path to a BSON file
 - Introduction of BSON node
 - Removal of hash map for this version
	 - Later version may  reimplement for optimization reasons
 - Removal of any automatic data retrieval for this version
	 - Designing integral functionality (tree, memory management)
	 - Will reimplement in a later version
## Library
### Node
Each node is a node in a tree that represents the parsed BSON
```c
typedef struct bs_bsonnode {
	const char *key;
	union {
		long                  lng;
		double                dbl;
		char                 *str;
		struct bs_bsonnode   *arr;
		struct bs_bsonnode   *obj;
	};
	size_t numchildren;
	bsonenum flags;
} bsonnode;
```
### Read BSON
Creates a tree based off the BSON code and returns the root of that tree.
```c
bsonnode *bson_parse(const char * const code);
```
### Free BSON
Free the tree back to memory.
```c
void bson_free(bsonnode **root);
```
### Getting a node from the tree
Search the tree relative to the give node `obj`. Only gets immediate children of `obj`.
```c
bsonnode *bson_get(const bsonnode * const obj, const char * const key);
```
## Syntax
### Integers
All integers are represented as 8 byte signed integers, syntactically has no decimal places.
```
myinteger 1
```
### Decimals
Decimals are represented as 8 byte floating points, syntactically has a one decimal place.
```
mydecimal 3.14
```
### Strings
Strings have quotes around them, as god intended.
```
mystring "Very cool!"
```
### Arrays
Arrays have a bracket surrounding the series of data. Unfortunately, they are sets of any type.
```
myarray [
	1 2.2 "Hello" 1 "3" 2.1
]
```
### Objects
Objects use braces around the series of data. With BSON23 all data must have a left hand name associated with it like other data.
```
myobject {
	myinteger  1
	mydecimal 3.14
	mystring "Hello World!"
	myarray [ 1 2 3 4 ]
}
```
### Combining
The aforementioned data can be combined for organization purposes
```
info {
	name "Dave"
	version "1.1.2"
}
friends [
	{ name "alex" age 33 }
	{ name "james" age 24 }
	{ name "josie" age 5 species "dog" }
]
scope {
	array [ "What" 1 "is" 2 "this" 3.3 "crap" ]
	reference {
		id 4
		places [ 0 1 3 ]
	}
}
```
## Usage
### Hello world
```
hello "Hello"
world "World!"
special 32
```
```c
#include <stdio.h>
#include <assert.h>
#include <bson/bson.h>

int main(void) {
	char *file = /* read file */
	bsonnode *root = bson_parse(file);
	/* Check if NULL */
	
	bsonnode *hello = bson_get(root, "hello");
	bsonnode *world = bson_get(root, "world");
	printf("%s %s\n", hello->str, world->str);
	bsonnode *special = bson_get(root, "special");
	printf("%ld\n", special->lng);

	bson_free(root);
	free(file);
	return 0;
}
```
### Bigger example
```
integer 5
double  6.6
array [ "Hello" 2 "Beautiful" "World" 66.6 ]
scope {
	object {
		first "Jeff"
		last "Dungus"
	}
}
```
```c
#include <stdio.h>
#include <assert.h>
#include <bson/bson.h>

int main(void) {
	char *file = /* read file */
	bsonnode *root = bson_parse(file);
	/* Check if NULL */
	
	bsonnode *node = bson_get(root, "integer");
	printf("%ld\n", node->lng);
	
	node = bson_get(root, "double");
	printf("%ld\n", node->dbl);

	node = bson_get(root, "array");
	size_t i;
	for(i = 0; i < node->numchildren; i++) {
		if(node->arr[i].type == BSON_STRING)
			printf("%s ", node->arr[i].str);
	}
	putchar('\n');

	node = bson_get(root, "scope");
	node = bson_get(node, "object");
	for(i = 0; i < node->numchildren; i++) {
		if(node->arr[i].type == BSON_STRING)
			printf("%s: \"%s\" ", node->arr[i].key, node->arr[i].str);
	}
	putchar('\n');
	node = bson_get(node, "last");
	if(node->type == BSON_STRING)
		printf("%s\n", node->str);
	
	bson_free(root);
	free(file);
	return 0;
}
```
