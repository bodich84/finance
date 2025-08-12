import "./styles.css";
import { Button, Card, Row } from "antd";

const Cards = ({
  currentBalance,
  showIncomeModal,
  showExpenseModal,
  showTransferModal,
  income,
  expense,
}) => {
  return (
    <div>
      <div className="balance container">
        <div className="mycard current-balance">
          <h2 className="title">Баланс</h2>
          <div className="balance-amount">₴ {currentBalance}</div>
        </div>

        <div className="mycard">
          <h2 className="mycard-title">Дохід</h2>
          <p>₴ {income}</p>
          <button className="btn reset-balance-btn" onClick={showIncomeModal}>
            Додати дохід
          </button>
        </div>

        <div className="mycard">
          <h2 className="mycard-title">Витрати</h2>
          <p>₴ -{expense}</p>
          <button className="btn reset-balance-btn" onClick={showExpenseModal}>
            Додати витрати
          </button>
        </div>

        <div className="mycard mycard__transfer">
          <h2 className="mycard-title">Переказ</h2>
          <button className="btn reset-balance-btn" onClick={showTransferModal}>
            Додати переказ
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default Cards;
