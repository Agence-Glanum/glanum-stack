import * as fs from "fs"

function generateRouteMap() {
  const folderPath = __dirname + "/../app/routes"

  const routes = fs.readdirSync(folderPath)
    .map((fileName) => {
      return fileName
    })

  const stringTypes = routes.reduce((acc, route) => {
    const id = route.replace(".tsx", "")

    return `${acc}"${id}"|`
  }, '').slice(0, -1)

  const stringRoutes = routes.reduce((acc, route) => {

      const url = `/${route}`
        .replace(/\.tsx/, "")
        .replace(/\./g, "/")
        .replace(/\/_[a-zA-Z]*/, "")

      const id = route
        .replace(/\.tsx/gi, "")

      const hasDynamicSegment = id.includes('$')

      const paramTemplate = `const segments = "${url === "" ? "/" : url}".split("/").map((segment) => {

        const params = options?.params ?? []
        
        const newSegment = Object.entries(params).find(([param,]) => segment === "$" + param)
        
        return newSegment ? newSegment[1] : segment
      })
      return segments.join("/")`

      return `${acc}
          if(id === "${id}") {
           ${hasDynamicSegment ? paramTemplate : `return "${url === "" ? "/" : url}"`}
      }`
  }, '')

  const functionStub = `
  type Test<Type extends ${stringTypes}> =  {
    -readonly [Property in keyof Type]: Type[Property];
  }

  interface Options<T extends ${stringTypes}> {
    params?: Test<T>
  }
  
  export function route<T extends ${stringTypes}>(id: T, options: Options<T> = {}) {
      ${stringRoutes}
      throw new Error("Unkown route")
  }`

  fs.writeFile(__dirname + "/../app/utils/route.ts", functionStub, function (err) {
    if (err) throw err;
    console.log("Saved!");
  })
}

export default function remixRoutes() {
  return {
    name: "remix-routes", // required, will show up in warnings and errors

    buildStart() {
      generateRouteMap()
    },

    watchChange(id: string,  change: {event: "create" | "update" | "delete" }) {
      if (change.event === "create" || change.event === "delete") {
        generateRouteMap()
      }
    }
  }
}
