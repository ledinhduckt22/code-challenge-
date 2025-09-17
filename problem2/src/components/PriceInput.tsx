import React, { useState, type Key } from "react";
import { Image, Input, Select } from "antd";
import { tokenInfo } from "../constants";
import type { UUIDTypes } from "uuid";

const { Option } = Select;

interface PriceValue {
  number?: number;
  currency?: string;
}

interface PriceInputProps {
  id?: string;
  value?: PriceValue;
  onChange?: (value: PriceValue) => void;
  isDisableInput?: boolean;
}

interface Token {
  id: UUIDTypes;
  title: string;
  value: string;
  icon: string;
}

const PriceInput: React.FC<PriceInputProps> = (props) => {
  const { id, value = {}, onChange, isDisableInput } = props;
  const [number, setNumber] = useState<number | undefined>(value.number);
  const [currency, setCurrency] = useState(tokenInfo[0].value);

  const triggerChange = (changedValue: {
    number?: number;
    currency?: string;
  }) => {
    console.log("changedValue === ", changedValue);
    onChange?.({ number, currency, ...changedValue });
  };

  const onNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = parseInt(e.target.value || "0", 10);
    if (Number.isNaN(number)) {
      return;
    }
    if (!("number" in value)) {
      setNumber(newNumber);
    }
    triggerChange({ number: newNumber, currency });
  };

  const onCurrencyChange = (newCurrency: string) => {
    if (!("currency" in value)) {
      setCurrency(newCurrency);
    }
    triggerChange({ number, currency: newCurrency });
  };

  return (
    <span id={id}>
      <Input
        type="number"
        value={value.number || number}
        onChange={onNumberChange}
        style={{ width: 300 }}
        disabled={isDisableInput}
      />
      <Select
        style={{ width: 150, margin: "0 8px" }}
        onChange={onCurrencyChange}
        defaultValue={tokenInfo[0].value}
      >
        {tokenInfo?.map((token: Token) => (
          <Option key={token.id as Key} value={token.value}>
            <Image
              src={token.icon}
              width={24}
              height={24}
              preview={false}
              rootClassName="option-custom"
            />
            {token.title}
          </Option>
        ))}
      </Select>
    </span>
  );
};

export default PriceInput;
