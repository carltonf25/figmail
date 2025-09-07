const map: Record<string, string> = {
  "{{first_name}}": "*|FNAME|*",
  "{{last_name}}": "*|LNAME|*",
  "{{email}}": "*|EMAIL|*",
  "{{unsubscribe}}": "*|UNSUB|*",
  "{{webversion}}": "*|ARCHIVE|*"
};
export function replaceMergeTags(source: string) {
  return Object.entries(map).reduce((acc, [k, v]) => acc.replaceAll(k, v), source);
}
