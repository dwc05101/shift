import React from "react"

import "animate.css/animate.min.css"
import { Icon } from "antd"
import ScrollAnimation from "react-animate-on-scroll"
import Nav from "../../Components/Nav/NavContainer"
import calendar from "../../images/calendar.png"
import colorLogo from "../../images/logo.svg"
import logo from "../../images/logo_white_300px.svg"
import mobile from "../../images/smartphone.png"
import "./Main.css"

interface IState {
  mainCurrent: string
}

class Main extends React.Component<{}, IState> {
  private homeRef: React.RefObject<HTMLInputElement>
  private indexMobileRef: React.RefObject<HTMLInputElement>
  private indexCalendarRef: React.RefObject<HTMLInputElement>
  private indexLogoRef: React.RefObject<HTMLInputElement>

  private divRefs: Array<React.RefObject<HTMLInputElement>>

  public constructor(props) {
    super(props)

    this.state = {
      mainCurrent: "home"
    }

    this.homeRef = React.createRef()
    this.indexMobileRef = React.createRef()
    this.indexCalendarRef = React.createRef()
    this.indexLogoRef = React.createRef()

    this.divRefs = [
      this.homeRef,
      this.indexMobileRef,
      this.indexCalendarRef,
      this.indexLogoRef
    ]
  }

  public componentDidMount() {
    window.addEventListener("scroll", (event: Event) => {
      console.log(event)
    })
  }

  public render() {
    return (
      <>
        <Nav
          isMain={true}
          mainHandler={this.handleMainNavClick}
          mainCurrent={this.state.mainCurrent}
        />
        <div className="gradient" ref={this.homeRef}>
          <img className="logo-invert" src={logo} alt="logo" />
          <div className="title">Shift</div>
          <div className="body">이게 바로 시프트다~~~ 이말이야!</div>
          <Icon
            className="nextPage"
            type="down-circle"
            style={{ color: "#fff" }}
            onClick={() => {
              this.handleMainNavClick(1)
            }}
          />
        </div>
        <section>
          <div className="section-body" ref={this.indexMobileRef}>
            <div className="wordPic">
              <div className="word">모바일로 지원한다~~~ 이말이야!</div>
              <div className="pic">
                <ScrollAnimation animateIn="fadeInRight">
                  <img src={mobile} className="content-image" alt="mobile" />
                </ScrollAnimation>
              </div>
            </div>
            <div className="icons">
              <Icon
                className="flexNext"
                type="down-circle"
                style={{ color: "#000" }}
                onClick={() => {
                  this.handleMainNavClick(2)
                }}
              />
              <Icon
                className="flexNext"
                type="up-circle"
                style={{ color: "#000" }}
                onClick={() => {
                  this.handleMainNavClick(0)
                }}
              />
            </div>
          </div>
        </section>
        <section>
          <div className="section-body" ref={this.indexCalendarRef}>
            <div className="wordPic">
              <div className="pic">
                <ScrollAnimation animateIn="fadeInLeft">
                  <img
                    src={calendar}
                    className="content-image"
                    alt="calendar"
                  />
                </ScrollAnimation>
              </div>

              <div className="word">만드는데 1분도 안걸린다~~~ 이말이야!</div>
            </div>
            <div className="icons">
              <Icon
                className="flexNext"
                type="down-circle"
                style={{ color: "#000" }}
                onClick={() => {
                  this.handleMainNavClick(3)
                }}
              />
              <Icon
                className="flexNext"
                type="up-circle"
                style={{ color: "#000" }}
                onClick={() => {
                  this.handleMainNavClick(1)
                }}
              />
            </div>
          </div>
        </section>
        <section>
          <div className="section-body" ref={this.indexLogoRef}>
            <div className="wordPic">
              <div className="word">패러다임을 바꿔버린다~~~ 이말이야!</div>
              <div className="pic">
                <ScrollAnimation animateIn="fadeInRight">
                  <img
                    src={colorLogo}
                    className="content-image"
                    alt="logo-colored"
                  />
                </ScrollAnimation>
              </div>
            </div>
            <div className="icons">
              <Icon
                className="flexNext"
                type="home"
                style={{ color: "#000" }}
                onClick={() => {
                  this.handleMainNavClick(0)
                }}
              />

              <Icon
                className="flexNext"
                type="up-circle"
                style={{ color: "#000" }}
                onClick={() => {
                  this.handleMainNavClick(2)
                }}
              />
            </div>
          </div>
        </section>
        <section>
          <div className="footer">
            <div className="bold">Copyright © Shift 2020</div>
          </div>
        </section>
      </>
    )
  }

  private handleMainNavClick = (index: number) => {
    const target = this.divRefs[index]

    if (target.current) {
      target.current.scrollIntoView({
        behavior: "smooth",
        block: "end"
      })

      if (index < 1) {
        this.setState({
          mainCurrent: "home"
        })
      } else {
        this.setState({
          mainCurrent: "features"
        })
      }
    }
  }
}

export default Main
