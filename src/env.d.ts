
export interface IProcessEnv {
   MONGOOSE_URL: string
   PORT: number
   API_BASE_URL: string
}

declare global {
   namespace NodeJS {
      interface ProcessEnv extends IProcessEnv { }
   }
}
