global.Response = class {
  constructor(public body) {}
  json() {
    return Promise.resolve(this.body);
  }
} as unknown as typeof Response;
