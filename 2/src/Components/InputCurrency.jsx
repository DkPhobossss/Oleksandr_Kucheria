import { useRef, useEffect } from "react";
const imageUrl =
  "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/";

export default function InputCurrency({
  children,
  id,
  onCurrencyChange,
  onAmountChange,
  currencies,
  currency,
  amount,
  disabledCurrency,
  error
}) {
  const imageRef = useRef(null);

  useEffect(() => {
    if ( currency )
        loadImage(imageRef.current, imageUrl + currency + ".svg");
  }, [currency]);

  function loadImage(imageElement, src) {
    const downloadingImage = new Image();
    downloadingImage.onload = function () {
      imageElement.src = this.src;
      imageElement.style.display = "block";
    };
    downloadingImage.onerror = function () {
      imageElement.style.display = "none";
    };
    downloadingImage.src = src;
  }

  return (
    <div className="currencySwap__block">
      <label className="currencySwap__text" htmlFor={id}>
        {children}
      </label>
      <div className="currencySwap__outerBlock" data-error={error}>
        <div className="currencySwap__inputBlock">
          <input
            type="number"
            onChange={onAmountChange}
            min={0}
            step={0.01}
            className="currencySwap__input"
            id={id}
            placeholder="0"
            value={amount}
          />
          <img
            ref={imageRef}
            style={{ display: "none" }}
            alt=""
            className="currencySwap__img"
          />
        </div>
        <select
          className="currencySwap__dropdown"
          onChange={(e) => onCurrencyChange(e.target.value, id)}
          disabled={currencies.length < 2}
          value={currency}
        >
          {currencies.map((v) => (
            <option key={v} value={v} disabled={disabledCurrency === v}>
              {v}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
