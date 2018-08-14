declare module 'markdown' {
  function stripHtml (input: string): string;
  export namespace markdown {
    function toHTML (markdown: string): string;
    function parse (markdown: string): any;
  }
}
