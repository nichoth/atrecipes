export function html ({
    base,
    body,
    title,
    siteName,
    ogType,
    description,
    classes
}:{
    body:string;
    date?:string;
    base?:string;
    description?:string;
    title?:string;
    siteName?:string;
    ogType?:string;
    classes?:string;
}):string {
    const BASE_PATH = base || '/'

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta property="og:type" content="${ogType || 'website'}" />
            <meta name="og:site_name" content="${siteName || 'AT Recipes'}" />
            <meta property="og:title" content="${title || 'AT Recipes'}" />
            <meta property="og:description" content="${description}"
                name="description"
            />
            <link rel="stylesheet" href="${BASE_PATH}prism.css" />
            <link rel="stylesheet" href="${BASE_PATH}style.css" />
            <title>AT Recipes${title ? ' | ' + title : ''}</title>
        </head>
        <body${classes ? ` class=${classes}` : ''}>
            ${body}

            <footer>
                <div>
                <code>❤ nichoth</code>
                </div>
                <a href="https://github.com/nichoth/atrecipes">
                    See the source code for this website
                </a>
            </footer>

            <script src="${BASE_PATH}prism.js"></script>
            <script src="${BASE_PATH}index.min.js"></script>
        </body>
        </html>
    `
}
