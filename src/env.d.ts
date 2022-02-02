
export interface IProcessEnv {
   MONGOOSE_URL: string
   PORT: string
   API_BASE_URL: string
}

declare global {
   namespace NodeJS {
      interface ProcessEnv extends IProcessEnv { }
   }
}
