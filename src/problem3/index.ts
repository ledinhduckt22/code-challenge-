import React, { useMemo } from "react";

// interface WalletBalance {
//   currency: string;
//   amount: number;
//   blockchain?: string;
// }
// interface FormattedWalletBalance {
//   currency: string;
//   amount: number;
//   formatted: string;
// }

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain?: string;
}
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

// 1. Use extends to create FormattedWalletBalance from WalletBalance instead of creating a new one

// 2. Can not find BoxProps interface, useWalletBalances, usePrices
interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // 3. Zilliqa and Neo has the same result that is returned so can replace like this
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
      case "Neo":
        return 20;
      // case "Zilliqa":
      //   return 20;
      // case "Neo":
      //   return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    // 4. blockchain is not exists in WalletBalance so it will show errors -> define this one into the WalletBalance interface
    // 5. lhsPriority is not defined while we have balancePriority to use
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        if (balancePriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);

        // 6. Can write clean in here, lack of case left and right equal
        return rightPriority - leftPriority;
        // if (leftPriority > rightPriority) {
        //   return -1;
        // } else if (rightPriority > leftPriority) {
        //   return 1;
        // }
      });
  }, [balances, prices]);

  // 7. this value is not used
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  // 8. sortedBalances does not have formatted properties, should use formattedBalances instead
  const rows = formattedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      // 8. index should not be used as key, can use balance.currency instead
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          // key={index}
          key={balance.currency}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
