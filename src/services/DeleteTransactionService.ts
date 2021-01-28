import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const transaction = await transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new AppError('There is no transaction with this Id.');
    }

    await transactionRepository.delete({ id });
  }
}

export default DeleteTransactionService;
