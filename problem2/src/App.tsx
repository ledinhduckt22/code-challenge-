/* eslint-disable @typescript-eslint/no-explicit-any */
import "./App.css";
import { Button, Form } from "antd";
import PriceInput from "./components/PriceInput";
import { ArrowDownOutlined } from "@ant-design/icons";
import { priceByCurrency, tokenInfo } from "./constants";

function App() {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    alert(
      `Swap ${values.sender.number} (${values.sender.currency}) to ${values.receiver.number} (${values.receiver.currency})`
    );
  };

  const checkPrice = (_: any, value: { number: number }) => {
    if (value.number > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Price must be greater than zero!"));
  };

  return (
    <Form
      form={form}
      name="customized_form_controls"
      layout="inline"
      onFinish={onFinish}
      initialValues={{
        sender: {
          number: 0,
          currency: undefined,
        },
        receiver: {
          currency: tokenInfo[0].value,
        },
      }}
      className="customized_form"
    >
      <Form.Item
        name="sender"
        label="Amount to send"
        rules={[{ validator: checkPrice }]}
      >
        <PriceInput
          value={form.getFieldValue("sender")}
          onChange={(value) => {
            const receiverInfo = form.getFieldValue("receiver");
            const priceSender = priceByCurrency?.find(
              (priceItem) => priceItem.currency === value.currency
            )?.price;
            const priceReceiver =
              receiverInfo?.currency === value.currency
                ? priceSender
                : priceByCurrency?.find(
                    (priceItem) => priceItem.currency === receiverInfo.currency
                  )?.price;
            form.setFieldValue("receiver", {
              number:
                priceSender && value.number && priceReceiver
                  ? (priceSender * value.number) / priceReceiver
                  : 0,
              currency: receiverInfo?.currency,
            });
          }}
        />
      </Form.Item>
      <ArrowDownOutlined />
      <Form.Item name="receiver" label="Amount to receive">
        <PriceInput
          isDisableInput
          onChange={(value) => {
            const senderInfo = form.getFieldValue("sender");
            const priceSender = priceByCurrency?.find(
              (priceItem) => priceItem.currency === senderInfo.currency
            )?.price;
            const priceReceiver = priceByCurrency?.find(
              (priceItem) => priceItem.currency === value.currency
            )?.price;
            form.setFieldValue("receiver", {
              number:
                priceSender && value.number && priceReceiver
                  ? (priceSender * value.number) / priceReceiver
                  : 0,
              currency: value?.currency,
            });
          }}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          CONFIRM SWAP
        </Button>
      </Form.Item>
    </Form>
  );
}

export default App;
