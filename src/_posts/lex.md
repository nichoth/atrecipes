---

linkTitle: "Use `lex` with custom lexicons"
description: "`lex` can generate lexicons via URL or local JSON"
slug: lex
type: recipe
date: 2025-12-15

---

# Use `lex` with custom lexicons

Have you seen
[the `lex` CLI tool](https://github.com/bluesky-social/atproto/tree/main/packages/lex/lex)?
It can install [lexicons](https://atproto.com/guides/lexicon),
which are JSON documents, and also build the corresponding typescript.

Pass in [the NSID](https://atproto.com/specs/nsid) of some lexicons.
It will create a folder `lexicons/` in the project root with
the JSON definitions for the given NSIDs.

```bash
# install two lexicons
npx lex install app.bsky.feed.post app.bsky.feed.like
```

*But* &mdash; what if you are using custom lexicons? How to easily create
typescript for them too? Put custom lexicons in a local directory, and copy
them to the `lexicons` folder as part of an `npm` script.

## The Custom Lexicon

This is defined locally. Is is copied by `rsync` to
the `lexicons/...` folder.

The `npx lex build` command creates typescript based on `lexicons/`.
It will create type definitions in the `src/lexicons/` folder.
**`src/lexicons` is ignored by `git`**.

```js
// lexicons-custom/app/my-application/actor/profile.json
{
  "lexicon": 1,
  "id": "app.my-application.actor.profile",
  "defs": {
    "main": {
      "type": "record",
      "description": "A declaration of a basic account profile.",
      "key": "literal:self",
      "record": {
        "type": "object",
        "properties": {
          "displayName": {
            "type": "string",
            "maxGraphemes": 64,
            "maxLength": 640
          },
          "description": {
            "type": "string",
            "description": "Free-form profile description text.",
            "maxGraphemes": 256,
            "maxLength": 2560
          },
          "avatar": {
            "type": "blob",
            "description": "Small image to be displayed next to posts from account. AKA, 'profile picture'",
            "accept": ["image/png", "image/jpeg"],
            "maxSize": 1000000
          },
          "createdAt": { "type": "string", "format": "datetime" }
        }
      }
    }
  }
}
```

## The Build Script

You can use the `rsync` command to copy your custom lexicons into the
`lexicons/` folder. That way you can re-install via `npx lex install ...`,
and still keep your custom lexicons, because they are in a different source
folder.

`lexicons/` is the default folder name created by `lex` after
you install. **It is committed to git**. It is used by `lex build`
to create the corresponding typescript.

```js
// package.json
{
    // ...
    "scripts": {
        "lex:install": "lex install app.bsky.feed.post app.bsky.feed.like && rsync -a ./lexicons-custom/app/my-application/ ./lexicons/app/my-application/",
        "lex:build": "rm -rf src/lexicons && lex build"
    }
    // ...
}
```
