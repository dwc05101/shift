import styled from "styled-components"
import { theme } from "./theme"

export const CenterContainerWithBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-size: 100% 100%;
`

export const Container = styled.div`
  height: 100vh;
  width: 100vw;
`

export const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

export const Content = styled.div`
  background: ${theme.colors.grey};
  width: 100%;
  height: calc(100vh - 50px);
  padding: 2%;
`

export const InnerShadowedBox = styled.div`
  height: 100%;
  width: 100%;
  min-width: 1380px;
  min-height: 690px;
  background: white;
  padding: 2%;
  display: flex;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`
