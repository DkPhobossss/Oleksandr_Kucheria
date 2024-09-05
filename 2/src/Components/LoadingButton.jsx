export default function LoadingButton({ children, inProgress }) {
  return (
    <button
      type="submit"
      disabled={inProgress}
      className={"currencySwap__button" + (inProgress ? " loading" : "")}
    >
      {children}
    </button>
  );
}
