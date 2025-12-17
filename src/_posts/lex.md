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
$ npx lex install app.bsky.feed.post app.bsky.feed.like
```

*But* &mdash; what if I am using custom lexicons in my app? How to easily create
typescript for them too?

## The Lexicon

This is defined locally, in the project. This file is copied by `rsync` to
the `lexicons/...` folder, and the `npx lex build` command creates
typescript in the `src/lexicons` folder based on this file.
`src/lexicons` is ignored by `git`.

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

If you have an app named `my-application.app`, you
can use the `rsync` command to copy your custom lexicons into the `lexicons/`
folder too.

`lexicons/` is the default folder name created by `lex` after
you install, and it is committed to git. It is used by `lex build`
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


