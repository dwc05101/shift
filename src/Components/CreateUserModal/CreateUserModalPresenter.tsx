import { Form, Icon, Input, Modal, Select } from "antd"
import React from "react"

interface IProps {
  name: string
  personalCode: string
  phoneNumber: string
  userRank: number
  visible: boolean
  loading: boolean
  onInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
  onSubmit: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onSelectChange: (value: any) => void
}

const CreateUserModalPresenter: React.SFC<IProps> = ({
  name,
  personalCode,
  phoneNumber,
  userRank,
  visible,
  loading,
  onInputChange,
  onSubmit,
  onCancel,
  onSelectChange
}) => (
  <Modal
    title="구성원 추가"
    visible={visible}
    okText="만들기"
    cancelText="취소"
    onOk={onSubmit}
    confirmLoading={loading}
    onCancel={onCancel}
  >
    <Form>
      <Form.Item>
        <Input
          required={true}
          name="name"
          value={name}
          onChange={onInputChange}
          prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25" }} />}
          placeholder="이름"
        />
      </Form.Item>
      <Form.Item>
        <Input
          required={true}
          name="personalCode"
          value={personalCode}
          onChange={onInputChange}
          prefix={<Icon type="tag" style={{ color: "rgba(0,0,0,.25" }} />}
          placeholder="개인번호"
        />
      </Form.Item>
      <Form.Item>
        <Input
          required={true}
          name="phoneNumber"
          value={phoneNumber}
          onChange={onInputChange}
          prefix={<Icon type="phone" style={{ color: "rgba(0,0,0,.25" }} />}
          placeholder="전화번호"
        />
      </Form.Item>
      <Form.Item label="랭크">
        <Select defaultValue={userRank} onChange={onSelectChange}>
          <Select.Option value={1}>1</Select.Option>
          <Select.Option value={2}>2</Select.Option>
          <Select.Option value={3}>3</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  </Modal>
)

export default CreateUserModalPresenter
