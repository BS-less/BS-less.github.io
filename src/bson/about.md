# BS-less Object Notation
BSON is designed as a general purpose application based object notation (not designed for web or JavaScript in mind). BSON removes syntax that is unnecessary or counter-intuitive.
### Significant syntactical changes
- Keys no longer have quotes around them.
- Commas removed.
- The BSON is inherintly and object, it does not require top level braces.
### Significant similarities of BSON & JSON
- Support of
  - Integers & floating point
  - Strings
  - Arrays & Objects
- Arrays are typeless
### [Documentation](404)
### [Source](https://github.com/bs-less/BSON)
#### Notes
- BSON is still in development, both the language and the official library.
- The official library follows variations of BSON23.
  - BSON23.X may not be compatible with their counter part versions.
  - BSON24.X and future versions will remain backwards compatible with the final version of BSON23.
```
bson {
    info {
        spec   "23.1"
        date   "Nov-2-23"
        model  "bs-less"
    }
    contrib {
        authors [
            "LoneC"
            "CoherentNonsense"
        ]
//      other [
//
//      ]
    }
}
```
