import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const income = this.sumTransactionsValues(
      transactions.filter(t => t.isIncome()),
    );
    const outcome = this.sumTransactionsValues(
      transactions.filter(t => t.isOutcome()),
    );
    return {
      income,
      outcome,
      total: income - outcome,
    };
  }

  private sumTransactionsValues(transactions: Transaction[]): number {
    return transactions.reduce((acc, c) => acc + c.value, 0);
  }
}

export default TransactionsRepository;
