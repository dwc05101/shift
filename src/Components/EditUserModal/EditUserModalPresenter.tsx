import { Form, Icon, Input, Modal, Select } from "antd"
import React from "react"

interface IProps {
  visible: boolean
  loading: boolean
  name: string
  phoneNumber: string
  personalCode: string
  userRank: number
  onInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
  onSubmit: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onSelectChange: (value: any) => void
}

const EditUserModalPresenter: React.SFC<IProps> = ({
  visible,
  loading,
  name,
  phoneNumber,
  personalCode,
  userRank,
  onInputChange,
  onCancel,
  onSubmit,
  onSelectChange
}) => {
  return (
    <Modal
      title="구성원 편집"
      visible={visible}
      okText="저장"
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
}

export default EditUserModalPresenter
