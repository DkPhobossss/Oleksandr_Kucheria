import { useMemo, ReactNode } from "react";
import WalletRow from "./WalletRow";

interface BoxProps {
  children?: ReactNode;
}

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string | any; //1. added field blockchain, could be string(prob not any)
}

//1.1 Extending
interface FormattedWalletBalance {
  /*currency: string;
  amount: number;*/
  formatted: string;
}

interface WalletPrice {
  [key:string]: number
}

interface Props extends BoxProps {}

//2. Helpers in sepparate file
function useWalletBalances(): WalletBalance[] {
  return [
    { currency: "OSMO", amount: 1, blockchain: "Osmosis" },
    { currency: "ETH", amount: 2, blockchain: "Ethereum" },
    { currency: "ARB", amount: 3, blockchain: "Arbitrum" },
    { currency: "ZIL", amount: 4, blockchain: "Zilliqa" },
    { currency: "NEO", amount: 0, blockchain: "Neo" },
    { currency: "LUNA", amount: 44, blockchain: "Luna" },
  ];
}

//3. this function also could be outside
function getPriority(blockchain: string | any): number {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
    case "Neo": //4. we could place it after, cozz they are equal
      return 20;
    default:
      return -99;
  }
}

//3.a) getPriority could be wrote like usePrices
function usePrices(): WalletPrice {
  return {
    ["OSMO"] : 0.380658,
    ["ETH"] : 2400,
    ["ARB"] : 0.4964,
    ["ZIL"] : 0.013205,
    ["NEO"] : 9.55,
  }
}

//3.b) If we need 2(or more) calls from getPriority, we can create function
//getPriority([...blockchains]) ( return results[];) and return values for all blockchains in one iteration

export const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        /*const balancePriority = getPriority(balance.blockchain);
        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;*/
        
        if (balance.amount <= 0) {
          //5. false, not true
          return false;
        }
        //6. Call function, only if amount > 0
        const balancePriority = getPriority(balance.blockchain);
        //7. lhsPriority doesnt exist
        return ( balancePriority > -99 ); 
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        /*if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }*/

       //8. more simple and 0, when equal
        return rightPriority - leftPriority;
      });
      //9. price has no dependencies with Memo
  }, [balances/*, prices*/]);

  
  /*const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );*/

  //10. No need to call method map 2 times, we can calculate formattedAmount here
  const rows = sortedBalances.map(
    (balance: WalletBalance, index: number) => {
      //11.toFixed(2) => Format to 2 decimal places
      const formattedAmount = balance.amount.toFixed(2); 
      const usdValue = prices[balance.currency] * balance.amount;

      return (
        <WalletRow
          /*className={classes.row}*/
          //12. classes.row is undefined, but im not sure what field we should use here
          className={balance.currency}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={formattedAmount}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
