import { Button, Table, Tag, Typography } from "antd"
import moment from "moment"
import React from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import Loading from "../../Components/Loading"
import Nav from "../../Components/Nav/NavContainer"
import { Container, Content, InnerShadowedBox } from "../../styledComponents"
import { GetTimeTables } from "../../types/api"

interface IProps {
  loading: boolean
  data: GetTimeTables | undefined
  selectedRowKeys: string[]
  onChange: (selectedRowKeys: any) => void
  goToMakeTimetable: () => void
}

const ViewTimeTablePresenter: React.SFC<IProps> = ({
  loading,
  data,
  selectedRowKeys,
  onChange,
  goToMakeTimetable
}) => {
  const rowSelection = {
    onChange,
    selectedRowKeys
  }
  return (
    <Container>
      <Nav isProfile={false} isSettings={false} defaultKey={"timetable"} />
      <Content>
        <InnerShadowedBox>
          {loading ? (
            <Loading />
          ) : (
            <Wrapper>
              <Header>
                <Typography.Title level={1}>시간표 관리</Typography.Title>
                <Operations>
                  <Button
                    type="danger"
                    disabled={selectedRowKeys.length === 0}
                    style={{ marginRight: "20px" }}
                  >
                    삭제
                  </Button>
                  <Button type="primary" onClick={goToMakeTimetable}>
                    추가
                  </Button>
                </Operations>
              </Header>
              <Body>
                <Table
                  columns={columns}
                  rowSelection={rowSelection}
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

const isoToRelative = (isoWeek: string) => {
  const year = isoWeek.substring(0, 4)
  const week = isoWeek.substring(4)

  const isoMoment = moment()
    .isoWeekYear(parseInt(year, 10))
    .isoWeek(parseInt(week, 10))

  const dayCurrent = isoMoment.startOf("isoWeek").date()

  const weekOfMonth =
    moment().isoWeek() -
    moment()
      .subtract(dayCurrent - 1, "day")
      .isoWeek() +
    1

  return `${year}년 ${isoMoment.month() + 1}월 ${weekOfMonth}주차`
}

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

  return parsed
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

const Operations = styled.div`
  width: fit-content;
  height: 100%;
  margin-left: auto;
  display: flex;
`
const Body = styled.div`
  width: 100%;
  height: 90%;
`

export default ViewTimeTablePresenter
