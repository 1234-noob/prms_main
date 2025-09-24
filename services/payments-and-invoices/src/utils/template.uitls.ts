export function renderWithData(html: string, data: Record<string, any>): string {
      return html.replace(/{{(.*?)}}/g, (_, key) => {
        const value = key.trim().split('.').reduce((acc: { [x: string]: any; }, k: string | number) => acc?.[k], data);
        return value ?? '';
      });
    }

    export enum TemplateCode {
  INVOICE = 'INVOICE',
  RECEIPT = 'RECEIPT',
}
