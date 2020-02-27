import 'dotenv/config';
import moment from 'moment';

const flags = Object.freeze('VISA', 'MASTERCARD', 'ELO', 'AMEX');
const modalities = Object.freeze([{ title: 'debito', fee: process.env.DEBIT, day: 0 }, { title: 'credito', fee: process.env.CREDIT, day: 30 }]);

const isValid = (transaction, repository) => {
  const messages = [];
  let isValid = true;
  const regexCurrency = /^(\d+(\.\d{0,2})?|\.?\d{1,2})$/g;

  if (!transaction) messages.push('Invalid data');
  if (!transaction.nsu) messages.push('The "nsu" is required');
  if (!transaction.valor) messages.push('The "valor" is required');
  if (!transaction.horario) messages.push('The "horario is required');
  if (!transaction.bandeira) messages.push('The "bandeira" is required');
  if (!transaction.modalidade) messages.push('The "modalidade" is required');

  if (!Math.sign(transaction.valor)) messages.push('The value of transaction is invalid');
  if (!regexCurrency.test(transaction.valor)) messages.push('The format value of transaction is invalid');
  transaction.valor = Number(transaction.valor).toFixed(2);
  const hourT = moment(new Date(transaction.horario));
  if (!moment(hourT).isValid()) messages.push('The format hour of transaction is invalid');
  transaction.horario = new Date(transaction.horario);
  if (!(transaction.bandeira.toUpperCase()).includes(flags)) messages.push('Invalid: bandeira');

  if (messages.length > 0) isValid = false;

  return { isValid, messages };
}

const normalizeTransaction = (transaction) => {
  const { horario, modalidade, valor } = transaction;
  const modalitiesFilter = modalities.filter(item => item.title === modalidade)[0];
  transaction.liquido = Number(valor - (valor * (modalitiesFilter.fee / 100))).toFixed(2);
  const availableDate = moment(new Date(horario)).add(modalitiesFilter.day, 'days');

  if (transaction.liquido < 0) throw 'Invalid value';
  if (availableDate.day() === 0) availableDate.add(1, 'days');
  else if (availableDate.day() === 6) availableDate.add(3, 'days');
  transaction.disponivel = availableDate.format('YYYY-MM-DD');

  return transaction;
}

const getBalance = (transactions) => {
  const now = moment().format('YYYY-MM-DD');
  const balance = { disponivel: 0, receber: 0 };
  transactions.map((item) => {
    const date = moment(item.disponivel).format('YYYY-MM-DD');
    if (moment(date).valueOf() >= moment(now).valueOf()) {
      balance.receber += Number(item.liquido);
    } else {
      balance.disponivel += Number(item.liquido);
    }
  });
  balance.disponivel = balance.disponivel.toFixed(2);
  balance.receber = balance.receber.toFixed(2);

  return balance;
}

export default { isValid, normalizeTransaction, getBalance };
