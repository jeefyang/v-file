module.exports = {
  apps: [{
    name: "vfile",
    port: "3012",
    exec_mode: "cluster",
    instance: "max",
    script: './.output/server/index.mjs',
    watch: ['./.output']
  }],
};
