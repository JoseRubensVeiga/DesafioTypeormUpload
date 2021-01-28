import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    if (!['income', 'outcome'].some(o => o === type)) {
      throw new AppError('The transaction type must be income or outcome.');
    }

    const transactionsRepository = getCustomRepository(TransactionRepository);
    const categoriesRepository = getRepository(Category);

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw new AppError(
        'The value must be smaller than the current balance total.',
      );
    }

    let categoryDB = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!categoryDB) {
      categoryDB = await categoriesRepository.save(
        categoriesRepository.create({
          title: category,
        }),
      );
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id: categoryDB.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
