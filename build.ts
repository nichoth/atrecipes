import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { globby } from 'globby'
import matter from 'gray-matter'
import path from 'node:path'
import { orderBy } from 'lodash-es'
import markdownit from 'markdown-it'
import * as prettier from 'prettier'
import { html as PageTemplate } from './src/_template.js'
import { html as RecipeHtml } from './src/_recipe.js'

// __dirname doesn't work like normal because we pipe this to node
const __dirname = process.cwd()
const OUTPUT_PATH = path.join(__dirname, 'public')
const md = markdownit()
const BASE_PATH = process.env.BASE_PATH || '/'

async function build () {
    await mkdir(OUTPUT_PATH, { recursive: true })
    const paths = await globby(path.join(__dirname, 'src', '_posts', '[!_]*.md'))

    // Parse all files and collect metadata
    const posts = await Promise.all(paths.map(async p => {
        const file = await readFile(p, 'utf8')
        const fm = matter(file)
        const { date, slug, description, linkTitle } = fm.data
        return {
            path: p,
            date,
            slug,
            description,
            linkTitle,
            content: fm.content
        }
    }))

    // Sort by date (newest first)
    const sortedPosts = orderBy(posts, p => new Date(p.date), ['desc'])

    // Write individual recipe pages
    await Promise.all(sortedPosts.map(async (post) => {
        await mkdir(path.join(OUTPUT_PATH, post.slug), { recursive: true })
        await writeFile(
            path.join(OUTPUT_PATH, post.slug, 'index.html'),
            await prettier.format(RecipeHtml({
                base: BASE_PATH,
                body: md.render(post.content),
                date: post.date,
                description: post.description
            }), { parser: 'html' })
        )
    }))

    // Write index page
    await writeIndex(sortedPosts)
}

/**
 * Write the index page.
 * @param posts `date` must be ISO format (2025-01-01)
 */
async function writeIndex (posts:{
    slug:string;
    linkTitle:string;
    description:string;
    date:Date;
}[]) {
    const indexPage = await prettier.format(PageTemplate({
        classes: 'index',
        base: BASE_PATH,
        description: 'A collection of recipes for AT protocol',
        body: `
        <div class="route index">
            <h1>AT Recipes</h1>
            <p class="description">
                A collection of recipes and things for working with the
                <a href="https://atproto.com/">AT protocol</a>.
            </p>

            <ul class="index">
                ${posts.map(post => {
                    const dateString = post.date ?
                        new Intl.DateTimeFormat('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        }).format(post.date) :
                        ''
                    const isoDate = (new Date(post.date).toISOString().split('T')).shift()

                    return `
                    <li>
                        <a href="${BASE_PATH + post.slug}/">
                            <div>
                                ${md.render(post.linkTitle)}
                                <time datetime="${isoDate}" class="date">
                                    ${dateString}
                                </time>
                            </div>
                            ${post.description ? md.render(post.description) : ''}
                        </a>
                    </li>
                `
                }).join('')}
            </ul>
        </div>
        `
    }), {
        parser: 'html'
    })

    await writeFile(path.join(OUTPUT_PATH, 'index.html'), indexPage)
}

build()
