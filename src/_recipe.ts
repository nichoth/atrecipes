import { html as PageHtml } from './_template.js'

// the template for an individual recipe page
export function html ({ body, date, description, base }:{
    body:string;
    base?:string;
    date:string;
    description:string;
}):string {
    const BASE_PATH = base || '/'

    const me = `
        <header>
            <a href="${BASE_PATH}">< back that way</a>
        </header>
        <div class="route recipe">
            ${body}
        </div>
    `

    return PageHtml({
        base: BASE_PATH,
        body: me,
        date,
        description,
        classes: 'recipe'
    })
}
