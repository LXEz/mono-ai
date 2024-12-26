const rex = /\$\$(&#\d+;&#\d+;)\s*(.*?)(?=\$\$|$)/g;
const t = '直接输入语言名称：$$&#127482;&#127480;　英１１文$$&#127470;&#127475; 印地语$$&#127465;&#127466; 德语$$&#127464;&#127475; 中文$$&#127471;&#127477; 日语$$&#127472;&#127479; 韩语$$';
const matches = t.matchAll(rex);

const result = [];
for (const match of matches) {
  result.push({
    icon: match[1].trim(),
    label: match[2].trim(),
  });
}
console.log(result);
// console.log(String.fromCodePoint(127482, 127480));
console.log('&#127482;&#127480;');
[
  { icon: '&#127482;&#127480', label: '英１１文' },
  { icon: '&#127470;&#127475', label: '印地语' },
  { icon: '&#127471;&#127477', label: '日语' },
  { icon: '&#127472;&#127479', label: '韩语' },
]
