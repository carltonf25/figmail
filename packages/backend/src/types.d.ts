declare module 'mjml' {
  interface MjmlResult {
    html: string;
    errors: any[];
  }
  
  function mjml2html(mjmlMarkup: string, options?: any): MjmlResult;
  export = mjml2html;
}

declare module 'cors' {
  import { RequestHandler } from 'express';
  function cors(options?: any): RequestHandler;
  export = cors;
}

declare module 'juice' {
  function juice(html: string, options?: any): string;
  export = juice;
}
