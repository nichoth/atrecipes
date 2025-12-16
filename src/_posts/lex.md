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
