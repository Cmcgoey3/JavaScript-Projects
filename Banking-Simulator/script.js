'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// bankist.netlify.app

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455, -491.67, 3000, -659.26, -135.8, 70, 1300.44],
  interestRate: 1.2, // %
  pin: 1111,
  loans: [],
  movementsDates: {
    '2019-11-18T21:31:17.178Z': 200,
    '2019-12-23T07:42:02.383Z': 455,
    '2020-01-28T09:15:04.904Z': -491.67,
    '2020-04-01T10:17:24.185Z': 3000,
    '2020-05-08T14:11:59.604Z': -659.26,
    '2020-05-27T17:01:17.194Z': -135.8,
    '2020-07-11T23:36:17.929Z': 70,
    '2020-07-12T10:51:36.790Z': 1300.44,
  },
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5012.91, -33.41, -3210.1, -1000, -159, -792.63, 3481.89, 8521.93],
  interestRate: 1.5,
  pin: 2222,
  loans: [],
  movementsDates: {
    '1984-08-25T15:06:13.352Z': 5012.91,
    '1998-11-10T04:15:27.319Z': -33.41,
    '2000-12-05T21:37:33.817Z': -3210.1,
    '2005-08-27T07:18:16.828Z': -1000,
    '2012-09-03T02:39:46.553Z': -159,
    '2013-05-03T20:20:56.737Z': -792.63,
    '2018-08-13T09:21:39.472Z': 3481.89,
    '2020-10-04T07:43:26.566Z': 8521.93,
  },
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [212.43, -200, 340, -306.62, -20.88, 54.29, 404.41, -466.28],
  interestRate: 0.7,
  pin: 3333,
  loans: [],
  movementsDates: {
    '1974-03-29T11:06:46.936Z': 212.43,
    '1974-11-08T21:21:16.433Z': -200,
    '1981-06-21T07:36:34.430Z': 340,
    '1990-03-21T16:01:49.207Z': -306.62,
    '1993-05-30T11:30:27.075Z': -20.88,
    '1993-06-19T06:15:59.594Z': 54.29,
    '2001-02-15T04:58:39.871Z': 404.41,
    '2019-10-30T22:25:58.027Z': -466.28,
  },
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [432, 1000, 726.34, -48.41, 96.3],
  interestRate: 1,
  pin: 4444,
  loans: [],
  movementsDates: {
    '1979-11-13T04:13:08.464Z': 432,
    '1993-07-22T07:58:38.014Z': 1000,
    '2000-01-01T09:43:02.189Z': 726.34,
    '2015-12-04T04:09:56.438Z': -48.41,
    '2017-09-29T21:46:52.050Z': 96.3,
  },
};

const dateOptions = {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

let account, activeTimer, timeRemaining;
let sortedState = true;
const currDate = new Date();

const startTimer = function () {
  timeRemaining = 300;
  const tick = function () {
    const minutes = `${Math.trunc(timeRemaining / 60)}`;
    const seconds = `${timeRemaining % 60}`.padStart(2, '0');
    labelTimer.textContent = `${minutes}:${seconds}`;
    if (timeRemaining === 0) {
      clearInterval(logoutTimer);
      labelWelcome.textContent = '';
      containerApp.style.opacity = 0;
      setTimeout(function () {
        labelTimer.textContent = '5:00';
      }, 2500);
    }
    timeRemaining--;
  };
  tick();

  const logoutTimer = setInterval(tick, 1000);

  return logoutTimer;
};
const createUserNames = function (accs) {
  accs.forEach(function (user) {
    user.userName = user.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserNames(accounts);

const displayMovements = function (movementsDates, sorted = false) {
  let movs = [];
  for (let [key, value] of Object.entries(movementsDates)) {
    movs.push([key, value]);
  }
  if (sorted) {
    movs = movs.sort((a, b) => a[1] - b[1]);
  }
  //   27/05/2019
  containerMovements.innerHTML = '';

  let i = 0;
  for (let [_, mov] of Object.entries(movs)) {
    const movType = mov[1] > 0 ? 'deposit' : 'withdrawal';
    let date = new Date(mov[0]);

    const daysPassed = (currDate - date) / (1000 * 60 * 60 * 25);
    let dateStr;

    dateStr = Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(date);

    if (daysPassed < 1) dateStr = 'Today';
    else if (daysPassed < 2) dateStr = 'Yesterday';

    let transferAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(mov[1]);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${movType}">${
      i + 1
    } ${movType}</div>
      <div class="movements__date">${dateStr}</div>
      <div class="movements__value">${transferAmount}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
    i++;
  }
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce(function (acc, curr) {
    return (acc += curr);
  }, 0);
  labelBalance.textContent = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(account.balance);
  // `${account.balance.toFixed(2)}$`;
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * (account.interestRate / 100))
    .filter(interest => interest >= 1)
    .reduce((acc, value) => acc + value, 0);
  labelSumIn.textContent = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(incomes);
  labelSumOut.textContent = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(out);
  labelSumInterest.textContent = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(interest);
};

const displayfirstDate = function () {
  const dateStr = Intl.DateTimeFormat('en-US', dateOptions).format(currDate);

  labelDate.textContent = dateStr;
};

const updateUI = function (account) {
  calcDisplaySummary(account);
  calcDisplayBalance(account);
  displayMovements(account.movementsDates);
  displayfirstDate(account);
};

btnTransfer.addEventListener('click', function (event) {
  timeRemaining = 300;
  event.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const acc = accounts.find(acc => acc.userName === inputTransferTo.value);

  inputTransferTo.value = inputTransferAmount.value = '';

  if (
    acc &&
    account.userName !== acc.userName &&
    amount <= account.balance &&
    amount > 0
  ) {
    acc.movements.push(amount);
    acc.movementsDates[new Date().toISOString()] = amount;
    account.movements.push(amount * -1);
    account.movementsDates[new Date().toISOString()] = amount * -1;
    updateUI(account);
  }
});

btnLogin.addEventListener('click', function (event) {
  if (activeTimer) {
    clearInterval(activeTimer);
  }
  activeTimer = startTimer();

  event.preventDefault();
  const userID = inputLoginUsername.value;
  const userPin = Number(inputLoginPin.value);
  account = accounts.find(acc => acc.userName === userID);

  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginUsername.blur();
  inputLoginPin.blur();
  if (account?.pin === userPin) {
    labelWelcome.textContent = `Welcome back, ${account.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    updateUI(account);
  }
});

btnLoan.addEventListener('click', function (e) {
  timeRemaining = 300;
  e.preventDefault();

  const loanAmount = Math.round(Number(inputLoanAmount.value));
  inputLoanAmount.value = '';

  const loanApproval = setTimeout(function () {
    if (
      loanAmount > 0 &&
      account.movements.some(
        mov => mov >= loanAmount * 0.1 && !account.loans.includes(mov)
      )
    ) {
      account.movements.push(loanAmount);
      account.movementsDates[new Date().toISOString()] = loanAmount;
      account.loans.push(loanAmount);
      updateUI(account);
    }
  }, 4000);
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    account.pin === Number(inputClosePin.value) &&
    account.userName === inputCloseUsername.value
  ) {
    const userIndex = accounts.findIndex(
      acc => acc.userName === inputCloseUsername.value
    );
    accounts.splice(userIndex, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(account.movementsDates, sortedState);

  sortedState = sortedState ? false : true;
});
