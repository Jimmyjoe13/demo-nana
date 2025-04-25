declare module "memorystore" {
  import session from "express-session";
  function MemoryStore(session: typeof session): typeof session.Store;
  export = MemoryStore;
}
