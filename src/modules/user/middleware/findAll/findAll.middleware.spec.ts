import { NextFunction, Response } from 'express';
import { CustomRequest } from '../../../../config/types';
import { FindAllMiddleware } from './findAll.middleware';

describe('FindAllMiddleware', () => {
  const createSut = () => new FindAllMiddleware();

  const req = {
    query: {},
    user: { role: 'admin' },
  } as CustomRequest;

  const jsonMock = jest.fn();
  const statusMock = jest.fn().mockImplementation(() => ({
    json: jsonMock,
  }));

  const res = {
    status: statusMock,
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deve retornar 400 se a permissão, se vier for diferente admin e user', () => {
    const sut = createSut();

    req.query = { role: 'usuario' };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'A permissão deve ser obrigatóriamente ou (admin) ou (user)',
    });
  });

  it('Deve retornar 400 se o sortBy for diferente de name e createdAt', () => {
    const sut = createSut();

    req.query = { role: 'user', sortBy: 'nome' };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message:
        'A forma de organização deve ser ou por (name) ou por (createdAt)',
    });
  });

  it('Deve retornar 400 se o order for diferente de ASC e DESC', () => {
    const sut = createSut();

    req.query = { role: 'user', sortBy: 'name', order: 'asc' };

    sut.use(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'A ordem deve ser ou (ASC) ou (DESC)',
    });
  });
});
