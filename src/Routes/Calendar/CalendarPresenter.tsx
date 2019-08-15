import { Calendar } from "antd"
import locale from "moment/locale/ko"
import React from "react"
import { Container, Content, InnerShadowedBox } from "../../styledComponents"

const CalendarPresenter: React.SFC = () => {
  return (
    <Container>
      <Content>
        <InnerShadowedBox>
          <Calendar locale={locale} />
        </InnerShadowedBox>
      </Content>
    </Container>
  )
}

export default CalendarPresenter
