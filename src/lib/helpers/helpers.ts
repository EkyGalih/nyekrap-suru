
export function extractYear(title: string): string | null {
    const match = title.match(/\((\d{4})\)/);
    return match ? match[1] : null;
}

export function extractEndpoint(href: string): string {
    return href.replace("/detail/", "").replaceAll("/", "").trim();
}
