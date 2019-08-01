import "styled-components"

declare module "styled-components" {
  export interface ShiftTheme {
    colors: {
      [key: string]: string
    }
  }
}
