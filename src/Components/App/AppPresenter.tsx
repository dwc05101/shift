import React from "react"

interface IProps {
  isLoggedIn: boolean
}
const AppPresenter: React.SFC<IProps> = ({ isLoggedIn }) => (
  <>{isLoggedIn ? "로그인" : "로그아웃"}</>
)

export default AppPresenter
