import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import csvToJson from 'csvtojson';

import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import Transaction from '../models/Transaction';

const upload = multer();

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find({
    relations: ['category'],
    select: [
      'id',
      'title',
      'value',
      'type',
      'category',
      'created_at',
      'updated_at',
    ],
  });

  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    type,
    value,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id);

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    // console.log(request.file);

    const transactionsToBeIncluded = await csvToJson().fromString(
      request.file.buffer.toString(),
    );

    const importTransactions = new ImportTransactionsService();

    const transactions = await importTransactions.execute(
      transactionsToBeIncluded,
    );

    return response.json({ transactions });
  },
);

export default transactionsRouter;
