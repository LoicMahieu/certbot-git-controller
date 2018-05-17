

declare module "git-url-parse" {
  interface IGitUrlParseResult {
    protocols: string[]; // An array with the url protocols (usually it has one element).
    port: null | number; // The domain port.
    resource: string; // The url domain (including subdomains).
    user: string; // The authentication user (usually for ssh urls).
    pathname: string; // The url pathname.
    hash: string; // The url hash.
    search: string; // The url querystring value.
    href: string; // The input url.
    protocol: string; // The git url protocol.
    token: string; // The oauth token (could appear in the https urls).
    source: string; // The Git provider (e.g. `"github.com"`).
    owner: string; // The repository owner.
    name: string; // The repository name.
    ref: string; // The repository ref (e.g., "master" or "dev").
    filepath: string; // A filepath relative to the repository root.
    filepathtype: string; // The type of filepath in the url ("blob" or "tree").
    full_name: string; // The owner and name values in the `owner/name` format.
    toString: Function; // A function to stringify the parsed url into another url type.
    organization: string; // The organization the owner belongs to. This is CloudForge specific.
    git_suffix: boolean; // Whether to add the `.git` suffix or not.
  }
  function git_url_parse(url: string): IGitUrlParseResult;
  export = git_url_parse
}
