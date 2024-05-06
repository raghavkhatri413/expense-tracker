import React, { useState, useEffect } from 'react';
import './MainPage.css';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, push, onValue, update } from "firebase/database";
import app from "../firebase";
import { auth } from "../firebase";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


function MainPage({ onSignOut }) {
  const [isIncomeFormOpen, setIsIncomeFormOpen] = useState(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [incomeAmount, setIncomeAmount] = useState(0);
  const [incomeDescription, setIncomeDescription] = useState('');
  const [incomeDate, setIncomeDate] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState('');

  const openIncomeForm = () => setIsIncomeFormOpen(true);
  const closeIncomeForm = () => setIsIncomeFormOpen(false);

  const openExpenseForm = () => setIsExpenseFormOpen(true);
  const closeExpenseForm = () => setIsExpenseFormOpen(false);

  const [transactionHistory, setTransactionHistory] = useState([]);

  const [isAllTransactionsOpen, setIsAllTransactionsOpen] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const [userEmail, setUserEmail] = useState('');

  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();
  const db = getDatabase(app);


  // To update 'balance' in main-page
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const balanceRef = ref(db, `users/${user.uid}/balance`);
        onValue(balanceRef, (snapshot) => {
          const balanceData = snapshot.val();
          if (balanceData !== null) {
            setBalance(balanceData);
          }
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [db]);


  // To update user(transaction) data in main-page(for Recent Transactions)
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fetch balance
        const balanceRef = ref(db, `users/${user.uid}/balance`);
        onValue(balanceRef, (snapshot) => {
          const balanceData = snapshot.val();
          if (balanceData !== null) {
            setBalance(balanceData);
          }
        });

        const transactionsRef = ref(db, `users/${user.uid}/transactions`);
        onValue(transactionsRef, (snapshot) => {
          const transactionsData = snapshot.val();
          if (transactionsData !== null) {
            const transactionsArray = Object.entries(transactionsData).map(([key, value]) => ({
              id: key,
              ...value
            }));
            setTransactionHistory(transactionsArray.slice(-5).reverse());
          }
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [db]);


  // Called when 'Explore all transactions' is clicked and it fetches all the transactions data from database and displays it in main-page
  const openAllTransactions = () => {
    setIsAllTransactionsOpen(true);
    const transactionsRef = ref(db, `users/${auth.currentUser.uid}/transactions`);
    onValue(transactionsRef, (snapshot) => {
      const transactionsData = snapshot.val();
      if (transactionsData !== null) {
        const transactionsArray = Object.entries(transactionsData).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setAllTransactions(transactionsArray.reverse());
      }
    });
  };

  // To close All transactions data table
  const closeAllTransactions = () => {
    setIsAllTransactionsOpen(false);
    setAllTransactions([]);
  };

  // To export user data as pdf
  const printAsPDF = () => {
    const doc = new jsPDF();
    const table = document.querySelector('#table');

    doc.autoTable({
      html: table,
    });

    doc.save('table.pdf');
  };


  // To update 'total income' and 'total expense' in database and display it in main-page by fetching from database
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const transactionsRef = ref(db, `users/${user.uid}/transactions`);
        onValue(transactionsRef, (snapshot) => {
          const transactionsData = snapshot.val();
          if (transactionsData !== null) {
            const incomeTotal = Object.values(transactionsData)
              .filter(transaction => transaction.type === 'income')
              .reduce((total, transaction) => total + transaction.amount, 0);
            setTotalIncome(incomeTotal);

            const expenseTotal = Object.values(transactionsData)
              .filter(transaction => transaction.type === 'expense')
              .reduce((total, transaction) => total + transaction.amount, 0);
            setTotalExpense(expenseTotal);

            update(ref(db, `users/${user.uid}`), {
              totalIncome: incomeTotal,
              totalExpense: expenseTotal
            }).then(() => {
              console.log("Total income and total expense updated successfully");
            }).catch(error => {
              console.error("Error updating total income and total expense: ", error);
            });
          }
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [db]);



  // To update 'balance' in database when income is added
  const handleIncomeFormSubmit = (event) => {
    event.preventDefault();

    const incomeData = {
      type: 'income',
      amount: incomeAmount,
      description: incomeDescription,
      date: incomeDate
    };

    const newBalance = balance + incomeAmount;

    push(ref(db, `users/${auth.currentUser.uid}/transactions`), incomeData)
      .then(() => {
        console.log("Income added successfully");
        setIncomeAmount(0);
        setIncomeDescription('');
        setIncomeDate('');
        closeIncomeForm();

        // Update balance in the database
        update(ref(db, `users/${auth.currentUser.uid}`), { balance: newBalance })
          .then(() => {
            console.log("Balance updated successfully");
            setBalance(newBalance);
          })
          .catch(error => {
            console.error("Error updating balance: ", error);
          });
      })
      .catch(error => {
        console.error("Error adding income: ", error);
      });
  };


  // To update 'balance' in database when expense is added
  const handleExpenseFormSubmit = (event) => {
    event.preventDefault();

    const expenseData = {
      type: 'expense',
      amount: expenseAmount,
      description: expenseDescription,
      date: expenseDate
    };

    const newBalance = balance - expenseAmount; // Calculate new balance

    // Push transaction data under the user's UID node
    push(ref(db, `users/${auth.currentUser.uid}/transactions`), expenseData)
      .then(() => {
        console.log("Expense added successfully");
        setExpenseAmount(0);
        setExpenseDescription('');
        setExpenseDate('');
        closeExpenseForm();

        // Update balance in the database
        update(ref(db, `users/${auth.currentUser.uid}`), { balance: newBalance })
          .then(() => {
            console.log("Balance updated successfully");
            setBalance(newBalance);
          })
          .catch(error => {
            console.error("Error updating balance: ", error);
          });
      })
      .catch(error => {
        console.error("Error adding expense: ", error);
      });
  };


  // To get user email from database
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [db]);


  //Displays user's email
  const handleAccountInfoClick = () => {
    alert(`User Email: ${userEmail}`);
  };


  //Signs out the user
  const handleSignOut = () => {
    onSignOut();
    navigate('/signin');
  };

  return (
    <main>
      <div className={`overlay ${isIncomeFormOpen || isExpenseFormOpen ? 'show' : ''}`} />

      <div className="top-bar">
        <button className="account-info-button" onClick={handleAccountInfoClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
          </svg>
        </button>
        <button className="sign-out-button" onClick={handleSignOut}>Sign Out</button>
        <h1 className="current-balance">Current Balance : {balance}</h1>
      </div>

      <div className="total-boxes">
        <div className="total-income-box">
          <h3>Total Income</h3>
          <p>{totalIncome}</p>
        </div>
        <div className="total-expense-box">
          <h3>Total Expense</h3>
          <p>{totalExpense}</p>
        </div>
      </div>

      <div className="transaction-history">
        <h2>Recent Transactions</h2>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactionHistory.map(transaction => (
              <tr key={transaction.id} className={transaction.type === 'income' ? 'income' : 'expense'}>
                <td>{transaction.type}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.description}</td>
                <td>{transaction.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isAllTransactionsOpen && (
        <div className="exploreBalance">
          <button onClick={openAllTransactions}>Explore All Transactions</button>
        </div>)}

      <footer>
        <div class="copyright">
          <p>&copy; 2024 Raghav Khatri. All rights reserved.</p>
        </div>
      </footer>

      {isAllTransactionsOpen && (
        <div className="popup popup-above">
          <div className="popup-content">
            <button className="close-btn" onClick={closeAllTransactions}>Close</button>
            <button className="print-pdf-btn" onClick={printAsPDF}>Export as PDF</button>
            <h2>All Transactions</h2>
            <table id="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {allTransactions.map(transaction => (
                  <tr key={transaction.id} className={transaction.type === 'income' ? 'income' : 'expense'}>
                    <td>{transaction.type}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Buttons to add income and expense */}
      <div className="bottom-bar">
        <div className="addIE">
          <div className="addIncome">
            <button onClick={openIncomeForm}>+ Add Income</button>
          </div>
          <div className="addExpense">
            <button onClick={openExpenseForm}>- Add Expense</button>
          </div>
        </div>
      </div>

      {isIncomeFormOpen && (
        <div className="popup-form">
          <form className="form-container" onSubmit={handleIncomeFormSubmit}>
            <h2>Add Income</h2>
            <input type="number" placeholder="Enter income amount" onChange={(e) => setIncomeAmount(parseInt(e.target.value, 10))} />
            <input type="text" placeholder="Enter income description" value={incomeDescription} onChange={(e) => setIncomeDescription(e.target.value)} />
            <input type="date" placeholder="Enter income date" value={incomeDate} onChange={(e) => setIncomeDate(e.target.value)} />
            <button type="submit">Add Income</button>
            <button type="button" onClick={closeIncomeForm}>Cancel</button>
          </form>
        </div>
      )}

      {isExpenseFormOpen && (
        <div className="popup-form">
          <form className="form-container" onSubmit={handleExpenseFormSubmit}>
            <h2>Add Expense</h2>
            <input type="number" placeholder="Enter expense amount" onChange={(e) => setExpenseAmount(parseInt(e.target.value, 10))} />
            <input type="text" placeholder="Enter expense description" value={expenseDescription} onChange={(e) => setExpenseDescription(e.target.value)} />
            <input type="date" placeholder="Enter expense date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} />
            <button type="submit">Add Expense</button>
            <button type="button" onClick={closeExpenseForm}>Cancel</button>
          </form>
        </div>
      )}
    </main>
  );
}

export default MainPage;
