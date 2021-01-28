import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(transactions: Request[]): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();
    const transactionsSaved = [];

    for (const t of transactions) {
      transactionsSaved.push(await createTransaction.execute(t));
    }
    return transactionsSaved;
  }
}

export default ImportTransactionsService;
