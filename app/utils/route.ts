
  type Test<Type extends "healthcheck"|"logout"|"sign-in"|"sign-up"|"_app.travel.$travel"|"_index"> =  {
    -readonly [Property in keyof Type]: Type[Property];
  }

  interface Options<T extends "healthcheck"|"logout"|"sign-in"|"sign-up"|"_app.travel.$travel"|"_index"> {
    params?: Test<T>
  }
  
  export function route<T extends "healthcheck"|"logout"|"sign-in"|"sign-up"|"_app.travel.$travel"|"_index">(id: T, options: Options<T> = {}) {
      
          if(id === "healthcheck") {
           return "/healthcheck"
      }
          if(id === "logout") {
           return "/logout"
      }
          if(id === "sign-in") {
           return "/sign-in"
      }
          if(id === "sign-up") {
           return "/sign-up"
      }
          if(id === "_app.travel.$travel") {
           const segments = "/travel/$travel".split("/").map((segment) => {

        const params = options?.params ?? []
        
        const newSegment = Object.entries(params).find(([param,]) => segment === "$" + param)
        
        return newSegment ? newSegment[1] : segment
      })
      return segments.join("/")
      }
          if(id === "_index") {
           return "/"
      }
      throw new Error("Unkown route")
  }