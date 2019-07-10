class Subscribes {
  constructor(){
    this._clients = new Set();
  }
  subscribe(ctx){
    return new Promise( resolve => {
      const client = {resolve: resolve, ctx: ctx};
      this._clients.add(client);

      ctx.res.on('close', ()=>{
        if (ctx.res.finished) return;
        this._clients.delete(client);
        resolve();
      })
    });
  }
  publish(ctx, message){
    for (const client of this._clients){
      client.ctx.body = message;
      client.resolve();
    }
    this._clients.clear();
    ctx.body = 'publish ok';
  }
}

module.exports = new Subscribes();
