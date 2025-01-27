console.log(1);

await Bun.build({
  entrypoints: ["./[[default]].ts"],
  outdir: "../functions",
  target: "node",
});

console.log(2);
