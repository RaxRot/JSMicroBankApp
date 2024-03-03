'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? movements.slice().sort((a, b) => {
        if (a > b) return 1;
        if (b > a) return -1;
        return 0;
      })
    : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = ` <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${mov} €</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createdUserName = function (accs) {
  return accs.map(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};

createdUserName(accounts);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(x => x > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} €`;

  const outComes = account.movements
    .filter(x => x < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outComes)} €`;

  const interest = account.movements
    .filter(x => x > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest} €`;
};
//calcDisplaySummary(account1.movements);

const deposits = account1.movements.filter(function (mov) {
  return mov > 0;
});
const withdrawals = account1.movements.filter(function (mov) {
  return mov < 0;
});

const balance = account1.movements.reduce(function (acc, cur) {
  return acc + cur;
}, 0);

const maxValue = Math.max(...account1.movements);

const euroToUSd = 1.1;
const totalDepositInUsd = account1.movements
  .filter(mov => mov > 0)
  .map(mov => mov * euroToUSd)
  .reduce((acc, mov) => acc + mov, 0);

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //prevent form for submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName == inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    //DISPLAY UI and message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  } else {
    console.log('LOGIN ERROR');
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const ammount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  inputTransferAmount.value = '';
  inputTransferTo.value = '';

  if (
    ammount > 0 &&
    receiverAccount &&
    currentAccount.balance >= ammount &&
    receiverAccount?.userName !== currentAccount.userName
  ) {
    //Do Transfer
    currentAccount.movements.push(-ammount);
    receiverAccount.movements.push(ammount);

    updateUI(currentAccount);
  } else {
    console.log('TRANSFWR INVALID');
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const ammount = Number(inputLoanAmount.value);
  if (
    ammount > 0 &&
    currentAccount.movements.some(mov => mov >= ammount * 0.1)
  ) {
    //Add movement
    currentAccount.movements.push(ammount);
    //Update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

const updateUI = function (currentAccount) {
  //Display movements
  displayMovements(currentAccount.movements);
  //Display balance
  calcDisplayBalance(currentAccount);
  //Display summary
  calcDisplaySummary(currentAccount);
};

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );

    inputCloseUsername.value = '';
    inputClosePin.value = '';

    console.log(index);
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
});

/////

const overAllBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, cur) => acc + cur, 0);

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

const y = Array.from({ length: 7 }, () => 1);
console.log(y);
