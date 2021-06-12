/* eslint @typescript-eslint/ban-types:0 */

export interface MPLD3 {
  _mpld3IsLoaded: true
  version: string
  draw_figure(
    figid: string,
    spec: unknown,
    process?: unknown,
    clearElem?: unknown
  ): void
  remove_figure(figid: string): void
}

declare global {
  const mpld3: MPLD3
}
export default mpld3
