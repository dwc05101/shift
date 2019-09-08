import { Table, Tag, Typography } from "antd"
import React from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import Loading from "../../Components/Loading"
import { Container, Content, InnerShadowedBox } from "../../styledComponents"
import { GetTimeTables } from "../../types/api"
import isoToRelative from "../../utils/isoToRelative"

interface IProps {
  loading: boolean
  data: GetTimeTables | undefined
}

const ViewTimeTablePresenter: React.SFC<IProps> = ({ loading, data }) => {
  return (
    <Container>
      <Content>
        <InnerShadowedBox>
          {loading ? (
            <Loading />
          ) : (
            <Wrapper>
              <Header>
                <Typography.Title level={1}>시간표 관리</Typography.Title>
              </Header>
              <Body>
                <Table
                  columns={columns}
                  dataSource={parseData(data)}
                  loading={loading}
                />
              </Body>
            </Wrapper>
          )}
        </InnerShadowedBox>
      </Content>
    </Container>
  )
}

const columns = [
  {
    dataIndex: "id",
    title: "코드"
  },
  {
    dataIndex: "yearMonthWeek",
    render: (date: string) => <span>{isoToRelative(date)}</span>,
    title: "주간"
  },
  {
    dataIndex: "isConfirmed",
    render: (isConfirmed: boolean) =>
      isConfirmed ? (
        <Tag color="blue">확정됨</Tag>
      ) : (
        <Tag color="red">미확정</Tag>
      ),
    title: "확정여부"
  },
  {
    dataIndex: "more",
    render: (id: number) => <Link to={`/timetable/${id}`}>더 보기</Link>,
    title: ""
  }
]

const parseData = (data: GetTimeTables | undefined): any[] => {
  const parsed: any[] = []
  if (data) {
    if (data.GetTimeTables.timetables) {
      data.GetTimeTables.timetables.forEach(timetable => {
        const element = {
          id: data.GetTimeTables.timetables!.indexOf(timetable),
          isConfirmed: timetable!.isConfirmed,
          key: timetable!.id,
          more: timetable!.id,
          yearMonthWeek: timetable!.yearMonthWeek
        }
        parsed.push(element)
      })
    }
  }

  return parsed.sort((a, b) => b.id - a.id)
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 10%;
`

const Body = styled.div`
  width: 100%;
  height: 90%;
`

export default ViewTimeTablePresenter
