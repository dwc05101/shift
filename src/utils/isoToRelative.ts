import moment from "moment"

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

export default isoToRelative
