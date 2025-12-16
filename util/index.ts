/**
 * Removes common leading whitespace from a multi-line string/template literal.
 * Preserves relative indentation.
 * @param {string} text - The raw string from the template literal.
 */
export const htmlIndent = (text:string) => {
    // 1. Split the text into lines
    const lines = text.split('\n')

    // 2. Find the minimum common leading indentation (excluding empty lines)
    // This regex matches leading spaces/tabs at the start of a non-empty line
    const leadingWhitespaceMatches:number[] = lines
        .filter(line => line.trim().length > 0)  // Filter out empty lines
        // Get length of leading whitespace
        .map(line => line.match(/^(\s*)/)?.[0].length ?? 0)

    // If no non-empty lines, return original text
    if (leadingWhitespaceMatches.length === 0) {
        return text
    }

    // Find the smallest non-zero leading space length
    const minIndent = Math.min(...leadingWhitespaceMatches)

    // 3. Trim the common indentation from all lines
    const result = lines.map(line => {
        // If the line is purely whitespace or the first line
        // (often a blank one), don't touch it
        if (line.trim().length === 0 || line === lines[0]) {
            // Just return it trimmed to a blank line or first line
            return line.trim()
        }
        // Remove the found common minimum indentation
        return line.substring(minIndent)
    }).join('\n')

    // 4. Trim leading/trailing newlines and spaces from the final result
    return result.trim()
}
