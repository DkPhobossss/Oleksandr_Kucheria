import "./CurrencySwapForm.css";
import InputCurrency from "../InputCurrency";
import LoadingButton from "../LoadingButton";
import { useEffect, useState } from "react";

const currenciesListURL = "https://interview.switcheo.com/prices.json";
const currenciesPricesURL = "https://interview.switcheo.com/prices.json";

export default function CurrencySwapForm() {
  useEffect(() => {
    (async () => {
      const data = await fetchCurrenciesList(currenciesListURL);
      setCurrenciesCrypto(data);
      setformState({
        ...formState,
        firstCurrency: data[0],
        secondCurrency: data[1],
      });
    })();
  }, []);

  const errorDefaultState = {
    firstCurrency: null,
    secondCurrency: null,
  };

  const [currenciesCrypto, setCurrenciesCrypto] = useState([]);
  const [inProgress, setInProgress] = useState(false);
  const [error, setError] = useState(errorDefaultState);

  const [formState, setformState] = useState({
    firstCurrencyAmount: 0,
    firstCurrency: undefined,
    secondCurrencyAmount: 0,
    secondCurrency: undefined,
    mainInput: "firstCurrency",
  });

  async function fetchCurrenciesList(url) {
    const abortController = new AbortController();
    const signal = abortController.signal;
    try {
      const response = await fetch(url, { signal });
      let data = await response.json();

      const filteredData = data
        .reduce((a, b) => {
          if (!a.includes(b.currency)) {
            a.push(b.currency);
          }
          return a;
        }, [])
        .sort((a, b) => {
          if (a < b) {
            return -1;
          }
          if (a > b) {
            return 1;
          }
          return 0;
        });

      return filteredData;
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Abort:" + error.message);
      } else {
        console.log(error.message);
      }
    }
  }

  async function fetchCurrenciesPrices(url, currencyTag1, currencyTag2) {
    const abortController = new AbortController();
    const signal = abortController.signal;
    try {
      const response = await fetch(url, { signal });
      let data = await response.json();

      //for cycle would be faster cozz of break when values are founded
      return data.reduce((a, b) => {
        if (b.currency === currencyTag1) {
          a[currencyTag1] = b.price;
        } else if (b.currency === currencyTag2) {
          a[currencyTag2] = b.price;
        }
        return a;
      }, {});
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Abort:" + error.message);
      } else {
        console.log(error.message);
      }
    }
  }

  function onCurrencyChange(value, id) {
    setformState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let sendAmount, sendCurrency, receiveCurrency, receiveField;
    if (formState.mainInput === "firstCurrency") {
      sendAmount = parseInt(formState.firstCurrencyAmount);
      sendCurrency = formState.firstCurrency;
      receiveCurrency = formState.secondCurrency;
      receiveField = 'secondCurrencyAmount';
    } else {
      sendAmount = parseInt(formState.secondCurrencyAmount);
      sendCurrency = formState.secondCurrency;
      receiveCurrency = formState.firstCurrency;
      receiveField = 'firstCurrencyAmount';
    }

    if (isNaN(sendAmount) || sendAmount <= 0) {
      setError((prevState) => ({
        ...prevState,
        [formState.mainInput]: "Value should be positive integer.",
      }));
      return false;
    }

    setError(errorDefaultState);
    setInProgress(true);

    try {
      //assume every time prices is different so make request each time.
      const currenciesPrices = await fetchCurrenciesPrices(currenciesPricesURL, formState.firstCurrency, formState.secondCurrency);
      const reciveAmount = sendAmount * currenciesPrices[sendCurrency] / currenciesPrices[receiveCurrency];
      
      //extra delay
      await (new Promise(resolve => setTimeout(resolve, 1000) )  );

      setformState((prevState) => ({
        ...prevState,
        [receiveField] : reciveAmount.toFixed(2)
      }));
    } finally {
      setInProgress(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="currencySwap">
      <InputCurrency
        id="firstCurrency"
        currencies={currenciesCrypto}
        onCurrencyChange={onCurrencyChange}
        onAmountChange={(e) => {
          setError((prevState) => ({
            ...prevState,
            firstCurrency: null,
          }));
          setformState((prevState) => ({
            ...prevState,
            firstCurrencyAmount: e.target.value,
            mainInput: "firstCurrency",
          }));
        }}
        currency={formState.firstCurrency}
        amount={formState.firstCurrencyAmount}
        disabledCurrency={formState.secondCurrency}
        error={error.firstCurrency}
      >
        Amount to {formState.mainInput === "firstCurrency" ? "send" : "receive"}
      </InputCurrency>
      <InputCurrency
        id="secondCurrency"
        currencies={currenciesCrypto}
        onCurrencyChange={onCurrencyChange}
        onAmountChange={(e) => {
          setError((prevState) => ({
            ...prevState,
            secondCurrency: null,
          }));
          setformState((prevState) => ({
            ...prevState,
            secondCurrencyAmount: e.target.value,
            mainInput: "secondCurrency",
          }));
        }}
        currency={formState.secondCurrency}
        amount={formState.secondCurrencyAmount}
        disabledCurrency={formState.firstCurrency}
        error={error.secondCurrency}
      >
        Amount to {formState.mainInput === "firstCurrency" ? "receive" : "send"}
      </InputCurrency>
      <LoadingButton inProgress={inProgress}>Confirm Swap</LoadingButton>
    </form>
  );
}
